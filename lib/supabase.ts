import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🔧 Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Event = {
  id: string
  code: string
  name: string
  description: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  cover_image: string | null
  created_by: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export type Upload = {
  id: string
  event_id: string
  uploaded_by: string
  file_type: 'photo' | 'video'
  file_url: string
  thumbnail_url: string | null
  file_size: number | null
  width: number | null
  height: number | null
  duration: number | null
  ai_tags: any
  metadata: any
  download_count: number
  revenue_earned: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export type Download = {
  id: string
  upload_id: string
  downloaded_by: string
  payment_id: string | null
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
