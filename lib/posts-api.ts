import { Post } from '@/types/post'
import { supabase, DbPost } from './supabase'
import { transformDbPostToPost, transformPostToDbPost } from './data-mapper'

export class PostsAPI {
  // Get all posts - now uses API route with service role
  static async getAll(): Promise<Post[]> {
    try {
      console.log('📡 Fetching posts from API...')
      
      const response = await fetch('/api/posts')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${errorData.error || response.statusText}`)
      }
      
      const posts = await response.json()
      console.log('✅ Posts from API:', posts)
      
      return posts
    } catch (error) {
      console.error('❌ Error fetching posts:', error)
      throw error
    }
  }

  // Create a new post
  static async create(post: Omit<Post, 'id'>): Promise<Post> {
    try {
      const dbPost = transformPostToDbPost(post)
      
      const { data, error } = await supabase
        .from('content_dashboard')
        .insert(dbPost)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Failed to create post: ${error.message}`)
      }
      
      return transformDbPostToPost(data as DbPost)
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // Update an existing post
  static async update(id: string, updates: Partial<Post>): Promise<Post> {
    try {
      const dbUpdates = transformPostToDbPost(updates)
      
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...dbUpdates })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${errorData.error || response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  // Delete a post
  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  // Simulate the current loading delay to maintain exact same UI behavior
  static async getAllWithDelay(): Promise<Post[]> {
    // Add 1 second delay to match current mock data loading behavior
    await new Promise(resolve => setTimeout(resolve, 1000))
    return this.getAll()
  }
}