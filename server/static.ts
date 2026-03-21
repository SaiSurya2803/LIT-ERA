import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files from the dist directory
  app.use(express.static(distPath));

  // SPA fallback for client-side routing - serves index.html for all non-API routes
  app.use((req, res, next) => {
    // Only handle GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip API routes - they should have been handled already
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Skip static assets (files with extensions)
    // express.static should have handled these, but double-check
    if (req.path.includes('.') && !req.path.endsWith('.html')) {
      return next();
    }
    
    // Serve index.html for all other routes (SPA fallback)
    return res.sendFile(path.resolve(distPath, "index.html"));
  });
}
