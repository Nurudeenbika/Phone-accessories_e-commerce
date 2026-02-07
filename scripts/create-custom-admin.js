import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createCustomAdmin() {
  // Create database connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "jespogadgets",
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log("🔐 Creating custom admin user...");

    // Get admin details from user
    const name = await askQuestion("Enter admin name: ");
    const email = await askQuestion("Enter admin email: ");
    const password = await askQuestion("Enter admin password: ");

    // Check if admin already exists
    const [existingUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      console.log("❌ User with this email already exists!");
      rl.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = `admin_${Date.now()}`;

    await connection.query(
      `
            INSERT INTO users (id, name, email, hashedPassword, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `,
      [userId, name, email, hashedPassword, "ADMIN"],
    );

    console.log("✅ Custom admin user created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Failed to create admin user:", error.message);
  } finally {
    await connection.end();
    rl.close();
    process.exit();
  }
}

createCustomAdmin();
