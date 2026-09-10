import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

function findPostgresUrl(): string {
  for (const k of ["POSTGRES_URL", "DATABASE_URL"]) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) {
      return val;
    }
  }
  return "";
}

async function cleanup() {
  const rawDbUrl = findPostgresUrl();
  if (!rawDbUrl) throw new Error("No DATABASE_URL found");
  const pool = new Pool({ connectionString: rawDbUrl });
  const client = await pool.connect();
  try {
    const r = await client.query("DELETE FROM publications");
    console.log(`Deleted ${r.rowCount} publications`);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup().catch((e) => { console.error(e); process.exit(1); });
