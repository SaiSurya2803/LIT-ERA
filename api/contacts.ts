import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { findPostgresUrl, getAuthenticatedUser } from "./_db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const dbUrl = findPostgresUrl();
  if (!dbUrl) return res.status(500).json({ message: "Database not configured." });

  const sql = neon(dbUrl);

  // POST: Submit a contact form (public)
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }
    const { name, email, subject, message } = body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }
    try {
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
      const [contact] = await sql`
        INSERT INTO contact_submissions (name, email, subject, message)
        VALUES (${String(name)}, ${String(email)}, ${subject ? String(subject) : null}, ${String(message)})
        RETURNING id, name, email, subject, message, submission_date as "submissionDate"
      `;
      return res.status(201).json(contact);
    } catch (err: any) {
      console.error("Contact error:", err);
      return res.status(500).json({ message: err.message || "Failed to submit" });
    }
  }

  // GET: Admin only
  if (req.method === "GET") {
    const user = await getAuthenticatedUser(req.headers.cookie as string | undefined, sql);
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });

    try {
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
      const contacts = await sql`
        SELECT id, name, email, subject, message, submission_date as "submissionDate"
        FROM contact_submissions
        ORDER BY submission_date DESC
      `;
      return res.status(200).json(contacts);
    } catch (err: any) {
      console.error("Contacts GET error:", err);
      return res.status(500).json({ message: err.message || "Failed to fetch contacts" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
