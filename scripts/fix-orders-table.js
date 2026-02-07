import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function fixOrdersTable() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "jespogadgets",
    });

    console.log("Connected to database");

    // Check if totalAmount column exists
    const [columns] = await connection.execute(
      `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'totalAmount'
    `,
      [process.env.DB_NAME || "jespogadgets"],
    );

    if (columns.length === 0) {
      console.log("Adding totalAmount column to orders table...");
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN totalAmount DECIMAL(10, 2) DEFAULT 0.00 AFTER amount
      `);
      console.log("✅ totalAmount column added successfully");
    } else {
      console.log("✅ totalAmount column already exists");
    }

    // Show current orders table structure
    const [tableStructure] = await connection.execute("DESCRIBE orders");
    console.log("\nCurrent orders table structure:");
    console.table(tableStructure);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

fixOrdersTable();
