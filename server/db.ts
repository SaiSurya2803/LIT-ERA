import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../shared/schema";

function createDbPool() {
  const rawUrl = (process.env.DATABASE_URL || "").trim();
  // Strip enclosing quotes if user added them in Vercel environment variables
  const databaseUrl = rawUrl.replace(/^["']|["']$/g, "");

  if (!databaseUrl) {
    console.warn("⚠️ [DATABASE] DATABASE_URL environment variable is not set. Database queries will fail until configured.");
    return mysql.createPool({
      host: "localhost",
      port: 3306,
      user: "root",
      database: "litera_club",
      waitForConnections: true,
      connectionLimit: 5,
    });
  }

  try {
    const parsed = new URL(databaseUrl);
    const isLocal = parsed.hostname.includes("localhost") || parsed.hostname.includes("127.0.0.1");

    return mysql.createPool({
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, "") || "test",
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 30000,
      queueLimit: 0,
      enableKeepAlive: true,
      ssl: isLocal
        ? undefined
        : {
            minVersion: "TLSv1.2",
            rejectUnauthorized: false,
          },
    });
  } catch (err) {
    console.error("Failed to parse DATABASE_URL, using URI fallback:", err);
    return mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 5,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
}

const pool = createDbPool();
export const db = drizzle(pool, { schema, mode: "default" });
export { pool };

if (process.env.DATABASE_URL) {
  console.log("✓ Initialized MySQL database pool");
}
