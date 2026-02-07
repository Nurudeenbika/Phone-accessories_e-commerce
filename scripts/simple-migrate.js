import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  // Create database connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "jespogadgets",
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log("🔗 Connected to database successfully!");

    // Create migrations table
    await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Get applied migrations
    const [rows] = await connection.query(
      `SELECT name FROM migrations ORDER BY id ASC`,
    );

    const applied = new Set(rows.map((r) => r.name));

    // Get migration files
    const migrationDir = path.join(__dirname, "../migrations");

    if (!fs.existsSync(migrationDir)) {
      console.log("📁 No migrations directory found. Creating it...");
      fs.mkdirSync(migrationDir, { recursive: true });
      console.log(
        "✅ Migrations directory created. Add your migration files there.",
      );
      return;
    }

    const files = fs
      .readdirSync(migrationDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("📄 No migration files found in migrations directory.");
      return;
    }

    console.log(`📋 Found ${files.length} migration files`);

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`✅ Skipping already applied migration: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
      console.log(`🚀 Applying migration: ${file}`);

      try {
        // Split SQL statements by semicolon and filter out empty statements
        const statements = sql
          .split(";")
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        // Execute each statement separately
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }

        await connection.query(`INSERT INTO migrations (name) VALUES (?)`, [
          file,
        ]);
        console.log(`✅ Successfully applied: ${file}`);
      } catch (error) {
        console.error(`❌ Failed to apply migration ${file}:`, error.message);
        throw error;
      }
    }

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(
      "💡 Make sure your database is running and environment variables are set:",
    );
    console.error("   - DB_HOST (default: localhost)");
    console.error("   - DB_USER (default: root)");
    console.error("   - DB_PASS (default: empty)");
    console.error("   - DB_NAME (default: jespogadgets)");
    console.error("   - DB_PORT (default: 3306)");
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();
