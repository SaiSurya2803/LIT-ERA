import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl = (
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  ""
).trim().replace(/^["']|["']$/g, "");

if (!dbUrl) {
  console.warn("⚠️ DATABASE_URL / POSTGRES_URL is missing. Please set it in .env or environment.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl || "postgres://localhost:5432/postgres",
  },
});