import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getConnection } from "./_db";
import { findDatabaseUrl, getAuthenticatedUser } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const dbUrl = findDatabaseUrl();
  if (!dbUrl) return res.status(500).json({ message: "Database not configured." });

  const sql = await getConnection(dbUrl);

  // Create table if needed
  await sql.execute(`CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      email VARCHAR(255) NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      file_name TEXT,
      original_file_name TEXT,
      file_size INTEGER,
      status TEXT DEFAULT 'pending',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // POST: Submit work
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const { name, email, title, category, description, fileName, originalFileName, fileSize } = body || {};
    if (!name || !email || !title || !category) {
      return res.status(400).json({ message: "Name, email, title and category are required" });
    }
    try {
      const [result] = await sql.execute<any>(
        `INSERT INTO submissions (name, email, title, category, description, file_name, original_file_name, file_size, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [String(name), String(email), String(title), String(category), description ? String(description) : null, fileName ? String(fileName) : null, originalFileName ? String(originalFileName) : null, fileSize ? Number(fileSize) : null]
      );
      const [rows] = await sql.execute<any[]>(`SELECT id, name, email, title, category, description, file_name as "fileName", original_file_name as "originalFileName", file_size as "fileSize", status, submitted_at as "submittedAt" FROM submissions WHERE id = ?`, [result.insertId]);
      const submission = rows[0];
      return res.status(201).json(submission);
    } catch (err: any) {
      console.error("Submission error:", err);
      return res.status(500).json({ message: err.message || "Failed to submit" });
    }
  }

  // GET: Admin only
  if (req.method === "GET") {
    const user = await getAuthenticatedUser(req.headers.cookie as string | undefined, sql);
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });

    try {
      const [submissions] = await sql.execute<any[]>(`
        SELECT id, name, email, title, category, description,
               file_name as "fileName", original_file_name as "originalFileName",
               file_size as "fileSize", status,
               submitted_at as "submittedAt"
        FROM submissions
        ORDER BY submitted_at DESC
      `);
      return res.status(200).json(submissions);
    } catch (err: any) {
      console.error("Submissions GET error:", err);
      return res.status(500).json({ message: err.message || "Failed to fetch submissions" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
