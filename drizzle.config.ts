import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// Check if using SQLite or PostgreSQL
const isSQLite = process.env.DATABASE_URL.startsWith("sqlite:");

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isSQLite ? "sqlite" : "postgresql",
  dbCredentials: isSQLite 
    ? { url: "./litera_club.db" }
    : { url: process.env.DATABASE_URL },
});
