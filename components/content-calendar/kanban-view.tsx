'use client'

import { Post } from '@/types/post'
import { PostCard } from './post-card'
import { EmptyState } from './empty-state'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KanbanViewProps {
  posts: Post[]
  isLoading?: boolean
  onCreatePost?: () => void
  onEditPost?: (post: Post) => void
  onDeletePost?: (post: Post) => void
  onViewPost?: (post: Post) => void
  className?: string
}

const statusColumns = [
  {
    id: 'Needs Approval',
    title: 'Needs Approval',
    icon: AlertCircle,
    color: 'bg-gray-100 border-gray-200',
    badgeColor: 'bg-gray-100 text-gray-600'
  },
  {
    id: 'Scheduled',
    title: 'Scheduled',
    icon: Clock,
    color: 'bg-gray-50 border-gray-200',
    badgeColor: 'bg-gray-200 text-gray-800'
  },
  {
    id: 'Published',
    title: 'Published',
    icon: CheckCircle,
    color: 'bg-gray-900/5 border-gray-300',
    badgeColor: 'bg-gray-800 text-white'
  }
] as const

export function KanbanView({
  posts,
  isLoading = false,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onViewPost,
  className
}: KanbanViewProps) {
  if (!isLoading && posts.length === 0) {
    return (
      <EmptyState
        title="No posts in workflow"
        description="Add posts to track them through your content approval process"
        action={onCreatePost}
        actionLabel="Create Your First Post"
        view="kanban"
      />
    )
  }

  return (
    <div className={cn('p-6', className)}>
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {statusColumns.map((column) => {
          const columnPosts = posts.filter(post => post.status === column.id)
          const Icon = column.icon
          
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
            >
              <div className={cn(
                'rounded-lg border p-4 h-full',
                column.color
              )}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <h3 className="font-medium text-gray-900">
                      {column.title}
                    </h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn('text-xs', column.badgeColor)}
                  >
                    {columnPosts.length}
                  </Badge>
                </div>

                {/* Posts in this column */}
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {columnPosts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Icon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">
                          No {column.title.toLowerCase()} posts
                        </p>
                      </div>
                    ) : (
                      columnPosts.map((post) => (
                        <div
                          key={post.id}
                          className="transition-all duration-200 hover:scale-[1.02]"
                        >
                          <PostCard
                            post={post}
                            view="kanban"
                            onEdit={onEditPost}
                            onDelete={onDeletePost}
                            onView={onViewPost}
                            className="shadow-sm hover:shadow-md bg-white"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}