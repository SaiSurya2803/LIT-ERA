import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

export function findDatabaseUrl(): string {
  // Check common default keys first
  const standardKeys = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "litera_DATABASE_URL",
    "litera_DATABASE_URL_NON_POOLING",
    "DATABASE_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL",
  ];

  for (const k of standardKeys) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) {
      return val;
    }
  }

  // Dynamically scan any environment variable
  for (const [key, value] of Object.entries(process.env)) {
    if (value && typeof value === "string") {
      const clean = value.trim().replace(/^["']|["']$/g, "");
      if (clean.startsWith("postgres://") || clean.startsWith("postgresql://")) {
        return clean;
      }
    }
  }

  return "";
}

const rawUrl = findDatabaseUrl();

if (!rawUrl) {
  console.warn("⚠️ [DATABASE] PostgreSQL URL not found in environment variables. Checking available keys:", Object.keys(process.env).filter(k => k.toLowerCase().includes("postgres") || k.toLowerCase().includes("db")));
}

export const isConfigured = !!rawUrl;

const sql = neon(rawUrl || "postgres://localhost:5432/postgres");
export const db = drizzle(sql, { schema });
