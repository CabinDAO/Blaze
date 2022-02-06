import { createClient } from '@supabase/supabase-js';


const supabaseId = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

const supabase = createClient("https://sragkqfrlnmzcunfyrqc.supabase.co", supabaseId);
export default supabase;