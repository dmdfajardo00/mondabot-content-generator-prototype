'use client'

import { useState, useEffect } from 'react'
import { Post, ViewMode } from '@/types/post'
import { mockPosts } from '@/lib/mock-data'
import { ViewControls } from '@/components/content-calendar/view-controls'
import { GridView } from '@/components/content-calendar/grid-view'
import { CalendarView } from '@/components/content-calendar/calendar-view'
import { KanbanView } from '@/components/content-calendar/kanban-view'
import { LoadingSkeleton } from '@/components/content-calendar/loading-skeleton'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>('grid')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view)
  }


  const handleEditPost = (post: Post) => {
    console.log('Edit post:', post)
    // In a real app, this would open an edit modal or navigate to edit page
  }

  const handleDeletePost = (post: Post) => {
    console.log('Delete post:', post)
    // In a real app, this would show a confirmation dialog and delete the post
    setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id))
  }

  const handleViewPost = (post: Post) => {
    console.log('View post:', post)
    // In a real app, this would open a detailed view modal
  }

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    )
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

  const handleGenerate = () => {
    console.log('Generate content')
    setIsGenerating(true)
    
    // Simulate content generation with 2-second delay
    setTimeout(() => {
      setIsGenerating(false)
      // In a real app, this would add new generated content to the posts
      console.log('Content generation complete')
    }, 2000)
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
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onViewPost={handleViewPost}
              />
            )}
            
            {currentView === 'calendar' && (
              <CalendarView
                posts={posts}
                isLoading={isLoading}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onViewPost={handleViewPost}
                onUpdatePost={handleUpdatePost}
              />
            )}
            
            {currentView === 'kanban' && (
              <KanbanView
                posts={posts}
                isLoading={isLoading}
                onEditPost={handleEditPost}
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
