import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { findPostgresUrl, getAuthenticatedUser } from "../_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const dbUrl = findPostgresUrl();
  if (!dbUrl) return res.status(500).json({ message: "Database not configured." });

  const sql = neon(dbUrl);
  const user = await getAuthenticatedUser(req.headers.cookie as string | undefined, sql);

  if (!user) return res.status(401).json({ message: "Not authenticated" });
  if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });

  try {
    const users = await sql`
      SELECT id, name, email, club, is_admin as "isAdmin", join_date as "joinDate"
      FROM users
      ORDER BY join_date DESC
    `;
    return res.status(200).json(users);
  } catch (err: any) {
    console.error("Admin users error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch users" });
  }
}
