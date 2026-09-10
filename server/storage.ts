import { db } from "./db";
import {
  users, contactSubmissions, events, gameScores, puzzles,
  content, submissions, eventRegistrations, munRegistrations, publications,
  type User, type InsertUser,
  type ContactSubmission, type InsertContact,
  type Event, type InsertEvent,
  type GameScore, type InsertGameScore,
  type Puzzle, type InsertPuzzle,
  type Content, type InsertContent,
  type Submission, type InsertSubmission,
  type EventRegistration, type InsertEventRegistration,
  type MunRegistration, type InsertMunRegistration,
  type Publication, type InsertPublication,
} from "../shared/schema";
import { eq, desc, and } from "drizzle-orm";
import crypto from "crypto";

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

  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(): Promise<Submission[]>;
  getSubmissionById(id: number): Promise<Submission | undefined>;
  updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined>;

  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistrations(userId: string): Promise<EventRegistration[]>;
  getAllEventRegistrations(): Promise<EventRegistration[]>;
  checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined>;

  createMunRegistration(registration: InsertMunRegistration): Promise<MunRegistration>;
  getMunRegistrations(): Promise<MunRegistration[]>;
  checkMunRegistration(userId: string): Promise<MunRegistration | undefined>;

  createPublication(publication: InsertPublication): Promise<Publication>;
  getPublications(): Promise<Publication[]>;
  getPublicationById(id: number): Promise<Publication | undefined>;
  incrementPublicationViews(id: number): Promise<void>;
  incrementPublicationDownloads(id: number): Promise<void>;
  incrementPublicationLikes(id: number): Promise<void>;
  updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<boolean>;
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
    const id = crypto.randomUUID();
    const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
    return user;
  }
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const [c] = await db.insert(contactSubmissions).values(contact).returning();
    return c;
  }
  async getContacts(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.id));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [e] = await db.insert(events).values(event).returning();
    return e;
  }
  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.id));
  }

  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const [s] = await db.insert(gameScores).values(score).returning();
    return s;
  }
  async getGameScores(): Promise<GameScore[]> {
    return db.select().from(gameScores).orderBy(desc(gameScores.score));
  }

  async createPuzzle(puzzle: InsertPuzzle): Promise<Puzzle> {
    const [p] = await db.insert(puzzles).values(puzzle).returning();
    return p;
  }
  async getPuzzles(): Promise<Puzzle[]> {
    return db.select().from(puzzles);
  }
  async getDailyPuzzle(type: string, date: string): Promise<Puzzle | undefined> {
    const [p] = await db.select().from(puzzles)
      .where(and(eq(puzzles.type, type), eq(puzzles.publishDate, date)));
    return p;
  }
  async deletePuzzlesByType(type: string): Promise<number> {
    const deleted = await db.delete(puzzles).where(eq(puzzles.type, type)).returning();
    return deleted.length;
  }
  async deleteGameScoresByType(gameType: string): Promise<number> {
    const deleted = await db.delete(gameScores).where(eq(gameScores.gameType, gameType)).returning();
    return deleted.length;
  }

  async createContent(contentItem: InsertContent): Promise<Content> {
    const [c] = await db.insert(content).values(contentItem).returning();
    return c;
  }
  async getContent(): Promise<Content[]> {
    return db.select().from(content).orderBy(desc(content.id));
  }
  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const [c] = await db.update(content).set(updates).where(eq(content.id, id)).returning();
    return c;
  }
  async deleteContent(id: number): Promise<boolean> {
    const deleted = await db.delete(content).where(eq(content.id, id)).returning({ id: content.id });
    return deleted.length > 0;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [s] = await db.insert(submissions).values(submission).returning();
    return s;
  }
  async getSubmissions(): Promise<Submission[]> {
    return db.select().from(submissions).orderBy(desc(submissions.id));
  }
  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const [s] = await db.select().from(submissions).where(eq(submissions.id, id));
    return s;
  }
  async updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined> {
    const [s] = await db.update(submissions).set({ status }).where(eq(submissions.id, id)).returning();
    return s;
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [r] = await db.insert(eventRegistrations).values(registration).returning();
    return r;
  }
  async getEventRegistrations(userId: string): Promise<EventRegistration[]> {
    return db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId));
  }
  async getAllEventRegistrations(): Promise<EventRegistration[]> {
    return db.select().from(eventRegistrations).orderBy(desc(eventRegistrations.id));
  }
  async checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined> {
    const [r] = await db.select().from(eventRegistrations)
      .where(and(eq(eventRegistrations.userId, userId), eq(eventRegistrations.eventId, eventId)));
    return r;
  }

  async createMunRegistration(registration: InsertMunRegistration): Promise<MunRegistration> {
    const [r] = await db.insert(munRegistrations).values(registration).returning();
    return r;
  }
  async getMunRegistrations(): Promise<MunRegistration[]> {
    return db.select().from(munRegistrations).orderBy(desc(munRegistrations.id));
  }
  async checkMunRegistration(userId: string): Promise<MunRegistration | undefined> {
    const [r] = await db.select().from(munRegistrations).where(eq(munRegistrations.userId, userId));
    return r;
  }

  async createPublication(publication: InsertPublication): Promise<Publication> {
    const [p] = await db.insert(publications).values(publication).returning();
    return p;
  }
  async getPublications(): Promise<Publication[]> {
    // Exclude pdfData from list to avoid huge payloads - only fetch on individual download
    const rows = await db.select({
      id: publications.id,
      title: publications.title,
      category: publications.category,
      author: publications.author,
      description: publications.description,
      coverImage: publications.coverImage,
      pdfFile: publications.pdfFile,
      pdfFileName: publications.pdfFileName,
      pdfData: publications.pdfData,
      pages: publications.pages,
      publishDate: publications.publishDate,
      featured: publications.featured,
      views: publications.views,
      downloads: publications.downloads,
      likes: publications.likes,
      isActive: publications.isActive,
      createdAt: publications.createdAt,
    }).from(publications).orderBy(desc(publications.id));
    // Strip pdfData from response to keep payload small
    return rows.map(r => ({ ...r, pdfData: null }));
  }
  async getPublicationById(id: number): Promise<Publication | undefined> {
    const [p] = await db.select().from(publications).where(eq(publications.id, id));
    return p;
  }
  async incrementPublicationViews(id: number): Promise<void> {
    const [pub] = await db.select({ views: publications.views }).from(publications).where(eq(publications.id, id));
    if (pub) await db.update(publications).set({ views: (pub.views || 0) + 1 }).where(eq(publications.id, id));
  }
  async incrementPublicationDownloads(id: number): Promise<void> {
    const [pub] = await db.select({ downloads: publications.downloads }).from(publications).where(eq(publications.id, id));
    if (pub) await db.update(publications).set({ downloads: (pub.downloads || 0) + 1 }).where(eq(publications.id, id));
  }
  async incrementPublicationLikes(id: number): Promise<void> {
    const [pub] = await db.select({ likes: publications.likes }).from(publications).where(eq(publications.id, id));
    if (pub) await db.update(publications).set({ likes: (pub.likes || 0) + 1 }).where(eq(publications.id, id));
  }
  async updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined> {
    const [p] = await db.update(publications).set(updates).where(eq(publications.id, id)).returning();
    return p;
  }
  async deletePublication(id: number): Promise<boolean> {
    const deleted = await db.delete(publications).where(eq(publications.id, id)).returning({ id: publications.id });
    return deleted.length > 0;
  }
}

export const storage = new DatabaseStorage();