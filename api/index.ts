import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: true, credentials: true }));

// Normalize request URLs so both /api/... and /... work seamlessly on Vercel
app.use((req, _res, next) => {
  if (req.query && req.query.__path) {
    const sub = String(req.query.__path);
    req.url = "/api/" + sub.replace(/^\//, "");
  } else if (!req.url.startsWith("/api") && !req.url.startsWith("/uploads")) {
    req.url = "/api" + req.url;
  }
  next();
});

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Serve uploads directory for static assets
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "litera-secret-key-2026-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Register routes synchronously at module load time
const httpServer = createServer(app);
registerRoutes(httpServer, app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Serverless API Error:", err);
  if (!res.headersSent) {
    res.status(status).json({ success: false, message });
  }
});

export default app;
