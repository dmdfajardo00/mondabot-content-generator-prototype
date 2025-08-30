import { Post, Platform } from '@/types/post'
import { DbPost } from './supabase'

// Helper function to extract hashtags from social media text
function extractHashtagsFromText(text: string): string {
  const hashtags = text.match(/#\w+/g)
  return hashtags ? hashtags.join(' ') : ''
}

// Helper function to determine post status based on date
function derivePostStatus(postingDate: string): Post['status'] {
  const today = new Date()
  const postDate = new Date(postingDate)
  
  if (postDate < today) {
    return 'Published'
  } else {
    return 'Scheduled'
  }
}

// Transform database post to UI Post interface
export function transformDbPostToPost(dbPost: DbPost): Post {
  return {
    id: dbPost.content_id,
    date: dbPost.posting_date,
    title: dbPost.content_title,
    text: dbPost.social_media_text,
    description: dbPost.content_description || '',
    hashtags: extractHashtagsFromText(dbPost.social_media_text), // Always derive from text
    tags: Array.isArray(dbPost.tags) ? dbPost.tags : [],
    platforms: Array.isArray(dbPost.platforms) ? dbPost.platforms as Platform[] : ['Instagram'],
    imageUrl: dbPost.thumbnail_url || '', // Critical: map thumbnail_url to imageUrl
    status: derivePostStatus(dbPost.posting_date) // Always derive from date
  }
}

// Transform UI Post to database format (for create/update operations)
export function transformPostToDbPost(post: Partial<Post>): Partial<Omit<DbPost, 'content_id' | 'created_at' | 'updated_at'>> {
  const dbPost: Partial<Omit<DbPost, 'content_id' | 'created_at' | 'updated_at'>> = {}
  
  // Only include fields that exist in the actual database schema
  if (post.title !== undefined) dbPost.content_title = post.title
  if (post.date !== undefined) dbPost.posting_date = post.date
  if (post.description !== undefined) dbPost.content_description = post.description
  if (post.text !== undefined) dbPost.social_media_text = post.text
  if (post.imageUrl !== undefined) dbPost.thumbnail_url = post.imageUrl // Critical: map imageUrl to thumbnail_url
  if (post.tags !== undefined) dbPost.tags = post.tags
  if (post.platforms !== undefined) dbPost.platforms = post.platforms
  
  // NOTE: hashtags and status columns don't exist in database, so we skip them
  // hashtags are derived from social_media_text in transformDbPostToPost
  // status is derived from posting_date in transformDbPostToPost
  
  return dbPost
}