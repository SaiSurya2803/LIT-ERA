import { db } from "./db";
import {
  users,
  contactSubmissions,
  events,
  gameScores,
  puzzles,
  content,
  submissions,
  eventRegistrations,
  munRegistrations,
  type User,
  type InsertUser,
  type ContactSubmission,
  type InsertContact,
  type Event,
  type InsertEvent,
  type GameScore,
  type InsertGameScore,
  type Puzzle,
  type InsertPuzzle,
  type Content,
  type InsertContent,
  type Submission,
  type InsertSubmission,
  type EventRegistration,
  type InsertEventRegistration,
  type MunRegistration,
  type InsertMunRegistration,
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  createContact(contact: InsertContact): Promise<ContactSubmission>;
  getContacts(): Promise<ContactSubmission[]>;

  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;

  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getGameScores(): Promise<GameScore[]>;

  createPuzzle(puzzle: InsertPuzzle): Promise<Puzzle>;
  getPuzzles(): Promise<Puzzle[]>;
  getDailyPuzzle(type: string, date: string): Promise<Puzzle | undefined>;
  deletePuzzlesByType(type: string): Promise<number>; // Returns count of deleted puzzles
  deleteGameScoresByType(gameType: string): Promise<number>; // Returns count of deleted scores

  createContent(contentItem: InsertContent): Promise<Content>;
  getContent(): Promise<Content[]>;
  updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;

  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(): Promise<Submission[]>;
  getSubmissionById(id: number): Promise<Submission | undefined>;

  // Event Registrations
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistrations(userId: string): Promise<EventRegistration[]>;
  checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined>;

  // MUN Registrations
  createMunRegistration(registration: InsertMunRegistration): Promise<MunRegistration>;
  getMunRegistrations(): Promise<MunRegistration[]>;
  checkMunRegistration(userId: string): Promise<MunRegistration | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === '23505') { // Unique constraint violation
        throw new Error("Email already in use");
      }
      throw new Error("Failed to create user");
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await db.select().from(users).orderBy(desc(users.joinDate));
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    try {
      const [submission] = await db.insert(contactSubmissions).values(contact).returning();
      return submission;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to submit contact form");
    }
  }

  async getContacts(): Promise<ContactSubmission[]> {
    try {
      return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submissionDate));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw new Error("Failed to fetch contacts");
    }
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    try {
      const [ev] = await db.insert(events).values(event).returning();
      return ev;
    } catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Failed to create event");
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      return await db.select().from(events).where(eq(events.isActive, true));
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new Error("Failed to fetch events");
    }
  }

  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    try {
      const [gameScore] = await db.insert(gameScores).values(score).returning();
      return gameScore;
    } catch (error) {
      console.error("Error creating game score:", error);
      throw new Error("Failed to submit game score");
    }
  }

  async getGameScores(): Promise<GameScore[]> {
    try {
      return await db.select().from(gameScores).orderBy(desc(gameScores.completedDate));
    } catch (error) {
      console.error("Error fetching game scores:", error);
      throw new Error("Failed to fetch game scores");
    }
  }

  async createPuzzle(insertPuzzle: InsertPuzzle): Promise<Puzzle> {
    try {
      const [puzzle] = await db.insert(puzzles).values(insertPuzzle).returning();
      return puzzle;
    } catch (error) {
      console.error("Error creating puzzle:", error);
      throw new Error("Failed to create puzzle");
    }
  }

  async getPuzzles(): Promise<Puzzle[]> {
    try {
      return await db.select().from(puzzles).orderBy(desc(puzzles.publishDate));
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      throw new Error("Failed to fetch puzzles");
    }
  }

  async getDailyPuzzle(type: string, date: string): Promise<Puzzle | undefined> {
    try {
      console.log(`[Storage] Querying puzzle: type=${type}, date=${date}`);
      
      const [puzzle] = await db.select().from(puzzles).where(
        and(
          eq(puzzles.type, type),
          eq(puzzles.publishDate, date)
        )
      );
      
      if (puzzle) {
        console.log(`[Storage] Puzzle found:`, {
          id: puzzle.id,
          type: puzzle.type,
          publishDate: puzzle.publishDate,
          hasData: !!puzzle.data
        });
      } else {
        console.log(`[Storage] No puzzle found matching criteria`);
        
        // Debug: Show all puzzles
        const allPuzzles = await db.select().from(puzzles);
        console.log(`[Storage] Total puzzles in database: ${allPuzzles.length}`);
        if (allPuzzles.length > 0) {
          console.log(`[Storage] Available puzzles:`, allPuzzles.map(p => ({
            type: p.type,
            date: p.publishDate
          })));
        }
      }
      
      return puzzle;
    } catch (error) {
      console.error("[Storage] Error fetching daily puzzle:", error);
      throw new Error("Failed to fetch daily puzzle");
    }
  }

  async deletePuzzlesByType(type: string): Promise<number> {
    try {
      console.log(`[Storage] Deleting puzzles of type: ${type}`);
      const result = await db.delete(puzzles).where(eq(puzzles.type, type));
      const count = result.rowCount || 0;
      console.log(`[Storage] Deleted ${count} puzzles of type ${type}`);
      return count;
    } catch (error) {
      console.error(`[Storage] Error deleting puzzles of type ${type}:`, error);
      throw new Error(`Failed to delete puzzles of type ${type}`);
    }
  }

  async deleteGameScoresByType(gameType: string): Promise<number> {
    try {
      console.log(`[Storage] Deleting game scores of type: ${gameType}`);
      const result = await db.delete(gameScores).where(eq(gameScores.gameType, gameType));
      const count = result.rowCount || 0;
      console.log(`[Storage] Deleted ${count} game scores of type ${gameType}`);
      return count;
    } catch (error) {
      console.error(`[Storage] Error deleting game scores of type ${gameType}:`, error);
      throw new Error(`Failed to delete game scores of type ${gameType}`);
    }
  }

  // Content management implementations
  async createContent(contentItem: InsertContent): Promise<Content> {
    try {
      const [newContent] = await db.insert(content).values(contentItem).returning();
      return newContent;
    } catch (error) {
      console.error("Error creating content:", error);
      throw new Error("Failed to create content");
    }
  }

  async getContent(): Promise<Content[]> {
    try {
      return await db.select().from(content).where(eq(content.isActive, true)).orderBy(desc(content.date));
    } catch (error) {
      console.error("Error fetching content:", error);
      throw new Error("Failed to fetch content");
    }
  }

  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    try {
      const [updatedContent] = await db
        .update(content)
        .set(updates)
        .where(eq(content.id, id))
        .returning();
      return updatedContent;
    } catch (error) {
      console.error("Error updating content:", error);
      throw new Error("Failed to update content");
    }
  }

  async deleteContent(id: number): Promise<boolean> {
    try {
      const result = await db.delete(content).where(eq(content.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting content:", error);
      throw new Error("Failed to delete content");
    }
  }

  // Submissions
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    try {
      const [submission] = await db.insert(submissions).values(insertSubmission).returning();
      return submission;
    } catch (error) {
      console.error("Error creating submission:", error);
      throw new Error("Failed to create submission");
    }
  }

  async getSubmissions(): Promise<Submission[]> {
    try {
      return await db.select().from(submissions).orderBy(desc(submissions.submittedAt));
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw new Error("Failed to fetch submissions");
    }
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    try {
      const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
      return submission;
    } catch (error) {
      console.error("Error fetching submission:", error);
      throw new Error("Failed to fetch submission");
    }
  }

  // Event Registrations
  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    try {
      const [eventReg] = await db.insert(eventRegistrations).values(registration).returning();
      return eventReg;
    } catch (error) {
      console.error("Error creating event registration:", error);
      throw new Error("Failed to register for event");
    }
  }

  async getEventRegistrations(userId: string): Promise<EventRegistration[]> {
    try {
      return await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId)).orderBy(desc(eventRegistrations.registeredAt));
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      throw new Error("Failed to fetch event registrations");
    }
  }

  async checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined> {
    try {
      const [registration] = await db.select().from(eventRegistrations).where(
        and(
          eq(eventRegistrations.userId, userId),
          eq(eventRegistrations.eventId, eventId)
        )
      );
      return registration;
    } catch (error) {
      console.error("Error checking event registration:", error);
      throw new Error("Failed to check event registration");
    }
  }

  // MUN Registrations
  async createMunRegistration(registration: InsertMunRegistration): Promise<MunRegistration> {
    try {
      const [munReg] = await db.insert(munRegistrations).values(registration).returning();
      return munReg;
    } catch (error) {
      console.error("Error creating MUN registration:", error);
      throw new Error("Failed to register for MUN");
    }
  }

  async getMunRegistrations(): Promise<MunRegistration[]> {
    try {
      return await db.select().from(munRegistrations).orderBy(desc(munRegistrations.registeredAt));
    } catch (error) {
      console.error("Error fetching MUN registrations:", error);
      throw new Error("Failed to fetch MUN registrations");
    }
  }

  async checkMunRegistration(userId: string): Promise<MunRegistration | undefined> {
    try {
      const [registration] = await db.select().from(munRegistrations).where(eq(munRegistrations.userId, userId));
      return registration;
    } catch (error) {
      console.error("Error checking MUN registration:", error);
      throw new Error("Failed to check MUN registration");
    }
  }
}

export const storage = new DatabaseStorage();
