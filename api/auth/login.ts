import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { getConnection } from "../_db";

function findDatabaseUrl(): string {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const dbUrl = findDatabaseUrl();
  if (!dbUrl) {
    return res.status(500).json({ message: "Database not configured." });
  }
  const sql = await getConnection(dbUrl);

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [users] = await sql.execute<any[]>("SELECT id, name, email, club, is_admin as \"isAdmin\", join_date as \"joinDate\", password_hash FROM users WHERE email = ? LIMIT 1", [String(email)]);
    if (!users.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set persistent auth cookie
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
      `lit_era_uid=${user.id}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
      ...(isProduction ? ["Secure"] : []),
    ].join("; ");
    res.setHeader("Set-Cookie", cookieOptions);

    const { password_hash, ...safeUser } = user;
    return res.status(200).json(safeUser);
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ message: err.message || "Login failed" });
  }
}
