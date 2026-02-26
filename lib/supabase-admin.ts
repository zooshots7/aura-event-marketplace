import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client with service role key — bypasses RLS.
// NEVER import this file from client-side code.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
})
