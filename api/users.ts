import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getConnection } from "../_db";
import { findDatabaseUrl, getAuthenticatedUser, ensureCoreTables } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const dbUrl = findDatabaseUrl();
  if (!dbUrl) return res.status(500).json({ message: "Database not configured." });

  try {
    const sql = await getConnection(dbUrl);
    await ensureCoreTables(sql);

    const user = await getAuthenticatedUser(req.headers.cookie as string | undefined, sql);

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const [rows] = await sql.execute<any[]>("SELECT * FROM users");
    
    const users = (rows || []).map((u: any) => ({
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
      joinDate: u.join_date ?? u.joinDate ?? u.created_at ?? new Date().toISOString()
    })).sort((a: any, b: any) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());

    return res.status(200).json(users);
  } catch (err: any) {
    console.error("Users list error:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch users" });
  }
}
