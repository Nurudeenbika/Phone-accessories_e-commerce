import mysql from "mysql2/promise";
import { Pool } from "mysql2/promise";
import dbConfig from "../../config/config";

const env = (process.env.NODE_ENV as keyof typeof dbConfig) || "development";
const config = (dbConfig as any)[env];

export const pool: Pool = mysql.createPool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
  multipleStatements: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
  debug: false,
  trace: false,
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database connections...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing database connections...");
  await pool.end();
  process.exit(0);
});
