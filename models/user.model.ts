import { pool } from "@/lib/jespo/db";
import { randomUUID } from "crypto";
import { AdapterUser } from "next-auth/adapters";
import { Account } from "@/models/account.model";
import { Profile, ProfileAttributes } from "@/models/profile.model";
import splitFullName from "@/lib/utils/charset/SplitFullName";

export interface UserAttributes extends AdapterUser {
  lastLoginAt: null;
  createdAt: any;
  name: string;
  image?: string;
  hashedPassword: string;
  role: "USER" | "ADMIN";
}

export interface UserWithProfile extends UserAttributes {
  profile?: ProfileAttributes | null;
}

export class User {
  static tableName = "users";

  static async findAll(): Promise<UserAttributes[]> {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows as UserAttributes[];
  }

  static async findById(id: string): Promise<UserAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id]
    );
    const users = rows as UserAttributes[];
    return users.length ? users[0] : null;
  }

  static async findByEmail(email: string): Promise<UserAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where email = ?`,
      [email]
    );
    const users = rows as UserAttributes[];
    return users.length ? users[0] : null;
  }

  static async create(
    data: Omit<UserAttributes, "id">
  ): Promise<UserAttributes | null> {
    const id = randomUUID();
    const { name, email, emailVerified, image, hashedPassword, role } = data;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (id, name, email, emailVerified, image, hashedPassword, role) 
            VALUES (?,?,?,?,?,?,?)`,
      [
        id,
        name,
        email,
        emailVerified || null,
        image || null,
        hashedPassword,
        role,
      ]
    );

    const splittedName = splitFullName(name);

    //attach user profile
    await Profile.create({
      userId: id,
      firstName: splittedName.firstName,
      lastName: splittedName.lastName,
      email: email,
    });

    // Return the created user by fetching it
    return await this.findById(id);
  }

  static async update(
    id: string,
    data: Partial<UserAttributes>
  ): Promise<boolean> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(data);
    const [result] = await pool.query(
      `
            UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    return (result as any).affectedRows > 0;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return (result as any).affectedRows > 0;
  }

  static async getUserByAccount({
    provider,
    providerAccountId,
  }: {
    provider: string;
    providerAccountId: string;
  }): Promise<UserAttributes | null> {
    const [rows] = await pool.query(
      `
            SELECT u.* FROM ${this.tableName} u JOIN ${Account.tableName} a ON a.userId = u.id WHERE a.provider = ? 
                AND a.providerAccountId = ? LIMIT 1`,
      [provider, providerAccountId]
    );
    const users = rows as UserAttributes[];
    return users.length ? users[0] : null;
  }

  static async updateUser(user: UserAttributes): Promise<UserAttributes> {
    const updated = await this.update(user.id, user);
    if (!updated) {
      throw new Error(`User with id ${user.id} not found`);
    }
    return user;
  }

  static async updateImage(userId: string, image: string): Promise<boolean> {
    const [result] = await pool.query(
      `UPDATE ${this.tableName} SET image = ? WHERE id = ?`,
      [image, userId]
    );

    return (result as any).affectedRows > 0;
  }

  static async findByIdWithProfile(
    id: string
  ): Promise<UserWithProfile | null> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }

    const profile = await Profile.findByUserId(user.id);
    return { ...user, profile };
  }
}
