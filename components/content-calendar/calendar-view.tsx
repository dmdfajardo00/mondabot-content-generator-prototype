'use client'

import { CalendarViewDnd } from './calendar-view-dnd'
import { Post } from '@/types/post'

interface CalendarViewProps {
  posts: Post[]
  isLoading?: boolean
  onCreatePost?: () => void
  onDeletePost?: (post: Post) => void
  onViewPost?: (post: Post) => void
  onUpdatePost?: (post: Post) => void
  className?: string
}

export function CalendarView({
  posts,
  isLoading = false,
  onCreatePost,
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
      onDeletePost={onDeletePost}
      isLoading={isLoading}
      className={className}
    />
  )
}