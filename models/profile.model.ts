import { pool } from "@/lib/jespo/db";
import { randomUUID } from "crypto";

export interface ProfileAttributes {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
}

export class Profile {
    static tableName = "profiles";

    static async findByUserId(userId: string): Promise<ProfileAttributes | null> {
        const [rows] = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE userId = ? LIMIT 1`,
            [userId]
        );

        const profiles = rows as ProfileAttributes[];
        return profiles.length ? profiles[0] : null;
    }


    static async create(
        data: Omit<ProfileAttributes, "id">,
    ): Promise<ProfileAttributes | null> {

        const id = randomUUID();

        await pool.query(
            `
                INSERT INTO ${this.tableName}
                (id, userId, firstName, lastName, email, phone, address, dateOfBirth, gender) 
                VALUES (?,?,?,?,?,?,?,?,?)
            `,
            [
                id,
                data.userId,
                data.firstName,
                data.lastName,
                data.email,
                data.phone || null,
                data.address || null,
                data.dateOfBirth || null,
                data.gender || null,
            ]
        );

        return (await this.findByUserId(data.userId));

    }

    static async updateByUserId(
        userId: string,
        data: Partial<ProfileAttributes>,
    ): Promise<boolean> {

        const fields = Object.keys(data)
            .filter((key) => key !== "id" && key !== "userId")
            .map((key) => `${key} = ?`)
            .join(", ");

        if(!fields.length) return false;

        const values = Object.values(data);
        const [result] = await pool.query(
            `
            UPDATE ${this.tableName}
            SET ${fields}
            WHERE userId = ?
            `,
            [...values, userId]
        );

        return (result as any).affectedRows > 0;

    }
}