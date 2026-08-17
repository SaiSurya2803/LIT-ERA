import "dotenv/config";
import mysql from "mysql2/promise";
import { buildConnectionConfig, describeConnection } from "../shared/db-config";
import { CREATE_TABLE_STATEMENTS } from "../shared/ddl";

async function init() {
  const config = buildConnectionConfig(process.env.DATABASE_URL);

  console.log(`Connecting to ${describeConnection(config)} ...`);
  const connection = await mysql.createConnection(config);

  for (const statement of CREATE_TABLE_STATEMENTS) {
    await connection.query(statement);
  }

  const [rows] = await connection.query("SHOW TABLES");
  console.log(`✓ Schema ready — ${(rows as unknown[]).length} tables in ${config.database}`);
  await connection.end();
}

init().catch((err) => {
  console.error("Init DB failed:", err?.message || err);
  process.exit(1);
});
