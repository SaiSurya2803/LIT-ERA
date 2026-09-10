import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

function findPostgresUrl(): string {
  for (const k of ["POSTGRES_URL", "DATABASE_URL"]) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) return val;
  }
  return "";
}

async function check() {
  const pool = new Pool({ connectionString: findPostgresUrl() });
  const client = await pool.connect();
  try {
    // Check table columns
    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'publications' 
      ORDER BY ordinal_position
    `);
    console.log("=== Publications table columns ===");
    cols.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type} (nullable=${r.is_nullable}, default=${r.column_default})`));

    // Check row count
    const count = await client.query("SELECT COUNT(*) FROM publications");
    console.log(`\n=== Total publications: ${count.rows[0].count} ===`);

    // Try the exact Drizzle query
    try {
      const rows = await client.query(`
        SELECT id, title, category, author, description, cover_image, 
               pdf_file, pdf_file_name, pdf_data, pages, publish_date, 
               featured, views, downloads, likes, is_active, created_at
        FROM publications ORDER BY id DESC
      `);
      console.log(`\n=== Drizzle-style query returned ${rows.rowCount} rows ===`);
      if (rows.rowCount > 0) {
        console.log("First row:", JSON.stringify(rows.rows[0], null, 2));
      }
    } catch (e: any) {
      console.error("\n=== Drizzle-style query FAILED ===");
      console.error("Error:", e.message);
    }

    // Check session table too
    const sess = await client.query("SELECT COUNT(*) FROM session");
    console.log(`\n=== Sessions: ${sess.rows[0].count} ===`);
  } finally {
    client.release();
    await pool.end();
  }
}

check().catch(e => { console.error(e); process.exit(1); });
