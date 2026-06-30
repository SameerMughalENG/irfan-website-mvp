import { createClient } from '@supabase/supabase-js';

// Fallback to public anon project config if Vercel environment variables are omitted during build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://upbnzmlyuvkkhdcaykly.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYm56bWx5dXZra2hkY2F5a2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDE3NjQsImV4cCI6MjA5ODMxNzc2NH0.MTp0tPnvNjByR40YREK_TOUxlgHofW8xOtrheeNNqOQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
