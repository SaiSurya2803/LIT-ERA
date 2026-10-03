import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function createBuckets() {
  try {
    console.log("Creating buckets...");
    
    await pool.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('publications', 'publications', true) 
      ON CONFLICT (id) DO NOTHING;
    `);
    
    await pool.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('submissions', 'submissions', false) 
      ON CONFLICT (id) DO NOTHING;
    `);

    // Allow public access to publications
    await pool.query(`
      CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'publications');
    `).catch(() => {});
    
    // Allow anon uploads to submissions and publications for now (we'll rely on our app logic)
    await pool.query(`
      CREATE POLICY "Anon Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('publications', 'submissions'));
    `).catch(() => {});

    console.log("Buckets created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating buckets:", err);
    process.exit(1);
  }
}

createBuckets();
