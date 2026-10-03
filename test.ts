import "dotenv/config";
import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: "postgresql://postgres:B.SaiSurya%401234@db.vtipokmzlxoautwqseka.supabase.co:5432/postgres" });
pool.query('SELECT count(*) FROM publications').then(res => {
  console.log('Count in Postgres:', res.rows[0].count);
  process.exit(0);
}).catch(console.error);
