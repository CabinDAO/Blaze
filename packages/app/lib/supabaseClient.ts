import { createClient } from '@supabase/supabase-js';


const supabaseId = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabase = createClient(supabaseUrl, supabaseId, {
    schema: 'public',
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    headers: {
        apikey: supabaseId,
        authorization: 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_KEY,
    }
});
export default supabase;