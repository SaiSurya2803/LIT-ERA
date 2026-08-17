import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl) {
  console.warn("⚠️ [DATABASE] DATABASE_URL environment variable is not set. Database queries will fail until configured.");
}

// Enable SSL if connecting to a remote cloud host (TiDB, Aiven, PlanetScale, Render, etc.)
const isLocalhost = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1") || !databaseUrl;
const poolConfig: mysql.PoolOptions = {
  uri: databaseUrl || "mysql://root:@localhost:3306/litera_club",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 30000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

if (!isLocalhost) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

// Create connection pool
const pool = mysql.createPool(poolConfig);

export const db = drizzle(pool, { schema, mode: "default" });
export { pool };

if (databaseUrl) {
  console.log("✓ Initialized MySQL database pool");
}

