import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a dummy client if environment variables are missing
// This allows the build to succeed on platforms without env vars
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : null as any

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