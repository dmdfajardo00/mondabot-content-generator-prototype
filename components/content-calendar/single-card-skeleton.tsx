import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SingleCardSkeletonProps {
  className?: string
}

export function SingleCardSkeleton({ className }: SingleCardSkeletonProps) {
  return (
    <Card className={cn(
      "border-gray-200 relative overflow-hidden bg-white",
      className
    )}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <CardHeader className="space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded relative overflow-hidden" />
        <div className="h-3 w-1/2 bg-gray-200 rounded relative overflow-hidden" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-40 w-full bg-gray-200 rounded-md relative overflow-hidden" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded relative overflow-hidden" />
          <div className="h-4 w-4/5 bg-gray-200 rounded relative overflow-hidden" />
        </div>
        <div className="flex space-x-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full relative overflow-hidden" />
          <div className="h-6 w-20 bg-gray-200 rounded-full relative overflow-hidden" />
          <div className="h-6 w-14 bg-gray-200 rounded-full relative overflow-hidden" />
        </div>
      </CardContent>
    </Card>
  )
}