import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { findPostgresUrl, parseCookies, ensureCoreTables } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const cookies = parseCookies(req.headers.cookie as string | undefined);
  const uid = cookies["lit_era_uid"];

  if (!uid) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const dbUrl = findPostgresUrl();
  if (!dbUrl) {
    return res.status(500).json({ message: "Database not configured." });
  }

  try {
    const sql = neon(dbUrl);
    await ensureCoreTables(sql);

    const users = await sql`
      SELECT id, name, email, club, is_admin as "isAdmin", join_date as "joinDate"
      FROM users WHERE id = ${uid} LIMIT 1
    `;

    if (!users.length) {
      res.setHeader("Set-Cookie", "lit_era_uid=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json(users[0]);
  } catch (err: any) {
    console.error("Me error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch user" });
  }
}
