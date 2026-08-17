import { getPool } from "./db";
import { CREATE_TABLE_STATEMENTS } from "../shared/ddl";

let ensurePromise: Promise<void> | null = null;

/**
 * Creates any missing tables once per process. Runs before the first auth query
 * so a fresh TiDB Cloud cluster does not fail with "Table 'users' doesn't exist".
 */
export function ensureSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = run().catch((err) => {
      ensurePromise = null;
      throw err;
    });
  }
  return ensurePromise;
}

async function run(): Promise<void> {
  const pool = getPool();
  for (const statement of CREATE_TABLE_STATEMENTS) {
    await pool.query(statement);
  }
  console.log("[database] schema verified");
}
