import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  date,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  club: text("club").default("LIT'ERA"),
  isAdmin: boolean("is_admin").default(false),
  joinDate: timestamp("join_date").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  country: text("country"),
  reason: text("reason"),
  message: text("message").notNull(),
  submissionDate: timestamp("submission_date").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventDate: date("event_date"),
  isActive: boolean("is_active").default(true),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  gameType: text("game_type").notNull(), // 'strands' or 'spellbee'
  score: integer("score"),
  completionTime: integer("completion_time"),
  completedDate: timestamp("completed_date").defaultNow(),
}, (table) => ({
  gameTypeIdx: index("game_scores_game_type_idx").on(table.gameType),
  userIdIdx: index("game_scores_user_id_idx").on(table.userId),
}));

export const puzzles = pgTable("puzzles", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'strands' or 'spellbee'
  data: text("data").notNull(), // JSON stringified puzzle data
  publishDate: date("publish_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Composite index for fast daily puzzle lookup
  typeDateIdx: index("puzzles_type_date_idx").on(table.type, table.publishDate),
  publishDateIdx: index("puzzles_publish_date_idx").on(table.publishDate),
}));

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'thought', 'riddle', 'quote', 'fact', 'poem'
  title: text("title").notNull(),
  content: text("content").notNull(),
  answer: text("answer"), // for riddles
  author: text("author").notNull(),
  date: date("date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  originalFileName: text("original_file_name"),
  filePath: text("file_path"),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  eventId: integer("event_id").notNull(),
  eventTitle: text("event_title").notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const munRegistrations = pgTable("mun_registrations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  committee: text("committee").notNull(),
  experience: text("experience"),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinDate: true,
});
export const insertContactSchema = createInsertSchema(contactSubmissions).omit({ id: true, submissionDate: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertGameScoreSchema = createInsertSchema(gameScores).omit({ id: true, completedDate: true });
export const insertPuzzleSchema = createInsertSchema(puzzles).omit({ id: true, createdAt: true });
export const insertContentSchema = createInsertSchema(content).omit({ 
  id: true, 
  createdAt: true 
}).extend({
  isActive: z.boolean().optional().default(true),
  answer: z.string().nullable().optional(),
});
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, submittedAt: true });
export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({ id: true, registeredAt: true });
export const insertMunRegistrationSchema = createInsertSchema(munRegistrations).omit({ id: true, registeredAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type Puzzle = typeof puzzles.$inferSelect;
export type InsertPuzzle = z.infer<typeof insertPuzzleSchema>;
export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type MunRegistration = typeof munRegistrations.$inferSelect;
export type InsertMunRegistration = z.infer<typeof insertMunRegistrationSchema>;
