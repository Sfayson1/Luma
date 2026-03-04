import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use placeholder values when Supabase is not configured.
// Supabase-dependent features (comments, community, avatar storage) will
// silently return empty data. Auth and journal entries use FastAPI instead.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: false,
    autoRefreshToken: false,
  }
});
