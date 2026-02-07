import { pool } from "@/lib/jespo/db";
import { randomUUID } from "crypto";

export interface ImageAttributes {
  id?: string;
  color: string;
  colorCode: string;
  image: string;
}

export class Image {
  static tableName = "images";

  static async findAll(): Promise<ImageAttributes[]> {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows as ImageAttributes[];
  }

  static async findById(id: string): Promise<ImageAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id],
    );
    const accounts = rows as ImageAttributes[];
    return accounts.length ? accounts[0] : null;
  }

  static async create(data: Omit<ImageAttributes, "id">): Promise<string> {
    const id = randomUUID();
    const { color, colorCode, image } = data;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (id, color, colorCode, image)
            VALUES (?,?,?,?)`,
      [id, color, colorCode, image],
    );
    return id;
  }

  static async update(
    id: string,
    data: Partial<ImageAttributes>,
  ): Promise<boolean> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(data);
    const [result] = await pool.query(
      `
            UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
      [...values, id],
    );
    return (result as any).affectedRows > 0;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE id = ?`,
      [id],
    );
    return (result as any).affectedRows > 0;
  }
}
