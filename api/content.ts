import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getConnection } from "./_db";
import { findDatabaseUrl, getAuthenticatedUser, ensureCoreTables } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const dbUrl = findDatabaseUrl();
  if (!dbUrl) return res.status(500).json({ message: "Database not configured." });

  const sql = await getConnection(dbUrl);
  await ensureCoreTables(sql);

  // Extract ID if present in query or URL
  const rawId = req.query.id || req.url?.match(/\/api\/content\/(\d+)/)?.[1];
  const id = rawId ? Number(rawId) : null;

  // GET: Public list of content
  if (req.method === "GET") {
    try {
      const [items] = await sql.execute<any[]>(`
        SELECT id, type, title, content, answer, author, date, is_active as "isActive", created_at as "createdAt"
        FROM content
        WHERE is_active = TRUE
        ORDER BY id DESC
      `);
      return res.status(200).json(items);
    } catch (err: any) {
      console.error("Content GET error:", err);
      return res.status(200).json([]);
    }
  }

  // Admin Auth required for mutating content
  const user = await getAuthenticatedUser(req.headers.cookie as string | undefined, sql);
  if (!user) return res.status(401).json({ message: "Not authenticated" });
  if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });

  // POST: Create content
  if (req.method === "POST") {
    const { type, title, content, answer, author, date, isActive } = req.body || {};
    if (!type || !title || !content || !author) {
      return res.status(400).json({ message: "Type, title, content, and author are required" });
    }
    try {
      const formattedDate = date || new Date().toISOString().split("T")[0];
      const [result] = await sql.execute<any>(
        `INSERT INTO content (type, title, content, answer, author, date, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [String(type), String(title), String(content), answer ? String(answer) : null, String(author), formattedDate, isActive ?? true]
      );
      const [rows] = await sql.execute<any[]>(`SELECT id, type, title, content, answer, author, date, is_active as "isActive", created_at as "createdAt" FROM content WHERE id = ?`, [result.insertId]);
      const item = rows[0];
      return res.status(201).json(item);
    } catch (err: any) {
      console.error("Content creation error:", err);
      return res.status(500).json({ message: err.message || "Failed to create content" });
    }
  }

  // PUT: Update content
  if (req.method === "PUT") {
    if (!id) return res.status(400).json({ message: "Content ID is required" });
    const { type, title, content, answer, author, date, isActive } = req.body || {};
    try {
      await sql.execute(
        `UPDATE content
        SET 
          type = COALESCE(?, type),
          title = COALESCE(?, title),
          content = COALESCE(?, content),
          answer = COALESCE(?, answer),
          author = COALESCE(?, author),
          date = COALESCE(?, date),
          is_active = COALESCE(?, is_active)
        WHERE id = ?`,
        [type ? String(type) : null, title ? String(title) : null, content ? String(content) : null, answer !== undefined ? (answer ? String(answer) : null) : null, author ? String(author) : null, date ? String(date) : null, isActive !== undefined ? Boolean(isActive) : null, id]
      );
      // Fallback for logic in typescript
      const [rows] = await sql.execute<any[]>(`SELECT id, type, title, content, answer, author, date, is_active as "isActive", created_at as "createdAt" FROM content WHERE id = ?`, [id]);
      const item = rows[0];
      if (!item) return res.status(404).json({ message: "Content not found" });
      return res.status(200).json(item);
    } catch (err: any) {
      console.error("Content update error:", err);
      return res.status(500).json({ message: err.message || "Failed to update content" });
    }
  }

  // DELETE: Delete content
  if (req.method === "DELETE") {
    if (!id) return res.status(400).json({ message: "Content ID is required" });
    try {
      await sql.execute(`DELETE FROM content WHERE id = ?`, [id]);
      return res.status(204).end();
    } catch (err: any) {
      console.error("Content delete error:", err);
      return res.status(500).json({ message: err.message || "Failed to delete content" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
