import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.SUPABASE_KEY ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Use anon key for client operations (auth, etc.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
