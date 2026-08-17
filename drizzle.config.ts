import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { buildConnectionConfig } from "./shared/db-config";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: buildConnectionConfig(process.env.DATABASE_URL),
});
