import { pool } from "@/lib/jespo/db";

export interface ProductAttributes {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  rating?: number;
  totalSold?: number;
  createdAt?: string;
  list?: number | null;
  brand?: string;
  category?: string;
  inStock?: boolean;
  images?: string[]; // Array of image URLs
}

export interface ProductSearchFilters {
  name?: string;
  description?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
  offset?: number;
  orderBy?:
    | "name"
    | "price"
    | "category"
    | "brand"
    | "createdAt"
    | "rating"
    | "totalSold";
  orderDir?: "ASC" | "DESC";
}

export class Product {
  static tableName = "products";

  static async findAll(): Promise<ProductAttributes[]> {
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    const products = rows as ProductAttributes[];

    // Parse images JSON field
    return products.map((product) => ({
      ...product,
      images: product.images
        ? typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images
        : undefined,
    }));
  }

  static async findById(id: string): Promise<ProductAttributes | null> {
    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} where id = ?`,
      [id],
    );
    const products = rows as ProductAttributes[];
    if (products.length === 0) return null;

    const product = products[0];
    // Parse images JSON field
    return {
      ...product,
      images: product.images
        ? typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images
        : undefined,
    };
  }

  static async create(
    data: Omit<ProductAttributes, "id">,
  ): Promise<ProductAttributes> {
    // Generate a reasonable product ID like PRD-2024-001 (without #)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const id = `PRD-${year}-${randomNum.toString().padStart(3, "0")}`;
    const { name, description, price, list, brand, category, inStock, images } =
      data;

    await pool.query(
      `
            INSERT INTO ${this.tableName} (id, name, description, price, list, brand, category, inStock, images)
            VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        id,
        name,
        description || null,
        price || null,
        list || null,
        brand || null,
        category || null,
        inStock || null,
        images ? JSON.stringify(images) : null,
      ],
    );

    const [rows] = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`,
      [id],
    );

    const product = (rows as ProductAttributes[])[0];

    if (!product) {
      throw new Error("Failed to fetch created product");
    }

    if (product.images && typeof product.images === "string") {
      product.images = JSON.parse(product.images as unknown as string);
    }

    return product;
  }

  static async update(
    id: string,
    data: Partial<ProductAttributes>,
  ): Promise<ProductAttributes> {
    if (!Object.keys(data).length) {
      throw new Error("No fields provided for update");
    }

    // Handle images field specially - convert to JSON string
    const processedData: Record<string, unknown> = { ...data };

    if (processedData.images) {
      processedData.images = JSON.stringify(processedData.images);
    }

    const fields = Object.keys(processedData)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(processedData);

    const [result]: any = await pool.query(
      `
            UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
      [...values, id],
    );

    if (result.affectedRows === 0) {
      throw new Error("Product not found");
    }

    const [rows]: any = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`,
      [id],
    );

    const product = rows[0];

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.images && typeof product.images == "string") {
      product.images = JSON.parse(product.images);
    }

    return product;
  }

  static async delete(id: string): Promise<boolean> {
    const [result] = await pool.query(
      `
            DELETE FROM ${this.tableName} WHERE id = ?`,
      [id],
    );
    return (result as { affectedRows: number }).affectedRows > 0;
  }

  static async deleteAll(): Promise<number> {
    const [result] = await pool.query(`DELETE FROM ${this.tableName}`);
    return (result as { affectedRows: number }).affectedRows;
  }

  static async search(
    filters: ProductSearchFilters,
  ): Promise<ProductAttributes[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.name) {
      conditions.push("name LIKE ?");
      params.push(`%${filters.name}%`);
    }

    if (filters.description) {
      conditions.push("description LIKE ?");
      params.push(`%${filters.description}%`);
    }

    if (filters.brand) {
      conditions.push("brand LIKE ?");
      params.push(`%${filters.brand}%`);
    }

    if (filters.category) {
      conditions.push("category = ?");
      params.push(filters.category);
    }

    if (filters.minPrice !== undefined) {
      conditions.push("price >= ?");
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      conditions.push("price <= ?");
      params.push(filters.maxPrice);
    }

    if (filters.inStock === true) {
      conditions.push("inStock = 1");
    }

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const allowedOrderBy = [
      "name",
      "price",
      "category",
      "brand",
      "createdAt",
      "rating",
      "totalSold",
    ] as const;

    if (filters.orderBy && allowedOrderBy.includes(filters.orderBy)) {
      const dir = filters.orderDir === "DESC" ? "DESC" : "ASC";
      sql += ` ORDER BY ${filters.orderBy} ${dir}`;
    } else {
      sql += ` ORDER BY id DESC`;
    }

    if (filters.limit !== undefined) {
      sql += ` LIMIT ?`;
      params.push(filters.limit);

      if (filters.offset !== undefined) {
        sql += ` OFFSET ?`;
        params.push(filters.offset);
      }
    }

    const [rows] = await pool.query(sql, params);

    const products = rows as ProductAttributes[];

    // Parse images JSON field
    return products.map((product) => ({
      ...product,
      images:
        typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images,
    }));
  }

  static async count(filters: ProductSearchFilters): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE 1=1`;
    const params: unknown[] = [];

    if (filters.name) {
      sql += " AND name LIKE ?";
      params.push(`%${filters.name}%`);
    }

    if (filters.description) {
      sql += " AND description LIKE ?";
      params.push(`%${filters.description}%`);
    }

    if (filters.brand) {
      sql += " AND brand LIKE ?";
      params.push(`%${filters.brand}%`);
    }

    if (filters.category) {
      sql += " AND category = ?";
      params.push(filters.category);
    }

    if (filters.minPrice !== undefined) {
      sql += " AND price >= ?";
      params.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      sql += " AND price <= ?";
      params.push(filters.maxPrice);
    }

    if (filters.inStock === true) {
      sql += " AND inStock = 1";
    }
    const [rows] = await pool.query(sql, params);
    const result = rows as { count: number }[];
    return result[0].count;
  }
}
