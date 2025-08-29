import { Button } from '@/components/ui/button'
import { PlusCircle, Calendar, FileText } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: () => void
  actionLabel?: string
  view?: 'grid' | 'calendar' | 'kanban'
}

export function EmptyState({ 
  title = "No posts yet", 
  description = "Get started by creating your first social media post",
  action,
  actionLabel = "Create Post",
  view = 'grid'
}: EmptyStateProps) {
  const getIcon = () => {
    switch (view) {
      case 'calendar':
        return <Calendar className="h-12 w-12 text-gray-400" />
      case 'kanban':
        return <FileText className="h-12 w-12 text-gray-400" />
      default:
        return <PlusCircle className="h-12 w-12 text-gray-400" />
    }
  }

  const getViewSpecificContent = () => {
    switch (view) {
      case 'calendar':
        return {
          title: "No posts scheduled for this period",
          description: "Schedule posts to see them appear on your calendar view"
        }
      case 'kanban':
        return {
          title: "No posts in workflow",
          description: "Add posts to track them through your content workflow"
        }
      default:
        return { title, description }
    }
  }

  const content = getViewSpecificContent()

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
        {getIcon()}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {content.title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 max-w-sm">
        {content.description}
      </p>
      {action && (
        <Button 
          onClick={action}
          className="mt-6 bg-gray-900 text-white hover:bg-gray-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}