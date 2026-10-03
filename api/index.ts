import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cookieSession from "cookie-session";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Using cookie-session to completely bypass Vercel DB pooling issues!
app.use(
  cookieSession({
    name: "litera_session",
    keys: [process.env.SESSION_SECRET || "litera-club-secret-key-production"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true
  })
);

const httpServer = createServer(app);
registerRoutes(httpServer, app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default app;
