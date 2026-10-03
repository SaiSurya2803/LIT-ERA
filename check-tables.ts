import pg from "pg";

async function checkTables() {
  const pool = new pg.Pool({
    connectionString: `postgresql://postgres.vtipokmzlxoautwqseka:B.SaiSurya%401234@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  });
  
  try {
    const res = await pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log("Current tables in database:", res.rows.map(r => r.tablename));
    process.exit(0);
  } catch (err) {
    console.error("FAILED:", err);
    process.exit(1);
  }
}
checkTables();
