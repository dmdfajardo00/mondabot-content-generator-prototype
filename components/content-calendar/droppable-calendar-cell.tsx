'use client'

import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DroppableCalendarCellProps {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  dayNumber: number
  postsCount: number
  children: React.ReactNode
}

export function DroppableCalendarCell({
  date,
  isCurrentMonth,
  isToday,
  dayNumber,
  postsCount,
  children
}: DroppableCalendarCellProps) {
  const { isOver, setNodeRef, active } = useDroppable({
    id: date,
    data: {
      type: 'calendar-cell',
      date,
    },
  })

  // Check if this is a valid drop target
  const targetDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isValidDropTarget = targetDate >= today

  // Don't allow dropping on past dates
  const shouldRejectDrop = !isValidDropTarget && active

  return (
    <motion.div
      ref={setNodeRef}
      className={cn(
        'bg-white p-2 min-h-[120px] flex flex-col relative transition-all duration-200',
        !isCurrentMonth && 'bg-gray-50',
        isToday && 'bg-blue-50',
        
        // Drop zone styles
        isOver && isValidDropTarget && 'bg-green-50 border-2 border-green-300 border-dashed',
        isOver && !isValidDropTarget && 'bg-red-50 border-2 border-red-300 border-dashed',
        
        // Hover effect when dragging
        active && isValidDropTarget && 'hover:bg-green-25 hover:border hover:border-green-200 hover:border-dashed',
        active && !isValidDropTarget && 'opacity-50',
      )}
      animate={isOver ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Date Header */}
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          'text-sm font-medium transition-colors',
          isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
          isToday && 'text-blue-600 font-semibold',
          isOver && isValidDropTarget && 'text-green-700',
          isOver && !isValidDropTarget && 'text-red-700',
        )}>
          {dayNumber}
        </span>
        
        {postsCount > 0 && (
          <motion.span 
            className={cn(
              'text-xs px-2 py-1 rounded-full transition-colors',
              isToday ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700',
              isOver && isValidDropTarget && 'bg-green-100 text-green-700',
            )}
            whileHover={{ scale: 1.1 }}
          >
            {postsCount}
          </motion.span>
        )}
      </div>

      {/* Drop Zone Indicator */}
      {isOver && (
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none',
            isValidDropTarget ? 'bg-green-100/80' : 'bg-red-100/80'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={cn(
              'text-sm font-medium px-3 py-1 rounded-full',
              isValidDropTarget 
                ? 'bg-green-200 text-green-800 border border-green-300' 
                : 'bg-red-200 text-red-800 border border-red-300'
            )}
            initial={{ scale: 0.8, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isValidDropTarget ? '📅 Drop here' : '❌ Past date'}
          </motion.div>
        </motion.div>
      )}

      {/* Invalid drop target overlay for past dates */}
      {!isValidDropTarget && active && (
        <div className="absolute inset-0 bg-gray-100/50 pointer-events-none" />
      )}

      {children}
    </motion.div>
  )
}