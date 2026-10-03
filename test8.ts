import pg from "pg";

async function test() {
  const pool = new pg.Pool({
    connectionString: `postgresql://postgres.vtipokmzlxoautwqseka:B.SaiSurya%401234@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  });
  try {
    const res = await pool.query("SELECT 1");
    console.log("Port 5432 on pooler works!");
    process.exit(0);
  } catch (err) {
    console.error("Port 5432 failed:", err);
  }
}
test();
