import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types to match the actual content_dashboard table schema
export interface DbPost {
  content_id: string
  content_title: string
  posting_date: string
  content_description: string | null
  social_media_text: string
  thumbnail_url: string | null
  tags: string[]
  platforms: string[]
  created_at: string
  updated_at: string
}

// Note: hashtags and status are derived fields, not stored in database
// - hashtags: extracted from social_media_text
// - status: derived from posting_date (past = Published, future = Scheduled)