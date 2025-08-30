'use client'

import { useState, useEffect } from 'react'
import { Post, ViewMode } from '@/types/post'
import { PostsAPI } from '@/lib/posts-api'
import { ViewControls } from '@/components/content-calendar/view-controls'
import { GridView } from '@/components/content-calendar/grid-view'
import { CalendarView } from '@/components/content-calendar/calendar-view'
import { KanbanView } from '@/components/content-calendar/kanban-view'
import { LoadingSkeleton } from '@/components/content-calendar/loading-skeleton'
import { useRestaurantSettingsV2 } from '@/hooks/use-restaurant-settings-v2'
import { toast } from 'sonner'

const GENERATION_STORAGE_KEY = 'content_generation_state'
const GENERATION_TIMEOUT = 5 * 60 * 1000 // 5 minutes timeout

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>('grid')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previousPostCount, setPreviousPostCount] = useState(0)
  const { settings, isComplete } = useRestaurantSettingsV2()

  // Load posts from Supabase
  const loadPosts = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setIsLoading(true)
      }
      
      const posts = isAutoRefresh 
        ? await PostsAPI.getAll() // No delay for auto-refresh
        : await PostsAPI.getAllWithDelay() // Maintains 1-second loading delay for initial load
      
      // Check if new posts were added (for generation tracking)
      if (isGenerating && posts.length > previousPostCount) {
        // New posts detected
        console.log('New posts detected:', posts.length - previousPostCount)
        
        // If we've detected a significant number of new posts (e.g., 3 or more),
        // we can assume generation is complete even without webhook response
        if (posts.length - previousPostCount >= 3) {
          console.log('Auto-clearing generation state after detecting new posts')
          setIsGenerating(false)
          localStorage.removeItem(GENERATION_STORAGE_KEY)
          
          toast.success('Content Generated!', {
            description: `${posts.length - previousPostCount} new posts have been added.`
          })
        }
      }
      
      setPreviousPostCount(posts.length)
      setPosts(posts)
    } catch (error) {
      console.error('❌ Failed to load posts:', error)
      if (!isAutoRefresh) {
        toast.error('Failed to load posts', {
          description: 'Please try refreshing the page.'
        })
      }
      setPosts([]) // Set empty array on error
    } finally {
      if (!isAutoRefresh) {
        setIsLoading(false)
      }
    }
  }

  // Check for persisted generation state on mount
  useEffect(() => {
    const checkGenerationState = () => {
      try {
        const stored = localStorage.getItem(GENERATION_STORAGE_KEY)
        if (stored) {
          const { startedAt, postCount } = JSON.parse(stored)
          const elapsed = Date.now() - startedAt
          
          // If generation started less than 5 minutes ago, restore the state
          if (elapsed < GENERATION_TIMEOUT) {
            console.log('Restoring generation state from localStorage')
            setIsGenerating(true)
            setPreviousPostCount(postCount || 0)
          } else {
            // Clean up stale generation state
            console.log('Clearing stale generation state')
            localStorage.removeItem(GENERATION_STORAGE_KEY)
          }
        }
      } catch (error) {
        console.error('Error checking generation state:', error)
        localStorage.removeItem(GENERATION_STORAGE_KEY)
      }
    }
    
    checkGenerationState()
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadPosts(true) // Silent refresh
      
      // Check if generation has been running too long
      if (isGenerating) {
        try {
          const stored = localStorage.getItem(GENERATION_STORAGE_KEY)
          if (stored) {
            const { startedAt } = JSON.parse(stored)
            const elapsed = Date.now() - startedAt
            
            if (elapsed > GENERATION_TIMEOUT) {
              console.log('Generation timeout reached, clearing state')
              setIsGenerating(false)
              localStorage.removeItem(GENERATION_STORAGE_KEY)
              toast.error('Generation Timeout', {
                description: 'Content generation took too long. Please try again.'
              })
            }
          }
        } catch (error) {
          console.error('Error checking generation timeout:', error)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, previousPostCount])

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view)
  }



  const handleDeletePost = async (post: Post) => {
    try {
      // Optimistic update - remove from UI immediately
      setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id))
      
      // Delete from database
      await PostsAPI.delete(post.id)
      
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Failed to delete post:', error)
      // Rollback optimistic update
      setPosts(prevPosts => [...prevPosts, post])
      toast.error('Failed to delete post', {
        description: 'Please try again.'
      })
    }
  }

  const handleViewPost = (post: Post) => {
    console.log('View post:', post)
    // In a real app, this would open a detailed view modal
  }

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      // Optimistic update - update UI immediately
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        )
      )
      
      // Update in database
      await PostsAPI.update(updatedPost.id, updatedPost)
      
      toast.success('Post updated successfully')
    } catch (error) {
      console.error('Failed to update post:', error)
      // Rollback optimistic update - reload data
      try {
        const posts = await PostsAPI.getAll()
        setPosts(posts)
      } catch (reloadError) {
        console.error('Failed to reload posts:', reloadError)
      }
      
      toast.error('Failed to update post', {
        description: 'Please try again.'
      })
    }
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
    // In a real app, this would filter posts based on the search query
  }

  const handleFilter = () => {
    console.log('Filter posts')
    // In a real app, this would open filter options
  }

  const handleSort = () => {
    console.log('Sort posts')
    // In a real app, this would open sort options
  }

  const handleGenerate = async () => {
    console.log('Generate content')
    
    // Check if restaurant settings are complete
    if (!isComplete) {
      toast.error('Incomplete Settings', {
        description: 'Please complete your restaurant settings before generating content.'
      })
      return
    }
    
    setIsGenerating(true)
    setPreviousPostCount(posts.length) // Track current count before generation
    
    // Persist generation state to localStorage
    localStorage.setItem(GENERATION_STORAGE_KEY, JSON.stringify({
      startedAt: Date.now(),
      postCount: posts.length
    }))
    
    try {
      // Send restaurant settings to webhook
      const webhookUrl = 'https://n8n-automations.dmdfajardo.pro/webhook/ef705e79-924e-44ec-86aa-864dcd4b60c2'
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantSettings: settings,
          timestamp: new Date().toISOString(),
          action: 'generate_content'
        })
      })
      
      if (response.ok) {
        const result = await response.text() // Changed to text() to handle "Done" response
        console.log('Content generation response:', result)
        
        if (result === 'Done' || result.includes('Done')) {
          // Generation completed successfully
          setIsGenerating(false)
          
          // Clear persisted generation state
          localStorage.removeItem(GENERATION_STORAGE_KEY)
          
          toast.success('Content Generated!', {
            description: 'New content has been generated and added to your calendar.'
          })
          
          // Force a refresh to get the latest posts
          await loadPosts(true)
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Content generation failed:', error)
      toast.error('Generation Failed', {
        description: 'Failed to generate content. Please try again.'
      })
      setIsGenerating(false)
      
      // Clear persisted generation state on error
      localStorage.removeItem(GENERATION_STORAGE_KEY)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* View Controls */}
      <ViewControls
        currentView={currentView}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-full">
        {isLoading ? (
          <LoadingSkeleton view={currentView} />
        ) : (
          <>
            {currentView === 'grid' && (
              <GridView
                posts={posts}
                isLoading={isLoading}
                isGenerating={isGenerating}
                onDeletePost={handleDeletePost}
                onViewPost={handleViewPost}
                onUpdatePost={handleUpdatePost}
              />
            )}
            
            {currentView === 'calendar' && (
              isGenerating ? (
                <LoadingSkeleton view="calendar" />
              ) : (
                <CalendarView
                  posts={posts}
                  isLoading={isLoading}
                  onDeletePost={handleDeletePost}
                  onViewPost={handleViewPost}
                  onUpdatePost={handleUpdatePost}
                />
              )
            )}
            
            {currentView === 'kanban' && (
              isGenerating ? (
                <LoadingSkeleton view="kanban" />
              ) : (
                <KanbanView
                  posts={posts}
                  isLoading={isLoading}
                  onDeletePost={handleDeletePost}
                  onViewPost={handleViewPost}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
