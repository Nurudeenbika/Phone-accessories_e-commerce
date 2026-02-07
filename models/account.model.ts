import { pool } from "@/lib/jespo/db";
import { randomUUID } from "crypto";
import { AdapterAccount } from "next-auth/adapters";

export interface AccountAttributes extends AdapterAccount {
  id?: string;
  userId: string;
  type: "oauth" | "email" | "credentials";
  provider: string;
  providerAccountId: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
}

export class Account {
  static tableName = "accounts";

  static async findAll(): Promise<AccountAttributes[]> {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows as AccountAttributes[];
  }

  static async findById(id: string): Promise<AccountAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id],
    );
    const accounts = rows as AccountAttributes[];
    return accounts.length ? accounts[0] : null;
  }

  static async create(
    data: Omit<AccountAttributes, "id">,
  ): Promise<AccountAttributes | null> {
    const id = randomUUID();
    const {
      userId,
      type,
      provider,
      providerAccountId,
      refreshToken,
      accessToken,
      expiresAt,
      tokenType,
      scope,
      idToken,
      sessionState,
    } = data;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (id, userId, type, provider, providerAccountId, refreshToken, accessToken, expiresAt, tokenType, scope, idToken, sessionState)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        userId,
        type,
        provider,
        providerAccountId,
        refreshToken || null,
        accessToken || null,
        expiresAt || null,
        tokenType || null,
        scope || null,
        idToken || null,
        sessionState || null,
      ],
    );

    // Return the created account by fetching it
    return await this.findById(id);
  }

  static async update(
    id: string,
    data: Partial<AccountAttributes>,
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

  static async unlink({
    provider,
    providerAccountId,
  }: {
    provider: string;
    providerAccountId: string;
  }): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE provider = ? AND providerAccountId = ?`,
      [provider, providerAccountId],
    );
    return (result as any).affectedRows > 0;
  }
}
