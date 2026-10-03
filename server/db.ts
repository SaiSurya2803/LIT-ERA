import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vtipokmzlxoautwqseka.supabase.co";
// Using anon key with RLS disabled on tables
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aXBva216bHhvYXV0d3FzZWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzQ2MTYsImV4cCI6MjEwNjYxMDYxNn0.6A73dd-rs6Tpzp2WefoSz_GoIIiSi_NC2X-uPRj8qTU";

export const supabase = createClient(supabaseUrl, supabaseKey);
