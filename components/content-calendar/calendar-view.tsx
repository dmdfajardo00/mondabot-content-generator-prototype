'use client'

import { CalendarViewDnd } from './calendar-view-dnd'
import { Post } from '@/types/post'

interface CalendarViewProps {
  posts: Post[]
  isLoading?: boolean
  onCreatePost?: () => void
  onEditPost?: (post: Post) => void
  onDeletePost?: (post: Post) => void
  onViewPost?: (post: Post) => void
  onUpdatePost?: (post: Post) => void
  className?: string
}

export function CalendarView({
  posts,
  isLoading = false,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onViewPost,
  onUpdatePost,
  className
}: CalendarViewProps) {
  const handleUpdatePost = (post: Post) => {
    onUpdatePost?.(post)
  }

  return (
    <CalendarViewDnd
      posts={posts}
      onUpdatePost={handleUpdatePost}
      onEditPost={onEditPost}
      onDeletePost={onDeletePost}
      isLoading={isLoading}
      className={className}
    />
  )
}