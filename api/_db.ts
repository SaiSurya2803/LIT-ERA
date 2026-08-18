// Shared DB helper for Vercel serverless functions
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export function findPostgresUrl(): string {
  const keys = [
    "POSTGRES_URL", "DATABASE_URL", "litera_POSTGRES_URL",
    "litera_POSTGRES_URL_NON_POOLING", "POSTGRES_URL_NON_POOLING", "POSTGRES_PRISMA_URL",
  ];
  for (const k of keys) {
    const v = (process.env[k] || "").trim().replace(/^["']|["']$/g, "");
    if (v && (v.startsWith("postgres://") || v.startsWith("postgresql://"))) return v;
  }
  for (const v of Object.values(process.env)) {
    if (v) {
      const c = v.trim().replace(/^["']|["']$/g, "");
      if (c.startsWith("postgres://") || c.startsWith("postgresql://")) return c;
    }
  }
  return "";
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k) {
      const rawVal = v.join("=").trim();
      try {
        cookies[k.trim()] = decodeURIComponent(rawVal);
      } catch {
        cookies[k.trim()] = rawVal;
      }
    }
  }
  return cookies;
}

export async function getAuthenticatedUser(cookieHeader: string | undefined, sql: NeonQueryFunction<false, false>) {
  const cookies = parseCookies(cookieHeader);
  const uid = cookies["lit_era_uid"];
  if (!uid) return null;

  try {
    const rows = await sql`SELECT * FROM users WHERE id = ${uid} LIMIT 1`;
    if (!rows || rows.length === 0) return null;
    const u = rows[0];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      club: u.club || "LIT'ERA",
      isAdmin: Boolean(
        u.is_admin === true || 
        u.is_admin === "true" || 
        u.is_admin === 1 || 
        u.isAdmin === true || 
        u.isAdmin === "true" || 
        u.isAdmin === 1
      ),
      joinDate: u.join_date ?? u.joinDate ?? new Date().toISOString()
    };
  } catch (err) {
    console.error("getAuthenticatedUser error:", err);
    return null;
  }
}

export async function ensureCoreTables(sql: NeonQueryFunction<false, false>) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name TEXT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        club TEXT DEFAULT 'LITERA',
        is_admin BOOLEAN DEFAULT FALSE,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        file_name TEXT,
        original_file_name TEXT,
        file_size INTEGER,
        file_path TEXT,
        status TEXT DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
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
      )
    `;
  } catch (e) {
    console.warn("Table auto-init warning:", e);
  }
}
