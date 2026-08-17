import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const MemoryStoreSession = MemoryStore(session);

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

// Register routes with HTTP server instance
const httpServer = createServer(app);
let routesInitPromise: Promise<any> | null = null;

function ensureRoutesInitialized() {
  if (!routesInitPromise) {
    routesInitPromise = registerRoutes(httpServer, app)
      .then(() => {
        // Attach error handler after routes are mounted
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          console.error("Serverless API Error:", err);
          if (!res.headersSent) {
            res.status(status).json({ success: false, message });
          }
        });
      })
      .catch((err) => {
        console.error("Failed to register serverless routes:", err);
        routesInitPromise = null;
        throw err;
      });
  }
  return routesInitPromise;
}

// Vercel Serverless Function entrypoint handler
export default async function handler(req: Request, res: Response) {
  try {
    await ensureRoutesInitialized();
    return app(req, res);
  } catch (error: any) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error?.message || "Internal Server Error",
      });
    }
  }
}
