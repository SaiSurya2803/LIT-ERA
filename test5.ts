import pg from "pg";
const { Pool } = pg;

const regions = [
  "ap-south-1",
  "us-east-1",
  "us-west-1",
  "eu-west-1",
  "eu-central-1",
  "ap-southeast-1",
  "ap-southeast-2"
];

async function test() {
  for (const r of regions) {
    console.log("Testing region:", r);
    const pool = new Pool({
      connectionString: `postgresql://postgres.vtipokmzlxoautwqseka:B.SaiSurya%401234@aws-0-${r}.pooler.supabase.com:6543/postgres`,
      connectionTimeoutMillis: 5000,
    });
    try {
      await pool.query("SELECT 1");
      console.log("SUCCESS! Region is:", r);
      process.exit(0);
    } catch (err: any) {
      console.log("Failed:", err.message);
    }
  }
}
test();
