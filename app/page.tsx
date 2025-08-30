'use client'

import { useState, useEffect } from 'react'
import { Post, ViewMode } from '@/types/post'
import { PostsAPI } from '@/lib/posts-api'
import { ViewControls } from '@/components/content-calendar/view-controls'
import { GridView } from '@/components/content-calendar/grid-view'
import { CalendarView } from '@/components/content-calendar/calendar-view'
import { KanbanView } from '@/components/content-calendar/kanban-view'
import { LoadingSkeleton } from '@/components/content-calendar/loading-skeleton'
import { useRestaurantSettings } from '@/hooks/use-restaurant-settings'
import { toast } from 'sonner'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>('grid')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { settings, isComplete } = useRestaurantSettings()

  // Load posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        
        const posts = await PostsAPI.getAllWithDelay() // Maintains 1-second loading delay
        setPosts(posts)
      } catch (error) {
        console.error('❌ Failed to load posts:', error)
        toast.error('Failed to load posts', {
          description: 'Please try refreshing the page.'
        })
        setPosts([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

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
        const result = await response.json()
        console.log('Content generation response:', result)
        
        toast.success('Content Generated!', {
          description: 'New content has been generated based on your restaurant settings.'
        })
        
        // In a real app, this would add new generated content to the posts
        console.log('Content generation complete')
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Content generation failed:', error)
      toast.error('Generation Failed', {
        description: 'Failed to generate content. Please try again.'
      })
    } finally {
      setIsGenerating(false)
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
        {(isLoading || isGenerating) ? (
          <LoadingSkeleton view={currentView} />
        ) : (
          <>
            {currentView === 'grid' && (
              <GridView
                posts={posts}
                isLoading={isLoading}
                onDeletePost={handleDeletePost}
                onViewPost={handleViewPost}
                onUpdatePost={handleUpdatePost}
              />
            )}
            
            {currentView === 'calendar' && (
              <CalendarView
                posts={posts}
                isLoading={isLoading}
                onDeletePost={handleDeletePost}
                onViewPost={handleViewPost}
                onUpdatePost={handleUpdatePost}
              />
            )}
            
            {currentView === 'kanban' && (
              <KanbanView
                posts={posts}
                isLoading={isLoading}
                onDeletePost={handleDeletePost}
                onViewPost={handleViewPost}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
