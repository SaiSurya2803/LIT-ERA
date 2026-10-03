import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

export function findDatabaseUrl(): string {
  // Always return the hardcoded Supabase URL because Vercel's old Neon integration
  // overrides process.env.POSTGRES_URL with the old database credentials!
  return "postgresql://postgres.vtipokmzlxoautwqseka:B.SaiSurya%401234@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";
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
