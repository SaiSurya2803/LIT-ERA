import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL || "";

function parseDbUrl(urlStr: string) {
  try {
    if (!urlStr) return null;
    const parsed = new URL(urlStr);
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, "") || "test",
      ssl: parsed.hostname.includes("localhost") || parsed.hostname.includes("127.0.0.1") 
        ? undefined 
        : { minVersion: "TLSv1.2" as const, rejectUnauthorized: true },
    };
  } catch {
    return null;
  }
}

const credentials = parseDbUrl(dbUrl) || {
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "7EghEhEouyQyPKz.root",
  password: "vGYAtF15WcdMOtQG",
  database: "test",
  ssl: {
    minVersion: "TLSv1.2" as const,
    rejectUnauthorized: true,
  },
};

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: credentials,
});