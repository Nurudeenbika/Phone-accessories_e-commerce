import { pool } from "@/lib/jespo/db";

export interface ReviewAttributes {
  id?: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Review {
  static tableName = "reviews";

  static async create(data: Omit<ReviewAttributes, "id">): Promise<string> {
    const id = `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (id, userId, productId, rating, comment, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `,
      [id, data.userId, data.productId, data.rating, data.comment],
    );

    return id;
  }

  static async findByProductId(productId: string): Promise<ReviewAttributes[]> {
    const [rows] = await pool.query(
      `
            SELECT * FROM ${this.tableName} 
            WHERE productId = ? 
            ORDER BY createdAt DESC
        `,
      [productId],
    );

    return rows as ReviewAttributes[];
  }

  static async findByUserId(userId: string): Promise<ReviewAttributes[]> {
    const [rows] = await pool.query(
      `
            SELECT * FROM ${this.tableName} 
            WHERE userId = ? 
            ORDER BY createdAt DESC
        `,
      [userId],
    );

    return rows as ReviewAttributes[];
  }

  static async findById(id: string): Promise<ReviewAttributes | null> {
    const [rows] = await pool.query(
      `
            SELECT * FROM ${this.tableName} 
            WHERE id = ?
        `,
      [id],
    );

    const reviews = rows as ReviewAttributes[];
    return reviews.length > 0 ? reviews[0] : null;
  }

  static async update(
    id: string,
    data: Partial<ReviewAttributes>,
  ): Promise<boolean> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);

    const [result] = await pool.query(
      `
            UPDATE ${this.tableName} SET ${fields}, updatedAt = NOW() WHERE id = ?
        `,
      [...values, id],
    );

    return (result as { affectedRows: number }).affectedRows > 0;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE id = ?
        `,
      [id],
    );

    return (result as { affectedRows: number }).affectedRows > 0;
  }

  static async getAverageRating(productId: string): Promise<number> {
    const [rows] = await pool.query(
      `
            SELECT AVG(rating) as average FROM ${this.tableName} 
            WHERE productId = ?
        `,
      [productId],
    );

    const result = rows as { average: number }[];
    return result[0]?.average || 0;
  }

  static async getReviewCount(productId: string): Promise<number> {
    const [rows] = await pool.query(
      `
            SELECT COUNT(*) as count FROM ${this.tableName} 
            WHERE productId = ?
        `,
      [productId],
    );

    const result = rows as { count: number }[];
    return result[0]?.count || 0;
  }
}
