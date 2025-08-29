import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  view?: 'grid' | 'calendar' | 'kanban'
  count?: number
  className?: string
}

export function LoadingSkeleton({ 
  view = 'grid', 
  count = 6,
  className 
}: LoadingSkeletonProps) {
  if (view === 'grid') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-3 w-1/2 bg-gray-200" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-40 w-full bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-4/5 bg-gray-200" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16 bg-gray-200" />
                <Skeleton className="h-6 w-20 bg-gray-200" />
                <Skeleton className="h-6 w-14 bg-gray-200" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (view === 'calendar') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Calendar header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32 bg-gray-200" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20 bg-gray-200" />
            <Skeleton className="h-8 w-20 bg-gray-200" />
          </div>
        </div>
        
        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week days header */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`header-${i}`} className="p-2 text-center">
              <Skeleton className="h-4 w-8 bg-gray-200 mx-auto" />
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={`day-${i}`} className="min-h-24 p-2 border border-gray-100">
              <Skeleton className="h-4 w-6 bg-gray-200 mb-2" />
              {i % 3 === 0 && (
                <Skeleton className="h-16 w-full bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'kanban') {
    return (
      <div className={cn('flex space-x-6 overflow-x-auto pb-4', className)}>
        {['Needs Approval', 'Scheduled', 'Published'].map((status) => (
          <div key={status} className="flex-shrink-0 w-80">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-24 bg-gray-200" />
                <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
              </div>
              
              <div className="space-y-3">
                {Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, i) => (
                  <Card key={i} className="border-gray-200">
                    <CardHeader className="space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-gray-200" />
                      <Skeleton className="h-3 w-1/2 bg-gray-200" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-32 w-full bg-gray-200" />
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full bg-gray-200" />
                        <Skeleton className="h-3 w-4/5 bg-gray-200" />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-5 w-12 bg-gray-200" />
                        <Skeleton className="h-5 w-16 bg-gray-200" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}