import { pool } from "@/lib/jespo/db";

export interface VerificationTokenAttributes {
  identifier: string;
  token: string;
  expires: Date;
}

export class VerificationToken {
  static tableName = "verification_tokens";

  static async findAll(): Promise<VerificationTokenAttributes[]> {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows as VerificationTokenAttributes[];
  }

  static async findById(
    id: string,
  ): Promise<VerificationTokenAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id],
    );
    const tokens = rows as VerificationTokenAttributes[];
    return tokens.length ? tokens[0] : null;
  }

  static async create(
    data: VerificationTokenAttributes,
  ): Promise<VerificationTokenAttributes | null> {
    const { identifier, token, expires } = data;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (identifier, token, expires)
            VALUES (?,?,?)`,
      [identifier, token, expires],
    );
    const tokens = result as VerificationTokenAttributes[];
    return tokens.length ? tokens[0] : null;
  }

  static async update(
    id: string,
    data: Partial<VerificationTokenAttributes>,
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

  static async deleteToken({
    identifier,
    token,
  }: {
    identifier: string;
    token: string;
  }): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE identifier = ? 
            AND token = ?`,
      [identifier, token],
    );
    return (result as any).affectedRows > 0;
  }

  static async useVerificationToken({
    identifier,
    token,
  }: {
    identifier: string;
    token: string;
  }): Promise<VerificationTokenAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where identifier = ?
            AND token = ?`,
      [identifier, token],
    );
    const tokens = rows as VerificationTokenAttributes[];
    const result = tokens.length ? tokens[0] : null;

    if (result !== null) {
      await this.deleteToken({ identifier, token });
    }

    return result;
  }
}
