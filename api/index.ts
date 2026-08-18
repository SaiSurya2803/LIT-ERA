import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import connectPgSimple from "connect-pg-simple";
import { findDatabaseUrl } from "../server/db";

const PostgresSessionStore = connectPgSimple(session);

const app = express();
app.set("trust proxy", 1);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  session({
    store: new PostgresSessionStore({
      conObject: {
        connectionString: findDatabaseUrl() || "postgres://localhost:5432/postgres",
      },
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
