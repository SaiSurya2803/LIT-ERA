import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const rawDbUrl = (process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, "");

if (!rawDbUrl) {
  throw new Error("DATABASE_URL environment variable is missing. Please set it in your .env file or environment.");
}

function parseDbUrl(urlStr: string) {
  const parsed = new URL(urlStr);
  const isLocal = parsed.hostname.includes("localhost") || parsed.hostname.includes("127.0.0.1");

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || (isLocal ? 3306 : 4000),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, "") || "sys",
    ssl: isLocal
      ? undefined
      : {
          minVersion: "TLSv1.2" as const,
          rejectUnauthorized: true,
        },
  };
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: parseDbUrl(rawDbUrl),
});