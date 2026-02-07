import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  // Create database connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "jespogadgets",
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log("🔐 Creating admin user...");

    // Check if admin already exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@jespogadgets.com"],
    );

    if (existingUsers.length > 0) {
      console.log("✅ Admin user already exists!");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const userId = `admin_${Date.now()}`;

    await connection.query(
      `
            INSERT INTO users (id, name, email, hashedPassword, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `,
      [userId, "Admin User", "admin@jespogadgets.com", hashedPassword, "ADMIN"],
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@jespogadgets.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");
    console.log(
      "🔗 You can now login to your admin panel with these credentials.",
    );
  } catch (error) {
    console.error("❌ Failed to create admin user:", error.message);
  } finally {
    await connection.end();
    process.exit();
  }
}

createAdmin();
