import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: any, options: any) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Mount Vite middleware first - handles HMR, static assets, etc.
  app.use(vite.middlewares);

  // SPA fallback for client-side routing - must be last in this file
  // This catches all remaining GET requests and serves the index.html
  app.use(async (req, res, next) => {
    // Only handle GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip API routes - they should have been handled already
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Skip Vite internal routes (HMR, etc.)
    if (req.path.startsWith('/@') || req.path.startsWith('/vite')) {
      return next();
    }

    // Skip static assets (files with extensions)
    // Vite middleware should have handled these, but double-check
    if (req.path.includes('.') && !req.path.endsWith('.html')) {
      return next();
    }

    const url = req.originalUrl;

    try {
      // Use process.cwd() instead of import.meta.dirname for stability
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      // Always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      
      // Add cache-busting for main.tsx
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${Date.now()}"`,
      );
      
      // Transform HTML with Vite (handles HMR injection, etc.)
      const page = await vite.transformIndexHtml(url, template);
      
      // Send response and return to prevent further processing
      return res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      return next(e);
    }
  });
}
