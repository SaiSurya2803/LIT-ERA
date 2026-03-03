import "dotenv/config";
import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Check if using SQLite or PostgreSQL
const isSQLite = process.env.DATABASE_URL.startsWith("sqlite:");

export default {
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSQLite ? "sqlite" : "postgresql",
  dbCredentials: isSQLite
    ? { url: "./litera_club.db" }
    : { url: process.env.DATABASE_URL },
} satisfies Config;
