import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

export function findPostgresUrl(): string {
  // Check common default keys first
  const standardKeys = [
    "POSTGRES_URL",
    "DATABASE_URL",
    "litera_POSTGRES_URL",
    "litera_POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL",
  ];

  for (const k of standardKeys) {
    const val = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (val && (val.startsWith("postgres://") || val.startsWith("postgresql://"))) {
      return val;
    }
  }

  // Dynamically scan any environment variable (e.g. store-name prefixed like <store>_POSTGRES_URL)
  for (const [key, value] of Object.entries(process.env)) {
    if (value && typeof value === "string") {
      const clean = value.trim().replace(/^["']|["']$/g, "");
      if (clean.startsWith("postgres://") || clean.startsWith("postgresql://")) {
        return clean;
      }
    }
  }

  return "";
}

const rawUrl = findPostgresUrl();

if (!rawUrl) {
  console.warn("⚠️ [DATABASE] PostgreSQL URL not found in environment variables. Checking available keys:", Object.keys(process.env).filter(k => k.toLowerCase().includes("postgres") || k.toLowerCase().includes("db")));
}

export const isConfigured = !!rawUrl;

const sql = neon(
  isConfigured 
    ? rawUrl 
    : "postgres://postgres:postgres@ep-empty-database.us-east-1.aws.neon.tech:5432/verceldb"
);

export const db = drizzle(sql, { schema });
export { sql };

let tablesInitialized = false;

export async function ensureTables(): Promise<void> {
  if (tablesInitialized) return;
  const activeUrl = findPostgresUrl();
  if (!activeUrl) {
    throw new Error("Postgres database connection string not found. Please connect your Vercel Postgres store in Vercel Dashboard -> Storage.");
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name TEXT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        club TEXT DEFAULT 'LIT''ERA',
        is_admin BOOLEAN DEFAULT FALSE,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        country TEXT,
        reason TEXT,
        message TEXT NOT NULL,
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        event_date TEXT,
        is_active BOOLEAN DEFAULT TRUE
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS game_scores (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        game_type VARCHAR(50) NOT NULL,
        score INTEGER,
        completion_time INTEGER,
        completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS puzzles (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        data TEXT NOT NULL,
        publish_date VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        answer TEXT,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
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
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS publications (
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
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER NOT NULL,
        event_title TEXT NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS mun_registrations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        committee TEXT NOT NULL,
        experience TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    tablesInitialized = true;
    console.log("✓ All Vercel Postgres tables verified/initialized successfully");
  } catch (err: any) {
    console.error("Error auto-initializing tables:", err);
    throw err;
  }
}
