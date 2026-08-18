import crypto from "crypto";
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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = crypto.randomUUID();
      const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
      return user;
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
        throw new Error("Email already in use");
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.joinDate));
  }

  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(contact).returning();
    return submission;
  }

  async getContacts(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submissionDate));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [ev] = await db.insert(events).values(event).returning();
    return ev;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.isActive, true));
  }

  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const [gameScore] = await db.insert(gameScores).values(score).returning();
    return gameScore;
  }

  async getGameScores(): Promise<GameScore[]> {
    return await db.select().from(gameScores).orderBy(desc(gameScores.completedDate));
  }

  async createPuzzle(insertPuzzle: InsertPuzzle): Promise<Puzzle> {
    const [puzzle] = await db.insert(puzzles).values(insertPuzzle).returning();
    return puzzle;
  }

  async getPuzzles(): Promise<Puzzle[]> {
    return await db.select().from(puzzles).orderBy(desc(puzzles.publishDate));
  }

  async getDailyPuzzle(type: string, date: string): Promise<Puzzle | undefined> {
    const [puzzle] = await db.select().from(puzzles).where(
      and(
        eq(puzzles.type, type),
        eq(puzzles.publishDate, date)
      )
    );
    return puzzle;
  }

  async deletePuzzlesByType(type: string): Promise<number> {
    const result = await db.delete(puzzles).where(eq(puzzles.type, type)).returning();
    return result.length;
  }

  async deleteGameScoresByType(gameType: string): Promise<number> {
    const result = await db.delete(gameScores).where(eq(gameScores.gameType, gameType)).returning();
    return result.length;
  }

  async createContent(contentItem: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(content).values(contentItem).returning();
    return newContent;
  }

  async getContent(): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.isActive, true)).orderBy(desc(content.date));
  }

  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const [updatedContent] = await db.update(content).set(updates).where(eq(content.id, id)).returning();
    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    const result = await db.delete(content).where(eq(content.id, id)).returning();
    return result.length > 0;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const [submission] = await db.insert(submissions).values(insertSubmission).returning();
    return submission;
  }

  async getSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions).orderBy(desc(submissions.submittedAt));
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission;
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [eventReg] = await db.insert(eventRegistrations).values(registration).returning();
    return eventReg;
  }

  async getEventRegistrations(userId: string): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId)).orderBy(desc(eventRegistrations.registeredAt));
  }

  async checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined> {
    const [registration] = await db.select().from(eventRegistrations).where(
      and(
        eq(eventRegistrations.userId, userId),
        eq(eventRegistrations.eventId, eventId)
      )
    );
    return registration;
  }

  async createMunRegistration(registration: InsertMunRegistration): Promise<MunRegistration> {
    const [munReg] = await db.insert(munRegistrations).values(registration).returning();
    return munReg;
  }

  async getMunRegistrations(): Promise<MunRegistration[]> {
    return await db.select().from(munRegistrations).orderBy(desc(munRegistrations.registeredAt));
  }

  async checkMunRegistration(userId: string): Promise<MunRegistration | undefined> {
    const [registration] = await db.select().from(munRegistrations).where(eq(munRegistrations.userId, userId));
    return registration;
  }

  async createPublication(insertPublication: InsertPublication): Promise<Publication> {
    const [publication] = await db.insert(publications).values(insertPublication).returning();
    return publication;
  }

  async getPublications(): Promise<Publication[]> {
    return await db.select().from(publications).where(eq(publications.isActive, true)).orderBy(desc(publications.publishDate));
  }

  async getPublicationById(id: number): Promise<Publication | undefined> {
    const [publication] = await db.select().from(publications).where(eq(publications.id, id));
    return publication;
  }

  async updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined> {
    const [updatedPublication] = await db.update(publications).set(updates).where(eq(publications.id, id)).returning();
    return updatedPublication;
  }

  async deletePublication(id: number): Promise<boolean> {
    const result = await db.delete(publications).where(eq(publications.id, id)).returning();
    return result.length > 0;
  }

  async incrementPublicationViews(id: number): Promise<void> {
    const publication = await this.getPublicationById(id);
    if (publication) {
      await db
        .update(publications)
        .set({ views: (publication.views || 0) + 1 })
        .where(eq(publications.id, id));
    }
  }

  async incrementPublicationDownloads(id: number): Promise<void> {
    const publication = await this.getPublicationById(id);
    if (publication) {
      await db
        .update(publications)
        .set({ downloads: (publication.downloads || 0) + 1 })
        .where(eq(publications.id, id));
    }
  }

  async incrementPublicationLikes(id: number): Promise<void> {
    const publication = await this.getPublicationById(id);
    if (publication) {
      await db
        .update(publications)
        .set({ likes: (publication.likes || 0) + 1 })
        .where(eq(publications.id, id));
    }
  }
}

export const storage = new DatabaseStorage();