'use client'

import { Button } from '@/components/ui/button'
import { Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60',
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Content Calendar</h1>
            <p className="text-sm text-gray-600">Manage your restaurant's social content</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-gray-800 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  )
}