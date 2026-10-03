import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";

import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import bcrypt from "bcryptjs";



// Helper: strip passwordHash before sending user to client
function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Attach user from session if present
  app.use(async (req, _res, next) => {
    const userId = req.session?.userId;
    if (userId) {
      try {
        const user = await storage.getUser(userId);
        if (user) {
          (req as any).user = user;
        }
      } catch (error) {
        console.error("Error fetching user from session:", error);
      }
    }
    next();
  });

  // Auth - me
  app.get(["/api/me", "/me", api.auth.me.path], async (req, res, next) => {
    try {
      const user = (req as any).user || null;
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.json(sanitizeUser(user));
    } catch (error) {
      next(error);
    }
  });

  const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(6),
  });

  const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(6),
    adminCode: z.string().optional(),
  });

  app.post(["/api/auth/register", "/auth/register"], async (req, res, next) => {
    try {
      const data = registerSchema.parse(req.body);
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const isFirstUser = (await storage.getAllUsers()).length === 0;
      const isAdmin =
        isFirstUser ||
        (!!process.env.ADMIN_CODE && data.adminCode === process.env.ADMIN_CODE);

      const user = await storage.createUser({
        name: data.name,
        email: data.email,
        passwordHash,
        isAdmin,
        club: "LIT'ERA",
      });

      if (req.session) {
        req.session.userId = user.id;

      }
      
      return res.status(201).json(sanitizeUser(user));
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      console.error("Register error:", err);
      const message = err?.message || "Something went wrong while registering.";
      const status = message === "Email already in use" ? 400 : 500;
      return res.status(status).json({ message });
    }
  });

  app.post(["/api/auth/login", "/auth/login"], async (req, res, next) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(data.password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (req.session) {
        req.session.userId = user.id;

      }
      
      return res.json(sanitizeUser(user));
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      console.error("Login error:", err);
      const message = err?.message || "Something went wrong while logging in.";
      return res.status(500).json({ message });
    }
  });

  app.post(["/api/auth/logout", "/auth/logout"], (req, res, next) => {
    try {
      req.session = null;
      res.clearCookie('litera_session', { path: '/' });
      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // Admin: List Users
  app.get(api.auth.users.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      const usersList = await storage.getAllUsers();
      return res.json(usersList.map(sanitizeUser));
    } catch (error) {
      next(error);
    }
  });

  // Contacts
  app.post(api.contacts.create.path, async (req, res, next) => {
    try {
      const input = api.contacts.create.input.parse(req.body);
      const contact = await storage.createContact(input);
      return res.status(201).json(contact);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      const message = (err as any)?.message || "Failed to submit contact form";
      return res.status(500).json({ message });
    }
  });

  app.get(api.contacts.list.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      const contacts = await storage.getContacts();
      return res.json(contacts);
    } catch (error) {
      next(error);
    }
  });

  // Events
  app.get(api.events.list.path, async (req, res, next) => {
    try {
      const eventsList = await storage.getEvents();
      return res.json(eventsList);
    } catch (error) {
      next(error);
    }
  });

  app.post(api.events.create.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      return res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      const message = (err as any)?.message || "Failed to create event";
      return res.status(500).json({ message });
    }
  });





  // Content Management API
  app.get(api.content.list.path, async (req, res, next) => {
    try {
      const contentList = await storage.getContent();
      return res.json(contentList);
    } catch (error) {
      // Return empty array as fallback to prevent frontend errors
      return res.json([]);
    }
  });

  app.post(api.content.create.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      // Validate input
      const input = api.content.create.input.parse(req.body);
      
      const contentItem = await storage.createContent(input);
      
      return res.status(201).json(contentItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          errors: error.errors
        });
      }
      
      const message = (error as any)?.message || "Failed to create content";
      return res.status(500).json({ message });
    }
  });

  app.put(api.content.update.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const { id } = req.params;
      const updates = api.content.update.input.parse(req.body);
      const contentItem = await storage.updateContent(parseInt(id), updates);
      
      if (!contentItem) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      return res.json(contentItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input: " + error.errors[0]?.message 
        });
      }
      const message = (error as any)?.message || "Failed to update content";
      return res.status(500).json({ message });
    }
  });

  app.delete(api.content.delete.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const { id } = req.params;
      const deleted = await storage.deleteContent(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      const message = (error as any)?.message || "Failed to delete content";
      return res.status(500).json({ message });
    }
  });

  // Seed DB with some initial events and a daily puzzle if none exist
  async function seedDatabase() {
    try {
      // Seed Admin User
      try {
        const adminUser = await storage.getUserByEmail("admin");
        if (!adminUser) {
          const passwordHash = await bcrypt.hash("admin@1234", 10);
          await storage.createUser({
            name: "Administrator",
            email: "admin",
            passwordHash,
            isAdmin: true,
            club: "LIT'ERA",
          });
          console.log("Default admin created: admin / admin@1234");
        }
      } catch (err) {
        // Admin seeding skipped
      }

      // Seed events
      try {
        const existingEvents = await storage.getEvents();
        if (existingEvents.length === 0) {
          await storage.createEvent({
            title: "Annual Literary Festival",
            description: "Join us for a celebration of words, poetry, and storytelling.",
            eventDate: "2024-05-15",
            isActive: true
          });
        }
      } catch (eventError: any) {
        // Event seeding skipped
      }

      // Seed content
      try {
        const existingContent = await storage.getContent();
        if (existingContent.length === 0) {
          await storage.createContent({
            type: "thought",
            title: "The Power of Words",
            content: "Words have the power to change the world, to inspire minds, and to touch hearts in ways nothing else can.",
            author: "LIT'ERA Admin",
            date: new Date().toISOString().split('T')[0],
            isActive: true
          });

          await storage.createContent({
            type: "riddle",
            title: "Literary Riddle",
            content: "I have pages but no fingers, I tell stories but have no voice. What am I?",
            answer: "A book",
            author: "LIT'ERA Admin",
            date: new Date().toISOString().split('T')[0],
            isActive: true
          });

          await storage.createContent({
            type: "quote",
            title: "Daily Inspiration",
            content: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
            author: "George R.R. Martin",
            date: new Date().toISOString().split('T')[0],
            isActive: true
          });
        }
      } catch (contentError: any) {
        // Content seeding skipped
      }
      

    } catch (error) {
      // Don't throw - seeding is non-critical
    }
  }

  // Run seeding asynchronously without blocking server startup
  // Use setImmediate instead of setTimeout for better performance
  setImmediate(() => {
    seedDatabase().catch(err => {
      console.error("Async seeding error:", err);
    });
  });

  // Magazine Submissions
  app.post("/api/submissions", async (req, res, next) => {
    try {
      const { name, email, title, category, description, fileUrl, originalFileName } = req.body;
      
      if (!name || !email || !title || !category || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const submissionData = {
        name,
        email,
        title,
        category,
        description,
        fileName: originalFileName || null,
        fileSize: null,
        originalFileName: originalFileName || null,
        filePath: fileUrl || null,
        fileData: null,
        status: "pending"
      };
      
      const submission = await storage.createSubmission(submissionData);
      
      return res.status(201).json(submission);
    } catch (error) {
      const message = (error as any)?.message || "Failed to submit";
      return res.status(500).json({ message });
    }
  });

  // File Download for Submissions
  app.get("/api/submissions/:id/download", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const submissionId = req.params.id;
      const submission = await storage.getSubmissionById(parseInt(submissionId));
      
      if (!submission || (!submission.fileData && !submission.filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      
      if (submission.filePath && submission.filePath.startsWith('http')) {
        const url = new URL(submission.filePath);
        url.searchParams.set('download', submission.originalFileName || submission.fileName || 'submission.pdf');
        return res.redirect(url.toString());
      }

      // Set headers for file download (fallback for base64 only if needed)
      if (submission.fileData) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${submission.originalFileName || submission.fileName}"`);
        const fileBuffer = Buffer.from(submission.fileData, 'base64');
        return res.send(fileBuffer);
      }
      
      return res.status(404).json({ message: "File data not available" });
    } catch (error) {
      const message = (error as any)?.message || "Failed to download file";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/submissions", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const submissionsList = await storage.getSubmissions();
      return res.json(submissionsList);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/submissions/:id/status", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const { status } = z.object({
        status: z.enum(["pending", "approved", "rejected"]),
      }).parse(req.body);

      const submission = await storage.updateSubmissionStatus(parseInt(req.params.id), status);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      return res.json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid status" });
      }
      next(err);
    }
  });

  // Event Registrations
  app.post("/api/events/:id/register", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { id } = req.params;
      const { eventTitle } = req.body;
      
      if (!eventTitle) {
        return res.status(400).json({ message: "Event title is required" });
      }
      
      // Check if already registered
      const existing = await storage.checkEventRegistration(user.id, parseInt(id));
      if (existing) {
        return res.status(400).json({ message: "Already registered for this event" });
      }
      
      const registration = await storage.createEventRegistration({
        userId: user.id,
        eventId: parseInt(id),
        eventTitle
      });
      
      return res.status(201).json(registration);
    } catch (error) {
      const message = (error as any)?.message || "Failed to register for event";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/events/registrations", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const registrations = await storage.getEventRegistrations(user.id);
      return res.json(registrations);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/event-registrations", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const registrations = await storage.getAllEventRegistrations();
      return res.json(registrations);
    } catch (error) {
      next(error);
    }
  });


  // Publications API


  app.get(api.publications.list.path, async (req, res, next) => {
    try {
      const publicationsList = await storage.getPublications();
      return res.json(publicationsList);
    } catch (error) {
      console.error("Error fetching publications:", error);
      return res.json([]);
    }
  });

  app.post(api.publications.create.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const publicationData = {
        ...req.body,
        pages: req.body.pages ? parseInt(req.body.pages) : null,
        featured: req.body.featured === true || req.body.featured === 'true',
        isActive: req.body.isActive === true || req.body.isActive === 'true',
        coverImage: req.body.coverImage || null,
        pdfFile: req.body.pdfUrl || null,
        pdfData: null,
        pdfFileName: req.body.pdfFileName || null,
      };

      const publication = await storage.createPublication(publicationData);
      return res.status(201).json(publication);
    } catch (error) {
      const message = (error as any)?.message || "Failed to create publication";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/publications/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Increment views first
      await storage.incrementPublicationViews(parseInt(id));
      
      // Then get the updated publication
      const publication = await storage.getPublicationById(parseInt(id));
      
      if (!publication) {
        return res.status(404).json({ message: "Publication not found" });
      }
      
      return res.json(publication);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/publications/:id/download", async (req, res, next) => {
    try {
      const { id } = req.params;
      const publication = await storage.getPublicationById(parseInt(id));
      
      if (!publication || (!publication.pdfData && !publication.pdfFile)) {
        return res.status(404).json({ message: "Publication file not found" });
      }
      
      const inline = req.query.inline === 'true';
      if (!inline) {
        await storage.incrementPublicationDownloads(parseInt(id));
      }

      const disposition = inline ? 'inline' : 'attachment';
      
      if (publication.pdfFile && publication.pdfFile.startsWith('http')) {
        const url = new URL(publication.pdfFile);
        if (!inline) {
          url.searchParams.set('download', publication.pdfFileName || 'publication.pdf');
        }
        return res.redirect(url.toString());
      }

      if (publication.pdfData) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `${disposition}; filename="${publication.pdfFileName || 'publication.pdf'}"`);
        const fileBuffer = Buffer.from(publication.pdfData, 'base64');
        return res.send(fileBuffer);
      }
      
      return res.status(404).json({ message: "File not found on server" });
    } catch (error) {
      const message = (error as any)?.message || "Failed to download publication";
      return res.status(500).json({ message });
    }
  });

  app.put("/api/publications/:id", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const { id } = req.params;
      const updates: any = { ...req.body };
      
      if (req.body.pages !== undefined) updates.pages = parseInt(req.body.pages);
      if (req.body.featured !== undefined) updates.featured = req.body.featured === 'true' || req.body.featured === true;
      if (req.body.isActive !== undefined) updates.isActive = req.body.isActive === 'true' || req.body.isActive === true;
      
      if (req.body.coverImage) updates.coverImage = req.body.coverImage;
      
      if (req.body.pdfUrl) {
        updates.pdfFile = req.body.pdfUrl;
        updates.pdfData = null;
        updates.pdfFileName = req.body.pdfFileName;
      }

      const publication = await storage.updatePublication(parseInt(id as string), updates);
      
      if (!publication) {
        return res.status(404).json({ message: "Publication not found" });
      }
      
      return res.json(publication);
    } catch (error) {
      const message = (error as any)?.message || "Failed to update publication";
      return res.status(500).json({ message });
    }
  });

  app.delete("/api/publications/:id", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const { id } = req.params;
      const deleted = await storage.deletePublication(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Publication not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      const message = (error as any)?.message || "Failed to delete publication";
      return res.status(500).json({ message });
    }
  });

  // Like a publication
  app.post("/api/publications/:id/like", async (req, res, next) => {
    try {
      const { id } = req.params;
      const pubId = parseInt(id);
      if (isNaN(pubId)) {
        return res.status(400).json({ success: false, message: "Invalid publication ID" });
      }
      
      const publication = await storage.getPublicationById(pubId);
      if (!publication) {
        return res.status(404).json({ success: false, message: "Publication not found" });
      }
      
      await storage.incrementPublicationLikes(pubId);
      return res.json({ success: true, likes: (publication.likes || 0) + 1 });
    } catch (error) {
      const message = (error as any)?.message || "Failed to like publication";
      return res.status(500).json({ success: false, message });
    }
  });

  // Track publication view
  app.post("/api/publications/:id/view", async (req, res, next) => {
    try {
      const { id } = req.params;
      const pubId = parseInt(id);
      if (!isNaN(pubId)) {
        await storage.incrementPublicationViews(pubId);
      }
      return res.json({ success: true });
    } catch (error) {
      return res.json({ success: false });
    }
  });

  // Track publication download (separate from GET download to avoid route conflict)
  app.post("/api/publications/:id/track-download", async (req, res, next) => {
    try {
      const { id } = req.params;
      const pubId = parseInt(id);
      if (!isNaN(pubId)) {
        await storage.incrementPublicationDownloads(pubId);
      }
      return res.json({ success: true });
    } catch (error) {
      return res.json({ success: false });
    }
  });

  return httpServer;
}
