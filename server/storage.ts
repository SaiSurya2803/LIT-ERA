import crypto from "crypto";
import { db, ensureTables } from "./db";
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
  publications,
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
  type Publication,
  type InsertPublication,
} from "../shared/schema";
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
  deletePuzzlesByType(type: string): Promise<number>;
  deleteGameScoresByType(gameType: string): Promise<number>;

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

  // Publications
  createPublication(publication: InsertPublication): Promise<Publication>;
  getPublications(): Promise<Publication[]>;
  getPublicationById(id: number): Promise<Publication | undefined>;
  updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<boolean>;
  incrementPublicationViews(id: number): Promise<void>;
  incrementPublicationDownloads(id: number): Promise<void>;
  incrementPublicationLikes(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      await ensureTables();
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw new Error(error?.message || "Failed to fetch user");
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      await ensureTables();
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error: any) {
      console.error("Error fetching user by email:", error);
      throw new Error(error?.message || "Failed to fetch user");
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      await ensureTables();
      const id = crypto.randomUUID();
      const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
      return user;
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new Error("Email already in use");
      }
      throw new Error(error?.message || "Failed to create user");
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      await ensureTables();
      return await db.select().from(users).orderBy(desc(users.joinDate));
    } catch (error: any) {
      console.error("Error fetching all users:", error);
      return [];
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
      const [puzzle] = await db.select().from(puzzles).where(
        and(
          eq(puzzles.type, type),
          eq(puzzles.publishDate, date)
        )
      );
      return puzzle;
    } catch (error) {
      console.error("[Storage] Error fetching daily puzzle:", error);
      throw new Error("Failed to fetch daily puzzle");
    }
  }

  async deletePuzzlesByType(type: string): Promise<number> {
    try {
      const result = await db.delete(puzzles).where(eq(puzzles.type, type)).returning();
      return result.length;
    } catch (error) {
      console.error(`[Storage] Error deleting puzzles of type ${type}:`, error);
      throw new Error(`Failed to delete puzzles of type ${type}`);
    }
  }

  async deleteGameScoresByType(gameType: string): Promise<number> {
    try {
      const result = await db.delete(gameScores).where(eq(gameScores.gameType, gameType)).returning();
      return result.length;
    } catch (error) {
      console.error(`[Storage] Error deleting game scores of type ${gameType}:`, error);
      throw new Error(`Failed to delete game scores of type ${gameType}`);
    }
  }

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
      const [updatedContent] = await db.update(content).set(updates).where(eq(content.id, id)).returning();
      return updatedContent;
    } catch (error) {
      console.error("Error updating content:", error);
      throw new Error("Failed to update content");
    }
  }

  async deleteContent(id: number): Promise<boolean> {
    try {
      const result = await db.delete(content).where(eq(content.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting content:", error);
      throw new Error("Failed to delete content");
    }
  }

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

  async createPublication(insertPublication: InsertPublication): Promise<Publication> {
    try {
      const [publication] = await db.insert(publications).values(insertPublication).returning();
      return publication;
    } catch (error) {
      console.error("Error creating publication:", error);
      throw new Error("Failed to create publication");
    }
  }

  async getPublications(): Promise<Publication[]> {
    try {
      return await db.select().from(publications).where(eq(publications.isActive, true)).orderBy(desc(publications.publishDate));
    } catch (error) {
      console.error("Error fetching publications:", error);
      throw new Error("Failed to fetch publications");
    }
  }

  async getPublicationById(id: number): Promise<Publication | undefined> {
    try {
      const [publication] = await db.select().from(publications).where(eq(publications.id, id));
      return publication;
    } catch (error) {
      console.error("Error fetching publication:", error);
      throw new Error("Failed to fetch publication");
    }
  }

  async updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined> {
    try {
      const [updatedPublication] = await db.update(publications).set(updates).where(eq(publications.id, id)).returning();
      return updatedPublication;
    } catch (error) {
      console.error("Error updating publication:", error);
      throw new Error("Failed to update publication");
    }
  }

  async deletePublication(id: number): Promise<boolean> {
    try {
      const result = await db.delete(publications).where(eq(publications.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting publication:", error);
      throw new Error("Failed to delete publication");
    }
  }

  async incrementPublicationViews(id: number): Promise<void> {
    try {
      const publication = await this.getPublicationById(id);
      if (publication) {
        await db
          .update(publications)
          .set({ views: (publication.views || 0) + 1 })
          .where(eq(publications.id, id));
      }
    } catch (error) {
      console.error("Error incrementing publication views:", error);
    }
  }

  async incrementPublicationDownloads(id: number): Promise<void> {
    try {
      const publication = await this.getPublicationById(id);
      if (publication) {
        await db
          .update(publications)
          .set({ downloads: (publication.downloads || 0) + 1 })
          .where(eq(publications.id, id));
      }
    } catch (error) {
      console.error("Error incrementing publication downloads:", error);
    }
  }

  async incrementPublicationLikes(id: number): Promise<void> {
    try {
      const publication = await this.getPublicationById(id);
      if (publication) {
        await db
          .update(publications)
          .set({ likes: (publication.likes || 0) + 1 })
          .where(eq(publications.id, id));
      }
    } catch (error) {
      console.error("Error incrementing publication likes:", error);
    }
  }
}

export const storage = new DatabaseStorage();