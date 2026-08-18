import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

const rawUrl = (
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  ""
).trim().replace(/^["']|["']$/g, "");

if (!rawUrl) {
  console.warn("⚠️ [DATABASE] POSTGRES_URL / DATABASE_URL is not set. Please create a Vercel Postgres database in the Storage tab.");
}

const sql = neon(rawUrl || "postgres://postgres:postgres@localhost:5432/litera");
export const db = drizzle(sql, { schema });

if (rawUrl) {
  console.log("✓ Connected to Vercel Postgres / Neon database");
}
