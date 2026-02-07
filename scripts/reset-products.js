const mysql = require("mysql2/promise");
const path = require("path");

// Database configuration
const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jespogadgets",
  port: process.env.DB_PORT || 3306,
};

async function resetProducts() {
  let connection;

  try {
    console.log("Connecting to database...");
    connection = await mysql.createConnection(config);
    console.log("Connected successfully!");

    // Delete all existing products
    console.log("Deleting all existing products...");
    await connection.execute("DELETE FROM products");
    console.log("All products deleted successfully!");

    // Create new products for the 2 categories
    const newProducts = [
      // Phones
      {
        id: "phone-001",
        name: "iPhone 15 Pro Max",
        description:
          "Latest iPhone with titanium design, A17 Pro chip, and advanced camera system. Perfect for photography and gaming.",
        price: 1200000,
        list_price: 1300000,
        brand: "Apple",
        category: "phone",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "phone-002",
        name: "Samsung Galaxy S24 Ultra",
        description:
          "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. The ultimate productivity device.",
        price: 1100000,
        list_price: 1200000,
        brand: "Samsung",
        category: "phone",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "phone-003",
        name: "Google Pixel 8 Pro",
        description:
          "AI-powered smartphone with advanced camera features, Google Tensor G3 chip, and pure Android experience.",
        price: 950000,
        list_price: 1000000,
        brand: "Google",
        category: "phone",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "phone-004",
        name: "OnePlus 12",
        description:
          "Flagship Android phone with Snapdragon 8 Gen 3, 100W fast charging, and premium build quality.",
        price: 850000,
        list_price: 900000,
        brand: "OnePlus",
        category: "phone",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "phone-005",
        name: "Xiaomi 14 Ultra",
        description:
          "Professional photography smartphone with Leica camera system, Snapdragon 8 Gen 3, and premium design.",
        price: 800000,
        list_price: 850000,
        brand: "Xiaomi",
        category: "phone",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Phone Accessories
      {
        id: "accessory-001",
        name: "Apple AirPods Pro 2",
        description:
          "Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency.",
        price: 250000,
        list_price: 280000,
        brand: "Apple",
        category: "phone-accessories",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "accessory-002",
        name: "Samsung Galaxy Buds2 Pro",
        description:
          "High-quality wireless earbuds with intelligent active noise cancellation and 360 audio.",
        price: 200000,
        list_price: 220000,
        brand: "Samsung",
        category: "phone-accessories",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "accessory-003",
        name: "Anker PowerCore 10000",
        description:
          "Compact portable charger with 10000mAh capacity, fast charging, and multiple device support.",
        price: 45000,
        list_price: 50000,
        brand: "Anker",
        category: "phone-accessories",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "accessory-004",
        name: "Spigen Ultra Hybrid Case",
        description:
          "Clear protective case with military-grade protection, precise cutouts, and raised edges.",
        price: 15000,
        list_price: 18000,
        brand: "Spigen",
        category: "phone-accessories",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "accessory-005",
        name: "Belkin Boost Charge Pro",
        description:
          "Wireless charging pad with 15W fast charging, LED indicator, and non-slip surface.",
        price: 35000,
        list_price: 40000,
        brand: "Belkin",
        category: "phone-accessories",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "accessory-006",
        name: "JBL Charge 5",
        description:
          "Portable Bluetooth speaker with powerful sound, 20-hour battery life, and waterproof design.",
        price: 120000,
        list_price: 130000,
        brand: "JBL",
        category: "phone-accessories",
        in_stock: true,
        image_url: "/prods.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert new products
    console.log("Creating new products...");
    const insertQuery = `
      INSERT INTO products (
        id, name, description, price, list_price, brand, category, 
        in_stock, image_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const product of newProducts) {
      await connection.execute(insertQuery, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.list_price,
        product.brand,
        product.category,
        product.in_stock,
        product.image_url,
        product.created_at,
        product.updated_at,
      ]);
    }

    console.log(`Successfully created ${newProducts.length} products!`);
    console.log(
      `- ${newProducts.filter((p) => p.category === "phone").length} phones`,
    );
    console.log(
      `- ${newProducts.filter((p) => p.category === "phone-accessories").length} phone accessories`,
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

// Load environment variables
require("dotenv").config();

// Run the script
resetProducts();
