'use client'

import { useState } from 'react'
import { ViewMode } from '@/types/post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Grid3X3, 
  Calendar, 
  Kanban, 
  Filter, 
  Search,
  SortAsc,
  Plus,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ViewControlsProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
  onSearch?: (query: string) => void
  onFilter?: () => void
  onSort?: () => void
  onGenerate?: () => void
  isGenerating?: boolean
  className?: string
}

export function ViewControls({
  currentView,
  onViewChange,
  onSearch,
  onFilter,
  onSort,
  onGenerate,
  isGenerating = false,
  className
}: ViewControlsProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      setSearchQuery('')
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleSearchClose = () => {
    setIsSearchExpanded(false)
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }
  return (
    <div className={cn(
      'border-b border-gray-200 bg-white px-6 py-4',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Content Calendar
          </h2>
          
          {/* View Toggle */}
          <Tabs value={currentView} onValueChange={(value) => onViewChange(value as ViewMode)}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger 
                value="grid"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger 
                value="kanban"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
              >
                <Kanban className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter and Sort buttons moved to left */}
          <div className="flex items-center space-x-2">
            {/* Filter */}
            {onFilter && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={onFilter}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter posts</span>
              </Button>
            )}

            {/* Sort */}
            {onSort && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={onSort}
              >
                <SortAsc className="h-4 w-4" />
                <span className="sr-only">Sort posts</span>
              </Button>
            )}

            {/* Search - positioned after sort */}
            {onSearch && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  isSearchExpanded && "bg-gray-100"
                )}
                onClick={handleSearchToggle}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search posts</span>
              </Button>
            )}
          </div>
        </div>

        {/* Generate button at top right */}
        <div className="flex items-center space-x-2">
          {onGenerate && (
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <Plus className={cn(
                "h-4 w-4 transition-transform duration-500",
                isGenerating && "animate-spin"
              )} />
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Search Panel */}
      {isSearchExpanded && (
        <div className="mt-4 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-gray-600"
                onClick={handleSearchClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}