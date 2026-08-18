import "dotenv/config";
import { defineConfig } from "drizzle-kit";

function findDatabaseUrl(): string {
  const standardKeys = [
    "POSTGRES_URL",
    "DATABASE_URL",
    "litera_POSTGRES_URL",
    "litera_POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL",
  ];

  for (const k of standardKeys) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("mysql://") || val.startsWith("mysql://"))) {
      return val;
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (value && typeof value === "string") {
      const clean = value.trim().replace(/^["']|["']$/g, "");
      if (clean.startsWith("mysql://") || clean.startsWith("mysql://")) {
        return clean;
      }
    }
  }

  return "";
}

const dbUrl = findDatabaseUrl();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: dbUrl || "mysql://localhost:5432/postgres",
  },
});