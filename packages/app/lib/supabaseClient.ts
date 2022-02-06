import { createClient } from '@supabase/supabase-js';

const options = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}
const supabaseId = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

const supabase = createClient("https://sragkqfrlnmzcunfyrqc.supabase.co", supabaseId, options)
export default supabase;