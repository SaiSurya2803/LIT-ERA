import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

export function findDatabaseUrl(): string {
  const keys = [
    "POSTGRES_URL",
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "DATABASE_URL_NON_POOLING",
    "POSTGRES_URL_NON_POOLING",
  ];
  for (const k of keys) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) {
      return val;
    }
  }
  return "";
}

const rawUrl = findDatabaseUrl();

if (!rawUrl) {
  console.warn("⚠️ [DATABASE] No PostgreSQL URL found in environment.");
}

export const isConfigured = !!rawUrl;

const pool = new Pool({
  connectionString: rawUrl || "postgres://localhost:5432/postgres",
  ssl: rawUrl && !rawUrl.includes("localhost") ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
export { pool };
