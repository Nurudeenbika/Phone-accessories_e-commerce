import { pool } from "@/lib/jespo/db";
import { randomUUID } from "crypto";
import {
  CartProductTypeAttributes,
  AddressAttributes,
} from "@/lib/jespo/contracts";

export interface OrderAttributes {
  id?: string;
  userId: string;
  amount?: number;
  totalAmount?: number;
  currency?: string;
  status?: string;
  deliveryStatus?: string;
  paymentIntentId: string;
  products?: CartProductTypeAttributes[];
  address?: AddressAttributes;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  static tableName = "orders";

  static async findById(id: string): Promise<OrderAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id],
    );
    const orders = rows as OrderAttributes[];
    if (orders.length === 0) return null;

    const order = orders[0];
    // Parse JSON fields
    return {
      ...order,
      products: order.products
        ? typeof order.products === "string"
          ? JSON.parse(order.products)
          : order.products
        : undefined,
      address: order.address
        ? typeof order.address === "string"
          ? JSON.parse(order.address)
          : order.address
        : undefined,
    };
  }

  static async findAll(): Promise<OrderAttributes[]> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} ORDER BY createdAt DESC`,
    );
    const orders = rows as OrderAttributes[];

    // Parse JSON fields
    return orders.map((order) => ({
      ...order,
      products: order.products
        ? typeof order.products === "string"
          ? JSON.parse(order.products)
          : order.products
        : undefined,
      address: order.address
        ? typeof order.address === "string"
          ? JSON.parse(order.address)
          : order.address
        : undefined,
    }));
  }

  static async create(data: Omit<OrderAttributes, "id">): Promise<string> {
    // Generate a reasonable order ID like ORD-2024-001 (without #)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const id = `ORD-${year}-${randomNum.toString().padStart(3, "0")}`;
    const {
      userId,
      amount,
      totalAmount,
      currency,
      status,
      deliveryStatus,
      paymentIntentId,
      products,
      address,
    } = data;

    const [result] = await pool.query(
      `
            INSERT INTO ${this.tableName} (id, userId, amount, totalAmount, currency, status, deliveryStatus, paymentIntentId, products, address)
            VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        userId,
        amount || null,
        totalAmount || null,
        currency || null,
        status || null,
        deliveryStatus || null,
        paymentIntentId,
        JSON.stringify(products) || null,
        JSON.stringify(address) || null,
      ],
    );
    return id;
  }

  static async update(
    id: string,
    data: Partial<OrderAttributes>,
  ): Promise<boolean> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    // Handle JSON stringification for products and address fields
    const values = Object.entries(data).map(([key, value]) => {
      if (key === "products" || key === "address") {
        return value ? JSON.stringify(value) : null;
      }
      return value;
    });

    console.log(
      "Order.update - SQL:",
      `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
    );
    console.log("Order.update - Values:", [...values, id]);

    const [result] = await pool.query(
      `
            UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
      [...values, id],
    );

    console.log("Order.update - Result:", result);
    console.log(
      "Order.update - Affected rows:",
      (result as { affectedRows: number }).affectedRows,
    );

    return (result as { affectedRows: number }).affectedRows > 0;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE id = ?`,
      [id],
    );
    return (result as { affectedRows: number }).affectedRows > 0;
  }

  /**
   * Update order payment status
   */
  static async updatePaymentStatus(
    id: string,
    status: string,
    paymentReference?: string,
  ): Promise<boolean> {
    const updateData: Partial<OrderAttributes> = {
      status: status,
      updatedAt: new Date(),
    };

    // If payment reference is provided, update the paymentIntentId
    if (paymentReference) {
      updateData.paymentIntentId = paymentReference;
    }

    return await this.update(id, updateData);
  }

  /**
   * Find orders by user ID
   */
  static async findByUserId(userId: string): Promise<OrderAttributes[]> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE userId = ? ORDER BY createdAt DESC`,
      [userId],
    );
    const orders = rows as OrderAttributes[];

    // Parse JSON fields
    return orders.map((order) => ({
      ...order,
      products: order.products
        ? typeof order.products === "string"
          ? JSON.parse(order.products)
          : order.products
        : undefined,
      address: order.address
        ? typeof order.address === "string"
          ? JSON.parse(order.address)
          : order.address
        : undefined,
    }));
  }
}
