import { supabase } from "./db";
import {
  type User, type InsertUser,
  type ContactSubmission, type InsertContact,
  type Event, type InsertEvent,
  type GameScore, type InsertGameScore,
  type Puzzle, type InsertPuzzle,
  type Content, type InsertContent,
  type Submission, type InsertSubmission,
  type EventRegistration, type InsertEventRegistration,
  type MunRegistration, type InsertMunRegistration,
  type Publication, type InsertPublication
} from "../shared/schema";
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
  incrementPublicationViews(id: number): Promise<void>;
  incrementPublicationDownloads(id: number): Promise<void>;
  incrementPublicationLikes(id: number): Promise<void>;
  updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<boolean>;
}

import { mapToCamelCase, mapToSnakeCase } from "./utils";

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data } = await supabase.from("users").select("*").eq("id", id).single();
    return data ? mapToCamelCase<User>(data) : undefined;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await supabase.from("users").select("*").eq("email", email).single();
    return data ? mapToCamelCase<User>(data) : undefined;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const snakeData = mapToSnakeCase({ ...insertUser, id });
    const { data, error } = await supabase.from("users").insert([snakeData]).select().single();
    if (error) throw error;
    return mapToCamelCase<User>(data);
  }
  async getAllUsers(): Promise<User[]> {
    const { data } = await supabase.from("users").select("*");
    return data ? mapToCamelCase<User[]>(data) : [];
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const { data, error } = await supabase.from("contact_submissions").insert([mapToSnakeCase(contact)]).select().single();
    if (error) throw error;
    return mapToCamelCase<ContactSubmission>(data);
  }
  async getContacts(): Promise<ContactSubmission[]> {
    const { data } = await supabase.from("contact_submissions").select("*").order("id", { ascending: false });
    return data ? mapToCamelCase<ContactSubmission[]>(data) : [];
  }

  // Events
  async createEvent(event: InsertEvent): Promise<Event> {
    const { data, error } = await supabase.from("events").insert([mapToSnakeCase(event)]).select().single();
    if (error) throw error;
    return mapToCamelCase<Event>(data);
  }
  async getEvents(): Promise<Event[]> {
    const { data } = await supabase.from("events").select("*").order("id", { ascending: false });
    return data ? mapToCamelCase<Event[]>(data) : [];
  }

  // Game Scores
  async createGameScore(score: InsertGameScore): Promise<GameScore> {
    const { data, error } = await supabase.from("game_scores").insert([mapToSnakeCase(score)]).select().single();
    if (error) throw error;
    return mapToCamelCase<GameScore>(data);
  }
  async getGameScores(): Promise<GameScore[]> {
    const { data } = await supabase.from("game_scores").select("*").order("score", { ascending: false });
    return data ? mapToCamelCase<GameScore[]>(data) : [];
  }

  // Puzzles
  async createPuzzle(puzzle: InsertPuzzle): Promise<Puzzle> {
    const { data, error } = await supabase.from("puzzles").insert([mapToSnakeCase(puzzle)]).select().single();
    if (error) throw error;
    return mapToCamelCase<Puzzle>(data);
  }
  async getPuzzles(): Promise<Puzzle[]> {
    const { data } = await supabase.from("puzzles").select("*");
    return data ? mapToCamelCase<Puzzle[]>(data) : [];
  }
  async getDailyPuzzle(type: string, date: string): Promise<Puzzle | undefined> {
    const { data } = await supabase.from("puzzles").select("*").eq("type", type).eq("publish_date", date).single();
    return data ? mapToCamelCase<Puzzle>(data) : undefined;
  }
  async deletePuzzlesByType(type: string): Promise<number> {
    const { data, error } = await supabase.from("puzzles").delete().eq("type", type).select();
    if (error) throw error;
    return data?.length || 0;
  }
  async deleteGameScoresByType(gameType: string): Promise<number> {
    const { data, error } = await supabase.from("game_scores").delete().eq("game_type", gameType).select();
    if (error) throw error;
    return data?.length || 0;
  }

  // Content
  async createContent(contentItem: InsertContent): Promise<Content> {
    const { data, error } = await supabase.from("content").insert([mapToSnakeCase(contentItem)]).select().single();
    if (error) throw error;
    return mapToCamelCase<Content>(data);
  }
  async getContent(): Promise<Content[]> {
    const { data } = await supabase.from("content").select("*").order("id", { ascending: false });
    return data ? mapToCamelCase<Content[]>(data) : [];
  }
  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const { data, error } = await supabase.from("content").update(mapToSnakeCase(updates)).eq("id", id).select().single();
    if (error) throw error;
    return data ? mapToCamelCase<Content>(data) : undefined;
  }
  async deleteContent(id: number): Promise<boolean> {
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // Submissions
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const { data, error } = await supabase.from("submissions").insert([mapToSnakeCase(submission)]).select().single();
    if (error) throw error;
    return mapToCamelCase<Submission>(data);
  }
  async getSubmissions(): Promise<Submission[]> {
    const { data } = await supabase.from("submissions").select("*").order("id", { ascending: false });
    return data ? mapToCamelCase<Submission[]>(data) : [];
  }
  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const { data } = await supabase.from("submissions").select("*").eq("id", id).single();
    return data ? mapToCamelCase<Submission>(data) : undefined;
  }

  // Event Registrations
  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const { data, error } = await supabase.from("event_registrations").insert([mapToSnakeCase(registration)]).select().single();
    if (error) throw error;
    return mapToCamelCase<EventRegistration>(data);
  }
  async getEventRegistrations(userId: string): Promise<EventRegistration[]> {
    const { data } = await supabase.from("event_registrations").select("*").eq("user_id", userId);
    return data ? mapToCamelCase<EventRegistration[]>(data) : [];
  }
  async checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined> {
    const { data } = await supabase.from("event_registrations").select("*").eq("user_id", userId).eq("event_id", eventId).single();
    return data ? mapToCamelCase<EventRegistration>(data) : undefined;
  }

  // MUN Registrations
  async createMunRegistration(registration: InsertMunRegistration): Promise<MunRegistration> {
    const { data, error } = await supabase.from("mun_registrations").insert([mapToSnakeCase(registration)]).select().single();
    if (error) throw error;
    return mapToCamelCase<MunRegistration>(data);
  }
  async getMunRegistrations(): Promise<MunRegistration[]> {
    const { data } = await supabase.from("mun_registrations").select("*").order("id", { ascending: false });
    return data ? mapToCamelCase<MunRegistration[]>(data) : [];
  }
  async checkMunRegistration(userId: string): Promise<MunRegistration | undefined> {
    const { data } = await supabase.from("mun_registrations").select("*").eq("user_id", userId).single();
    return data ? mapToCamelCase<MunRegistration>(data) : undefined;
  }

  // Publications
  async createPublication(publication: InsertPublication): Promise<Publication> {
    const { data, error } = await supabase.from("publications").insert([mapToSnakeCase(publication)]).select().single();
    if (error) throw error;
    return mapToCamelCase<Publication>(data);
  }
  async getPublications(): Promise<Publication[]> {
    // IMPORTANT: Exclude pdf_data to avoid Vercel 4.5MB payload limit!
    const { data } = await supabase.from("publications").select("id, title, category, author, description, cover_image, pdf_file, pdf_file_name, pages, publish_date, featured, views, downloads, likes, is_active, created_at").order("id", { ascending: false });
    return data ? mapToCamelCase<Publication[]>(data) : [];
  }
  async getPublicationById(id: number): Promise<Publication | undefined> {
    const { data } = await supabase.from("publications").select("*").eq("id", id).single();
    return data ? mapToCamelCase<Publication>(data) : undefined;
  }
  async incrementPublicationViews(id: number): Promise<void> {
    const pub = await this.getPublicationById(id);
    if (pub) {
      await supabase.from("publications").update({ views: (pub.views || 0) + 1 }).eq("id", id);
    }
  }
  async incrementPublicationDownloads(id: number): Promise<void> {
    const pub = await this.getPublicationById(id);
    if (pub) {
      await supabase.from("publications").update({ downloads: (pub.downloads || 0) + 1 }).eq("id", id);
    }
  }
  async incrementPublicationLikes(id: number): Promise<void> {
    const pub = await this.getPublicationById(id);
    if (pub) {
      await supabase.from("publications").update({ likes: (pub.likes || 0) + 1 }).eq("id", id);
    }
  }
  async updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined> {
    const { data, error } = await supabase.from("publications").update(mapToSnakeCase(updates)).eq("id", id).select().single();
    if (error) throw error;
    return data ? mapToCamelCase<Publication>(data) : undefined;
  }
  async deletePublication(id: number): Promise<boolean> {
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const storage = new SupabaseStorage();