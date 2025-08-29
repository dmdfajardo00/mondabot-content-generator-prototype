'use client'

import { Post } from '@/types/post'
import { PostCard } from './post-card'
import { EmptyState } from './empty-state'
import { cn } from '@/lib/utils'

interface GridViewProps {
  posts: Post[]
  isLoading?: boolean
  onCreatePost?: () => void
  onEditPost?: (post: Post) => void
  onDeletePost?: (post: Post) => void
  onViewPost?: (post: Post) => void
  className?: string
}

export function GridView({
  posts,
  isLoading = false,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onViewPost,
  className
}: GridViewProps) {
  if (!isLoading && posts.length === 0) {
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
            onEdit={onEditPost}
            onDelete={onDeletePost}
            onView={onViewPost}
            className="transition-all duration-200 hover:scale-[1.02]"
          />
        ))}
      </div>
    </div>
  )
}