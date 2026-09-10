import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import connectPgSimple from "connect-pg-simple";
import { pool } from "../server/db";

const PostgresSessionStore = connectPgSimple(session);

const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

const uploadsDir = path.join(process.cwd(), "uploads");
if (fs.existsSync(uploadsDir)) {
  app.use("/uploads", express.static(uploadsDir));
}

app.use(
  session({
    store: new PostgresSessionStore({
      pool: pool as any,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "litera-secret-key-2026-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const httpServer = createServer(app);

// registerRoutes is async but route registration (app.get/post/etc) is synchronous
// so the routes are available immediately even without await
registerRoutes(httpServer, app).catch((err) => {
  console.error("Failed to register routes:", err);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default app;
