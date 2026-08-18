import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

function findPostgresUrl(): string {
  const keys = [
    "POSTGRES_URL",
    "DATABASE_URL",
    "litera_POSTGRES_URL",
    "litera_POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_PRISMA_URL",
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const dbUrl = findPostgresUrl();
  if (!dbUrl) {
    return res.status(500).json({ message: "Database not configured. Please connect Vercel Postgres in Storage tab." });
  }

  const sql = neon(dbUrl);

  try {
    // Auto-create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name TEXT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        club TEXT DEFAULT 'LIT''ERA',
        is_admin BOOLEAN DEFAULT FALSE,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { name, email, password, adminCode } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if first user (auto-admin)
    const countResult = await sql`SELECT COUNT(*) as count FROM users`;
    const isFirstUser = Number(countResult[0].count) === 0;
    const isAdmin = isFirstUser || (!!process.env.ADMIN_CODE && adminCode === process.env.ADMIN_CODE);

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    const [user] = await sql`
      INSERT INTO users (id, name, email, password_hash, club, is_admin)
      VALUES (${id}, ${name}, ${email}, ${passwordHash}, ${"LIT'ERA"}, ${isAdmin})
      RETURNING id, name, email, club, is_admin as "isAdmin", join_date as "joinDate"
    `;

    return res.status(201).json(user);
  } catch (err: any) {
    console.error("Register error:", err);
    if (err.code === "23505" || (err.message || "").includes("unique")) {
      return res.status(400).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: err.message || "Registration failed" });
  }
}
