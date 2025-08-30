'use client'

import { Post } from '@/types/post'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MoreHorizontal, 
  Calendar, 
  Eye,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PostCardProps {
  post: Post
  view?: 'grid' | 'calendar' | 'kanban'
  className?: string
  onDelete?: (post: Post) => void
  onView?: (post: Post) => void
}

export function PostCard({ 
  post, 
  view = 'grid', 
  className,
  onDelete,
  onView
}: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isCompact = view === 'calendar'

  return (
    <Card className={cn(
      'border-gray-200 hover:shadow-md transition-shadow duration-200',
      isCompact && 'p-2',
      className
    )}>
      {!isCompact && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatDate(post.date)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={cn('space-y-3', isCompact && 'p-0 space-y-2')}>
        {/* Post Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={post.imageUrl}
            alt="Post content"
            fill
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>

        {/* Post Content */}
        <div className="space-y-2">
          <p className={cn(
            'text-gray-900 line-clamp-3',
            isCompact ? 'text-xs' : 'text-sm'
          )}>
            {post.text}
          </p>
          
          {/* Hashtags */}
          <p className={cn(
            'text-gray-500 line-clamp-2',
            isCompact ? 'text-xs' : 'text-sm'
          )}>
            {post.hashtags}
          </p>
        </div>

        {/* Actions */}
        {!isCompact && (
          <div className="flex items-center justify-end space-x-1">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={() => onView(post)}
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-red-600"
                onClick={() => onDelete(post)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Compact view date */}
        {isCompact && (
          <div className="text-xs text-gray-500">
            {formatDate(post.date)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}