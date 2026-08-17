import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../shared/schema";
import { buildConnectionConfig, describeConnection } from "../shared/db-config";

export class DatabaseConfigError extends Error {
  code = "DATABASE_NOT_CONFIGURED";
}

function createDbPool() {
  const config = buildConnectionConfig(process.env.DATABASE_URL);

  console.log(`[database] connecting to ${describeConnection(config)}`);

  return mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 30000,
    queueLimit: 0,
    enableKeepAlive: true,
    connectTimeout: 15000,
  });
}

let poolInstance: mysql.Pool | null = null;
let poolError: Error | null = null;

try {
  poolInstance = createDbPool();
} catch (err: any) {
  poolError = new DatabaseConfigError(err?.message || "DATABASE_URL is not configured");
  console.error(`[database] ${poolError.message}`);
}

export function getPool(): mysql.Pool {
  if (!poolInstance) {
    throw poolError ?? new DatabaseConfigError("DATABASE_URL is not configured");
  }
  return poolInstance;
}

/**
 * Drizzle client. Accessing it without a valid DATABASE_URL throws a descriptive
 * error instead of silently connecting to a non-existent local database.
 */
function createDrizzle() {
  return drizzle(getPool(), { schema, mode: "default" });
}

type Database = ReturnType<typeof createDrizzle>;

let drizzleInstance: Database | null = null;

function drizzleClient(): Database {
  if (!drizzleInstance) {
    drizzleInstance = createDrizzle();
  }
  return drizzleInstance;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop: keyof Database) {
    const client = drizzleClient();
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
