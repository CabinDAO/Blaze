import { createClient } from '@supabase/supabase-js';

const options = {
  schema: 'public',
  headers: { 'x-my-custom-header': 'dao-camp' },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}
const supabase = createClient("https://sragkqfrlnmzcunfyrqc.supabase.co", process.env.NEXT_PUBLIC_SUPABASE_KEY, options)