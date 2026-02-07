import { pool } from "@/lib/jespo/db";
import { randomUUID } from "crypto";
import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { UserSession } from "@/lib/jespo/types";
import { User } from "@/models/user.model";

export interface SessionAttributes extends AdapterSession {
  id?: string;
  userId: string;
  sessionToken: string;
  expires: Date;
}

export class Session {
  static tableName = "sessions";

  static async findAll(): Promise<SessionAttributes[]> {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows as SessionAttributes[];
  }

  static async findById(id: string): Promise<SessionAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id],
    );
    const sessions = rows as SessionAttributes[];
    return sessions.length ? sessions[0] : null;
  }

  static async create(
    data: Omit<SessionAttributes, "id">,
  ): Promise<SessionAttributes | null> {
    const id = randomUUID();
    const { userId, sessionToken, expires } = data;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (id, userId, sessionToken, expires)
            VALUES (?,?,?,?)`,
      [id, userId, sessionToken, expires],
    );

    // Return the created session by fetching it
    return await this.findById(id);
  }

  static async update(
    data: Partial<SessionAttributes>,
  ): Promise<SessionAttributes | null> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(data);
    const [result] = await pool.query(
      `
            UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
      [...values, data.id],
    );
    const sessions = result as SessionAttributes[];
    return sessions.length ? sessions[0] : null;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE id = ?`,
      [id],
    );
    return (result as any).affectedRows > 0;
  }

  static async deleteSession(sessionToken: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE sessionToken = ?`,
      [sessionToken],
    );
    return (result as any).affectedRows > 0;
  }

  static async getSessionAndUser(sessionToken: string) {
    const [rows] = await pool.query(
      `
            SELECT * FROM ${this.tableName} s JOIN ${User.tableName} u ON s.userId = u.id 
            WHERE s.sessionToken = ? LIMIT 1`,
      [sessionToken],
    );
    const row = rows as UserSession[];
    const object = row.length ? row[0] : null;

    if (object === null) {
      return null;
    }

    const user = {
      id: object.id,
      name: object.name,
      email: object.email,
      emailVerified: object.emailVerified,
      image: object.image,
    } as AdapterUser;

    const session = {
      sessionToken: object.sessionToken,
      userId: object.userId,
      expires: object.expires,
    } as AdapterSession;

    return { session, user };
  }
}

/**
 * import { RowDataPacket } from "mysql2";
 *
 * interface DBUser {
 *   id: string;
 *   name?: string | null;
 *   email?: string | null;
 *   emailVerified?: Date | null;
 *   image?: string | null;
 * }
 *
 * interface DBSession {
 *   sessionToken: string;
 *   userId: string;
 *   expires: Date;
 * }
 *
 * async function getSessionAndUser(sessionToken: string) {
 *   const [rows] = await pool.query<
 *     (RowDataPacket & {
 *       sessionToken: string;
 *       userId: string;
 *       expires: Date;
 *       id: string;
 *       name: string | null;
 *       email: string | null;
 *       emailVerified: Date | null;
 *       image: string | null;
 *     })[]
 *   >(
 *     `SELECT
 *         s.sessionToken,
 *         s.userId,
 *         s.expires,
 *         u.id AS id,
 *         u.name,
 *         u.email,
 *         u.emailVerified,
 *         u.image
 *      FROM sessions s
 *      JOIN users u ON s.userId = u.id
 *      WHERE s.sessionToken = ?
 *      LIMIT 1`,
 *     [sessionToken]
 *   );
 *
 *   const row = rows[0];
 *   if (!row) return null;
 *
 *   const user: DBUser = {
 *     id: row.id,
 *     name: row.name,
 *     email: row.email,
 *     emailVerified: row.emailVerified,
 *     image: row.image,
 *   };
 *
 *   const session: DBSession = {
 *     sessionToken: row.sessionToken,
 *     userId: row.userId,
 *     expires: row.expires,
 *   };
 *
 *   return { session, user };
 * }
 */
