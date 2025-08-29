'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Post } from '@/types/post'
import { cn } from '@/lib/utils'

interface DraggablePostCardProps {
  post: Post
  onClick: () => void
  onEdit?: (post: Post) => void
  onDelete?: (post: Post) => void
  isDragging?: boolean
}

export function DraggablePostCard({
  post,
  onClick,
  onEdit,
  onDelete,
  isDragging = false
}: DraggablePostCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dndIsDragging,
  } = useDraggable({
    id: post.id,
    data: {
      type: 'post',
      post,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(post)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(post)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'relative group',
        dndIsDragging && 'z-50'
      )}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={dndIsDragging ? { 
        rotate: 3,
        scale: 1.05,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      } : {}}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md border-l-4',
          post.status === 'Scheduled' && 'border-l-blue-500',
          post.status === 'Published' && 'border-l-green-500',
          post.status === 'Needs Approval' && 'border-l-amber-500',
          dndIsDragging && 'opacity-60 rotate-3 scale-105 shadow-xl border-2 border-gray-300',
          isDragging && 'opacity-30'
        )}
        onClick={onClick}
      >
        <CardContent className="p-2">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-xs truncate text-gray-900 mb-1">
                {post.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                {post.text}
              </p>
            </div>
            
            {/* Drag Handle */}
            <div
              {...listeners}
              className={cn(
                'ml-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing',
                dndIsDragging && 'opacity-100'
              )}
            >
              <GripVertical className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </div>
          </div>

          {/* Platforms */}
          {post.platforms && post.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.platforms.slice(0, 2).map((platform) => (
                <Badge
                  key={platform}
                  variant="outline"
                  className="text-xs px-1 py-0 h-4"
                >
                  {platform.slice(0, 2)}
                </Badge>
              ))}
              {post.platforms.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  +{post.platforms.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Quick Actions (appear on hover) */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                onClick={handleEdit}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}