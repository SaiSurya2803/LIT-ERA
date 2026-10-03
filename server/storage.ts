import { supabase } from "./db";
import type { 
  User, InsertUser, 
  ContactSubmission, InsertContact,
  Event, InsertEvent,
  Content, InsertContent,
  Submission, InsertSubmission,
  EventRegistration, InsertEventRegistration,
  Publication, InsertPublication 
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
  createContent(content: InsertContent): Promise<Content>;
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
  createPublication(publication: InsertPublication): Promise<Publication>;
  getPublications(): Promise<Publication[]>;
  getPublicationById(id: number): Promise<Publication | undefined>;
  incrementPublicationViews(id: number): Promise<void>;
  incrementPublicationDownloads(id: number): Promise<void>;
  incrementPublicationLikes(id: number): Promise<void>;
  updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<boolean>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data } = await supabase.from('users').select().eq('id', id).single();
    if (!data) return undefined;
    return { ...data, passwordHash: data.password_hash } as User;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data } = await supabase.from('users').select().eq('email', email).single();
    if (!data) return undefined;
    return { ...data, passwordHash: data.password_hash } as User;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const { data } = await supabase.from('users').insert({ ...insertUser, password_hash: insertUser.passwordHash, id }).select().single();
    return { ...data, passwordHash: data.password_hash } as User;
  }
  async getAllUsers(): Promise<User[]> {
    const { data } = await supabase.from('users').select();
    return data || [];
  }

  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const { data } = await supabase.from('contact_submissions').insert(contact).select().single();
    return data as ContactSubmission;
  }
  async getContacts(): Promise<ContactSubmission[]> {
    const { data } = await supabase.from('contact_submissions').select().order('id', { ascending: false });
    return data || [];
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const { data } = await supabase.from('events').insert(event).select().single();
    return data as Event;
  }
  async getEvents(): Promise<Event[]> {
    const { data } = await supabase.from('events').select().order('id', { ascending: false });
    return data || [];
  }

  async createContent(contentItem: InsertContent): Promise<Content> {
    const { data } = await supabase.from('content').insert(contentItem).select().single();
    return data as Content;
  }
  async getContent(): Promise<Content[]> {
    const { data } = await supabase.from('content').select().order('id', { ascending: false });
    return data || [];
  }
  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const { data } = await supabase.from('content').update(updates).eq('id', id).select().single();
    return data || undefined;
  }
  async deleteContent(id: number): Promise<boolean> {
    const { data } = await supabase.from('content').delete().eq('id', id).select();
    return (data && data.length > 0) ? true : false;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const { data } = await supabase.from('submissions').insert(submission).select().single();
    return data as Submission;
  }
  async getSubmissions(): Promise<Submission[]> {
    const { data } = await supabase.from('submissions').select().order('id', { ascending: false });
    return data || [];
  }
  async getSubmissionById(id: number): Promise<Submission | undefined> {
    const { data } = await supabase.from('submissions').select().eq('id', id).single();
    return data || undefined;
  }
  async updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined> {
    const { data } = await supabase.from('submissions').update({ status }).eq('id', id).select().single();
    return data || undefined;
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const { data } = await supabase.from('event_registrations').insert(registration).select().single();
    return data as EventRegistration;
  }
  async getEventRegistrations(userId: string): Promise<EventRegistration[]> {
    const { data } = await supabase.from('event_registrations').select().eq('user_id', userId);
    return data || [];
  }
  async getAllEventRegistrations(): Promise<EventRegistration[]> {
    const { data } = await supabase.from('event_registrations').select().order('id', { ascending: false });
    return data || [];
  }
  async checkEventRegistration(userId: string, eventId: number): Promise<EventRegistration | undefined> {
    const { data } = await supabase.from('event_registrations').select().eq('user_id', userId).eq('event_id', eventId).single();
    return data || undefined;
  }

  async createPublication(publication: InsertPublication): Promise<Publication> {
    const { data } = await supabase.from('publications').insert(publication).select().single();
    return data as Publication;
  }
  async getPublications(): Promise<Publication[]> {
    const { data } = await supabase.from('publications').select('*').order('id', { ascending: false });
    if (!data) return [];
    return data.map(pub => ({
      ...pub,
      coverImage: pub.cover_image,
      pdfFile: pub.pdf_file,
      pdfFileName: pub.pdf_file_name,
      pdfData: pub.pdf_data,
      publishDate: pub.publish_date,
      isActive: pub.is_active,
      createdAt: pub.created_at ? new Date(pub.created_at) : null,
    })) as Publication[];
  }
  async getPublicationById(id: number): Promise<Publication | undefined> {
    const { data } = await supabase.from('publications').select().eq('id', id).single();
    return data || undefined;
  }
  async incrementPublicationViews(id: number): Promise<void> {
    const { data } = await supabase.from('publications').select('views').eq('id', id).single();
    if (data) await supabase.from('publications').update({ views: (data.views || 0) + 1 }).eq('id', id);
  }
  async incrementPublicationDownloads(id: number): Promise<void> {
    const { data } = await supabase.from('publications').select('downloads').eq('id', id).single();
    if (data) await supabase.from('publications').update({ downloads: (data.downloads || 0) + 1 }).eq('id', id);
  }
  async incrementPublicationLikes(id: number): Promise<void> {
    const { data } = await supabase.from('publications').select('likes').eq('id', id).single();
    if (data) await supabase.from('publications').update({ likes: (data.likes || 0) + 1 }).eq('id', id);
  }
  async updatePublication(id: number, updates: Partial<InsertPublication>): Promise<Publication | undefined> {
    const { data } = await supabase.from('publications').update(updates).eq('id', id).select().single();
    return data || undefined;
  }
  async deletePublication(id: number): Promise<boolean> {
    const { data } = await supabase.from('publications').delete().eq('id', id).select();
    return (data && data.length > 0) ? true : false;
  }
}

export const storage = new SupabaseStorage();