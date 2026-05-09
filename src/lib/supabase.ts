import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseInstance = null;
try {
  if (supabaseConfigured) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error("Errore critico inizializzazione Supabase:", err);
}

export const supabase = supabaseInstance;
