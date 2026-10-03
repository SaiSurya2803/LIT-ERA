import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://vtipokmzlxoautwqseka.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aXBva216bHhvYXV0d3FzZWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzQ2MTYsImV4cCI6MjEwNjYxMDYxNn0.6A73dd-rs6Tpzp2WefoSz_GoIIiSi_NC2X-uPRj8qTU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
