import type { Express } from "express";
import { createServer } from "http";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Configure multer for file uploads
const storageMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "submissions");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storageMulter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, and Text files are allowed.'));
    }
  }
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Attach user from session if present
  app.use(async (req, _res, next) => {
    const userId = req.session.userId;
    if (userId) {
      const user = await storage.getUser(userId);
      if (user) {
        (req as any).user = user;
      }
    }
    next();
  });

  // Auth - me
  app.get(api.auth.me.path, async (req, res, next) => {
    try {
      const user = (req as any).user || null;
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      return res.json(user);
    } catch (error) {
      next(error);
    }
  });

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    adminCode: z.string().optional(),
  });

  app.post("/api/auth/register", async (req, res, next) => {
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

      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      return res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      console.error("Register error:", err);
      const message = (err as any)?.message || "Something went wrong while registering.";
      return res.status(500).json({ message });
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
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

      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      return res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      console.error("Login error:", err);
      const message = (err as any)?.message || "Something went wrong while logging in.";
      return res.status(500).json({ message });
    }
  });

  app.post("/api/auth/logout", (req, res, next) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie('connect.sid');
        res.status(204).end();
      });
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
      return res.json(usersList);
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
      console.error("Contact creation error:", err);
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
      console.error("Event creation error:", err);
      const message = (err as any)?.message || "Failed to create event";
      return res.status(500).json({ message });
    }
  });

  // Game Scores
  app.post(api.gameScores.create.path, async (req, res, next) => {
    try {
      const input = api.gameScores.create.input.parse(req.body);
      const user = (req as any).user;
      if (user && !input.userId) {
        input.userId = user.id;
      }
      const score = await storage.createGameScore(input);
      return res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      console.error("Game score creation error:", err);
      const message = (err as any)?.message || "Failed to submit game score";
      return res.status(500).json({ message });
    }
  });

  app.get(api.gameScores.list.path, async (req, res, next) => {
    try {
      const scores = await storage.getGameScores();
      return res.json(scores);
    } catch (error) {
      next(error);
    }
  });

  // Puzzles
  app.get(api.puzzles.list.path, async (req, res, next) => {
    try {
      const puzzlesList = await storage.getPuzzles();
      return res.json(puzzlesList);
    } catch (error) {
      next(error);
    }
  });

  app.post(api.puzzles.create.path, async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      const input = api.puzzles.create.input.parse(req.body);
      const puzzle = await storage.createPuzzle(input);
      return res.status(201).json(puzzle);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
      }
      console.error("Puzzle creation error:", err);
      const message = (err as any)?.message || "Failed to create puzzle";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/puzzles/daily/:type", async (req, res, next) => {
    try {
      const { type } = req.params;
      const today = new Date().toISOString().split('T')[0];
      console.log(`[Puzzle API] Fetching ${type} puzzle for date: ${today}`);
      
      const puzzle = await storage.getDailyPuzzle(type, today);
      
      if (puzzle) {
        console.log(`[Puzzle API] Found puzzle:`, {
          id: puzzle.id,
          type: puzzle.type,
          publishDate: puzzle.publishDate,
          dataLength: typeof puzzle.data === 'string' ? puzzle.data.length : 'not a string'
        });
      } else {
        console.log(`[Puzzle API] No puzzle found for ${type} on ${today}`);
      }
      
      return res.json(puzzle || null);
    } catch (error) {
      console.error('[Puzzle API] Error:', error);
      next(error);
    }
  });

  // Admin: Cleanup old game data
  app.delete("/api/admin/cleanup/:gameType", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

      const { gameType } = req.params;
      console.log(`[Admin] Cleaning up ${gameType} data...`);

      const puzzlesDeleted = await storage.deletePuzzlesByType(gameType);
      const scoresDeleted = await storage.deleteGameScoresByType(gameType);

      return res.json({
        success: true,
        message: `Cleanup completed for ${gameType}`,
        puzzlesDeleted,
        scoresDeleted
      });
    } catch (error) {
      console.error('[Admin] Cleanup error:', error);
      next(error);
    }
  });

  // Content Management API
  app.get(api.content.list.path, async (req, res, next) => {
    try {
      const contentList = await storage.getContent();
      return res.json(contentList);
    } catch (error) {
      console.error("Content fetch error:", error);
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
      
      console.log("Received content creation request:", JSON.stringify(req.body, null, 2));
      
      // Validate input
      const input = api.content.create.input.parse(req.body);
      console.log("Parsed and validated input:", JSON.stringify(input, null, 2));
      
      const contentItem = await storage.createContent(input);
      console.log("Created content item:", JSON.stringify(contentItem, null, 2));
      
      return res.status(201).json(contentItem);
    } catch (error) {
      console.error("Content creation error:", error);
      
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", JSON.stringify(error.errors, null, 2));
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
      console.error("Content update error:", error);
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
      console.error("Content deletion error:", error);
      const message = (error as any)?.message || "Failed to delete content";
      return res.status(500).json({ message });
    }
  });

  // Seed DB with some initial events and a daily puzzle if none exist
  async function seedDatabase() {
    try {
      console.log("Starting database seeding...");
      
      // Seed events
      try {
        const existingEvents = await storage.getEvents();
        if (existingEvents.length === 0) {
          console.log("Seeding initial event...");
          await storage.createEvent({
            title: "Annual Literary Festival",
            description: "Join us for a celebration of words, poetry, and storytelling.",
            eventDate: "2024-05-15",
            isActive: true
          });
          console.log("Event seeded successfully");
        }
      } catch (eventError: any) {
        console.log("Event seeding skipped:", eventError.message);
      }

      // Seed content
      try {
        const existingContent = await storage.getContent();
        if (existingContent.length === 0) {
          console.log("Seeding initial content...");
          
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
          
          console.log("Content seeded successfully");
        }
      } catch (contentError: any) {
        console.log("Content seeding skipped:", contentError.message);
      }
      
      // Seed daily puzzle
      try {
        const today = new Date().toISOString().split('T')[0];
        const existingPuzzle = await storage.getDailyPuzzle("strands", today);
        if (!existingPuzzle) {
          console.log("Seeding daily strands puzzle...");
          await storage.createPuzzle({
            type: "strands",
            publishDate: today,
            data: JSON.stringify({
              grid: [
                ["B", "O", "O", "K", "S"],
                ["W", "O", "R", "D", "S"],
                ["P", "O", "E", "M", "S"]
              ],
              words: ["BOOKS", "WORDS", "POEMS"],
              theme: "Literary Terms"
            })
          });
          console.log("Strands puzzle seeded successfully");
        }
      } catch (puzzleError: any) {
        console.log("Puzzle seeding skipped:", puzzleError.message);
      }
      
      console.log("Database seeding completed");
    } catch (error) {
      console.error("Database seeding failed:", error);
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

  // Magazine Submissions with File Upload
  app.post("/api/submissions", upload.single("file"), async (req, res, next) => {
    try {
      console.log('Received submission request body:', req.body);
      console.log('Received file:', req.file);
      
      const { name, email, title, category, description } = req.body;
      
      console.log('Parsed submission data:', {
        name,
        email,
        title,
        category,
        description
      });
      
      if (!name || !email || !title || !category || !description) {
        console.log('Missing required fields');
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const submissionData = {
        name,
        email,
        title,
        category,
        description,
        fileName: req.file ? req.file.filename : null,
        fileSize: req.file ? req.file.size : null,
        originalFileName: req.file ? req.file.originalname : null,
        filePath: req.file ? req.file.path : null,
        status: "pending"
      };
      
      console.log('Creating submission with data:', submissionData);
      
      const submission = await storage.createSubmission(submissionData);
      
      console.log('Submission created successfully:', submission);
      
      return res.status(201).json(submission);
    } catch (error) {
      console.error("Submission error:", error);
      const message = (error as any)?.message || "Failed to submit";
      return res.status(500).json({ message });
    }
  });

  // File Upload for Submissions
  app.post("/api/submissions/upload", async (req, res, next) => {
    try {
      // For now, we'll simulate file upload by returning a success response
      // In a real implementation, you would use multer or similar middleware
      // to handle file uploads and store them in a secure location
      const submissionId = req.body.submissionId;
      const fileName = req.body.fileName;
      
      if (!submissionId || !fileName) {
        return res.status(400).json({ message: "Submission ID and file name are required" });
      }
      
      // Simulate successful file upload
      return res.status(200).json({ 
        message: "File uploaded successfully",
        fileName: fileName,
        fileUrl: `/uploads/submissions/${fileName}`
      });
    } catch (error) {
      console.error("File upload error:", error);
      const message = (error as any)?.message || "Failed to upload file";
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
      
      if (!submission || !submission.fileName) {
        return res.status(404).json({ message: "File not found" });
      }
      
      const filePath = submission.filePath;
      if (!filePath || !existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on server" });
      }
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${submission.originalFileName || submission.fileName}"`);
      
      // Send the file
      return res.sendFile(filePath);
    } catch (error) {
      console.error("File download error:", error);
      const message = (error as any)?.message || "Failed to download file";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/submissions", async (req, res, next) => {
    try {
      console.log('Admin requesting submissions...');
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        console.log('Access denied - not admin');
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const submissionsList = await storage.getSubmissions();
      console.log('Fetched submissions from database:', submissionsList);
      console.log('Number of submissions:', submissionsList.length);
      
      // Log each submission's file info
      submissionsList.forEach((sub, index) => {
        console.log(`Submission ${index + 1}:`, {
          id: sub.id,
          title: sub.title,
          fileName: sub.fileName,
          fileSize: sub.fileSize,
          status: sub.status
        });
      });
      
      return res.json(submissionsList);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      next(error);
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
      console.error("Event registration error:", error);
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

  // MUN Registrations
  app.post("/api/mun/register", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { name, email, phone, institution, committee, experience } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      // Check if already registered
      const existing = await storage.checkMunRegistration(user.id);
      if (existing) {
        return res.status(400).json({ message: "Already registered for MUN" });
      }
      
      const registration = await storage.createMunRegistration({
        userId: user.id,
        name,
        email,
        phone: phone || null,
        institution: institution || null,
        committee: committee || null,
        experience: experience || null
      });
      
      return res.status(201).json(registration);
    } catch (error) {
      console.error("MUN registration error:", error);
      const message = (error as any)?.message || "Failed to register for MUN";
      return res.status(500).json({ message });
    }
  });

  app.get("/api/mun/registrations", async (req, res, next) => {
    try {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      
      const registrations = await storage.getMunRegistrations();
      return res.json(registrations);
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
