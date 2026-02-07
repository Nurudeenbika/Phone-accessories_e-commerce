import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function checkAdmin() {
  // Create database connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "jespogadgets",
    port: process.env.DB_PORT || 3306,
  });

  try {
    console.log("🔍 Checking admin user...");

    // Check all users
    const [users] = await connection.query("SELECT * FROM users");
    console.log("📋 All users in database:");
    users.forEach((user) => {
      console.log(
        `- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`,
      );
    });

    // Check specifically for admin user
    const [adminUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@jespogadgets.com"],
    );

    if (adminUsers.length > 0) {
      const admin = adminUsers[0];
      console.log("\n✅ Admin user found:");
      console.log(`- ID: ${admin.id}`);
      console.log(`- Email: ${admin.email}`);
      console.log(`- Name: ${admin.name}`);
      console.log(`- Role: ${admin.role}`);

      // Update role to ADMIN if it's not already
      if (admin.role !== "ADMIN") {
        console.log("\n🔧 Updating role to ADMIN...");
        await connection.query("UPDATE users SET role = ? WHERE email = ?", [
          "ADMIN",
          "admin@jespogadgets.com",
        ]);
        console.log("✅ Role updated to ADMIN");
      }
    } else {
      console.log("❌ No admin user found");
    }
  } catch (error) {
    console.error("❌ Error checking admin user:", error.message);
  } finally {
    await connection.end();
    process.exit();
  }
}

checkAdmin();
