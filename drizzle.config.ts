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
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) {
      return val;
    }
  }

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

const dbUrl = findDatabaseUrl();

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl || "postgres://localhost:5432/postgres",
  },
});