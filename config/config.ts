import { Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

const config: Record<string, DBConfig> = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
};

export default config;
