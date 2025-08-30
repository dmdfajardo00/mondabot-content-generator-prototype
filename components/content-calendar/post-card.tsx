'use client'

import { Post } from '@/types/post'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MoreHorizontal, 
  Calendar, 
  Eye,
  Trash2,
  Tag,
  Share2
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
      'border-gray-300 hover:shadow-md transition-shadow duration-200',
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

        {/* Tags and Platforms - Only show in grid/kanban view */}
        {!isCompact && (
          <div className="space-y-2">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5 bg-gray-100 text-gray-600"
                    >
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Platforms */}
            {post.platforms && post.platforms.length > 0 && (
              <div className="flex items-center gap-2">
                <Share2 className="h-3 w-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {post.platforms.map((platform) => (
                    <Badge
                      key={platform}
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-0 h-5 border",
                        platform === 'Facebook' && "border-blue-500 text-blue-600 bg-blue-50",
                        platform === 'Instagram' && "border-pink-500 text-pink-600 bg-pink-50",
                        platform === 'LinkedIn' && "border-blue-700 text-blue-700 bg-blue-50",
                        platform === 'YouTube' && "border-red-500 text-red-600 bg-red-50"
                      )}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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