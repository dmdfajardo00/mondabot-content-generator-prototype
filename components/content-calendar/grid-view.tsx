'use client'

import { useState } from 'react'
import { Post } from '@/types/post'
import { PostCard } from './post-card'
import { PostDetailModal } from './post-detail-modal'
import { EmptyState } from './empty-state'
import { SingleCardSkeleton } from './single-card-skeleton'
import { cn } from '@/lib/utils'

interface GridViewProps {
  posts: Post[]
  isLoading?: boolean
  isGenerating?: boolean
  onCreatePost?: () => void
  onDeletePost?: (post: Post) => void
  onViewPost?: (post: Post) => void
  onUpdatePost?: (post: Post) => void
  className?: string
}

export function GridView({
  posts,
  isLoading = false,
  isGenerating = false,
  onCreatePost,
  onDeletePost,
  onViewPost,
  onUpdatePost,
  className
}: GridViewProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (post: Post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const handleModalSave = (updatedPost: Post) => {
    onUpdatePost?.(updatedPost)
  }
  if (!isLoading && posts.length === 0 && !isGenerating) {
    return (
      <EmptyState
        title="No posts found"
        description="Start creating content for your restaurant's social media presence"
        action={onCreatePost}
        actionLabel="Create Your First Post"
        view="grid"
      />
    )
  }

  return (
    <div className={cn(
      'overflow-y-auto h-full p-6',
      className
    )}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            view="grid"
            onDelete={onDeletePost}
            onView={() => handleCardClick(post)}
            className="transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          />
        ))}
        {/* Show single skeleton card when generating new content */}
        {isGenerating && (
          <SingleCardSkeleton className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500" />
        )}
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedPost(null)
        }}
        onSave={handleModalSave}
      />
    </div>
  )
}