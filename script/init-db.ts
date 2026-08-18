import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function init() {
  const rawDbUrl = (
    process.env.POSTGRES_URL || 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL_NON_POOLING || 
    ""
  ).trim().replace(/^["']|["']$/g, "");

  if (!rawDbUrl) {
    throw new Error("POSTGRES_URL / DATABASE_URL is missing. Please set it in your .env file or environment.");
  }

  console.log("Connecting to Vercel Postgres / Neon database...");
  const sql = neon(rawDbUrl);

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name TEXT NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      club TEXT DEFAULT 'LIT''ERA',
      is_admin BOOLEAN DEFAULT FALSE,
      join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT,
      reason TEXT,
      message TEXT NOT NULL,
      submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      event_date TEXT,
      is_active BOOLEAN DEFAULT TRUE
    );`,

    `CREATE TABLE IF NOT EXISTS game_scores (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
      game_type VARCHAR(50) NOT NULL,
      score INTEGER,
      completion_time INTEGER,
      completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS puzzles (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      data TEXT NOT NULL,
      publish_date VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS content (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      answer TEXT,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      file_name TEXT,
      file_size INTEGER,
      original_file_name TEXT,
      file_path TEXT,
      status TEXT DEFAULT 'pending',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS publications (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_image TEXT,
      pdf_file TEXT,
      pdf_file_name TEXT,
      pages INTEGER,
      publish_date TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      views INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS event_registrations (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
      event_id INTEGER NOT NULL,
      event_title TEXT NOT NULL,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS mun_registrations (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      committee TEXT NOT NULL,
      experience TEXT,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const q of queries) {
    await sql(q);
  }

  console.log("✓ All 10 tables initialized successfully in Vercel Postgres / Neon!");
}

init().catch((err) => {
  console.error("Init DB Error:", err);
  process.exit(1);
});
