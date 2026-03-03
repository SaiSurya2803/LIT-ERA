import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";

// Use memory store for SQLite (simpler for development)
const MemoryStoreSession = MemoryStore(session);

// Global error handlers
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Serve uploads folder for static files (images, PDFs, etc.)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Use memory store for sessions (works with both SQLite and PostgreSQL)
app.use(
  session({
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  }),
);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // 1. Register all API routes first
  await registerRoutes(httpServer, app);

  // 2. Setup static serving or Vite dev server
  // This must be after API routes but before error handlers
  // The vite/static modules include their own SPA fallback handlers
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // 3. 404 handler for unmatched routes
  // This should rarely be reached since vite/static handle SPA fallback
  app.use((req, res, next) => {
    // API routes that weren't matched
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ 
        success: false,
        message: "API endpoint not found",
        path: req.path 
      });
    }
    // Non-API routes that somehow weren't caught by SPA fallback
    return res.status(404).json({ 
      success: false,
      message: "Not found",
      path: req.path
    });
  });

  // 4. Global error handler - must be absolute last
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const code = err.code || "INTERNAL_ERROR";

    console.error(`[${code}] ${message}:`, {
      error: err,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });

    // Don't send response if headers already sent
    if (res.headersSent) {
      console.error("Headers already sent, cannot send error response");
      return;
    }

    // Don't expose stack trace in production
    const errorResponse: any = {
      success: false,
      message,
      code,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV !== "production") {
      errorResponse.stack = err.stack;
      errorResponse.details = err;
    }

    return res.status(status).json(errorResponse);
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
