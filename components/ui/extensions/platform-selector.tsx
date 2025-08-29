'use client'

import { Badge } from '@/components/ui/badge'
import { Platform } from '@/types/post'
import { cn } from '@/lib/utils'

interface PlatformSelectorProps {
  platforms: Platform[]
  selectedPlatforms: Platform[]
  onChange: (platforms: Platform[]) => void
  className?: string
  disabled?: boolean
  maxSelections?: number
}

const AVAILABLE_PLATFORMS: Platform[] = ['Facebook', 'LinkedIn', 'YouTube', 'Instagram']

export function PlatformSelector({
  platforms = AVAILABLE_PLATFORMS,
  selectedPlatforms,
  onChange,
  className,
  disabled = false,
  maxSelections
}: PlatformSelectorProps) {
  const togglePlatform = (platform: Platform) => {
    if (disabled) return

    if (selectedPlatforms.includes(platform)) {
      // Remove platform
      onChange(selectedPlatforms.filter(p => p !== platform))
    } else {
      // Add platform (if within max limit)
      if (!maxSelections || selectedPlatforms.length < maxSelections) {
        onChange([...selectedPlatforms, platform])
      }
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {platforms.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform)
        const isDisabled = disabled || (maxSelections && !isSelected && selectedPlatforms.length >= maxSelections)

        return (
          <Badge
            key={platform}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all hover:scale-105 select-none',
              isSelected && 'bg-gray-900 text-white hover:bg-gray-800',
              !isSelected && 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300',
              isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100'
            )}
            onClick={() => togglePlatform(platform)}
          >
            {platform}
          </Badge>
        )
      })}
    </div>
  )
}