'use client'

import { useState } from 'react'
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns'
import { formatDateToLocal, parseDateFromLocal, isToday as isTodayLocal, isPastDate } from '@/lib/date-utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Active,
  Over
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Post } from '@/types/post'
import { PostCard } from './post-card'
import { PostDetailModal } from './post-detail-modal'
import { EmptyState } from './empty-state'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DraggablePostCard } from './draggable-post-card'
import { DroppableCalendarCell } from './droppable-calendar-cell'

interface CalendarViewDndProps {
  posts: Post[]
  onUpdatePost: (post: Post) => void
  onDeletePost?: (post: Post) => void
  isLoading?: boolean
  className?: string
}

export function CalendarViewDnd({
  posts,
  onUpdatePost,
  onDeletePost,
  isLoading = false,
  className
}: CalendarViewDndProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isDragModalOpen, setIsDragModalOpen] = useState(false)
  const [draggedPost, setDraggedPost] = useState<Post | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Get first day of current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  
  // Get first day to show (might be from previous month)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  
  // Generate calendar days
  const days = []
  const currentDateStr = formatDateToLocal(new Date())
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dateStr = formatDateToLocal(date) // Use local timezone formatting
    const dayPosts = posts.filter(post => post.date === dateStr)
    const isCurrentMonth = date.getMonth() === currentDate.getMonth()
    const isToday = dateStr === currentDateStr
    
    days.push({
      date,
      dateStr,
      dayPosts,
      isCurrentMonth,
      isToday
    })
  }

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const post = posts.find(p => p.id === active.id)
    if (post) {
      setDraggedPost(post)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedPost(null)

    if (!over) {
      toast.error('Invalid drop location', {
        description: 'Please drop the post on a valid calendar date.',
      })
      return
    }

    const postId = active.id as string
    const newDate = over.id as string
    
    const post = posts.find(p => p.id === postId)
    if (!post) return

    // Check if the date is valid (not in the past) using local timezone
    if (isPastDate(newDate)) {
      toast.error('Cannot schedule in the past', {
        description: 'Please select a current or future date.',
      })
      return
    }

    const targetDate = parseDateFromLocal(newDate)

    if (post.date !== newDate) {
      const updatedPost = { ...post, date: newDate }
      onUpdatePost(updatedPost)
      
      toast.success('Post rescheduled', {
        description: `Post moved to ${format(targetDate, 'MMMM d, yyyy')}`,
      })
    }
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setIsDragModalOpen(true)
  }

  const handleModalSave = (updatedPost: Post) => {
    onUpdatePost(updatedPost)
  }

  if (!isLoading && posts.length === 0) {
    return (
      <EmptyState
        title="No posts scheduled"
        description="Schedule posts to see them appear on your calendar"
        actionLabel="Create Your First Post"
        view="calendar"
      />
    )
  }

  return (
    <div className={cn('p-6', className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{monthYear}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Drag Instructions */}
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>💡 Tip:</strong> Drag and drop posts between dates to reschedule them. Click on a post to edit detailed information.
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Week Day Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-white p-3 text-center text-sm font-medium text-gray-900"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map((day, index) => (
            <DroppableCalendarCell
              key={index}
              date={day.dateStr}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              dayNumber={day.date.getDate()}
              postsCount={day.dayPosts.length}
            >
              {/* Posts for this day */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {day.dayPosts.slice(0, 2).map((post) => (
                  <DraggablePostCard
                    key={post.id}
                    post={post}
                    onClick={() => handlePostClick(post)}
                    onDelete={onDeletePost}
                    isDragging={draggedPost?.id === post.id}
                  />
                ))}
                {day.dayPosts.length > 2 && (
                  <motion.div 
                    className="text-xs text-gray-500 text-center py-1 cursor-pointer hover:text-gray-700"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      // Show all posts for this day in a modal or expand
                      toast.info(`${day.dayPosts.length} posts on this day`, {
                        description: 'Click individual posts to edit them.',
                      })
                    }}
                  >
                    +{day.dayPosts.length - 2} more
                  </motion.div>
                )}
              </div>
            </DroppableCalendarCell>
          ))}
        </div>
      </DndContext>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isDragModalOpen}
        onClose={() => {
          setIsDragModalOpen(false)
          setSelectedPost(null)
        }}
        onSave={handleModalSave}
      />
    </div>
  )
}