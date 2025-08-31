'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Settings,
  LayoutDashboard,
  User,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isDropdownOpen])

  return (
    <div className={cn('h-screen flex flex-col relative', className)}>
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900">
              Restaurant Content
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <Separator className="bg-gray-200" />

      {/* User Profile at absolute bottom */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 animate-in slide-in-from-bottom-2 fade-in-0 duration-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">Dave Fajardo</p>
              <p className="text-xs text-gray-600">dmd.fajardo2000@gmail.com</p>
            </div>
            
            <div className="py-1">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors">
                <User className="mr-3 h-4 w-4" />
                Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors">
                <CreditCard className="mr-3 h-4 w-4" />
                Billing
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center transition-colors">
                <HelpCircle className="mr-3 h-4 w-4" />
                Help & Support
              </button>
            </div>
            
            <Separator className="my-1 bg-gray-100" />
            
            <div className="py-1">
              <button 
                onClick={() => console.log('Logout clicked')}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* User Avatar Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://res.cloudinary.com/dhqgytdpn/image/upload/v1756617557/dave-profile-pic-1_uzdzzg.png" alt="Dave Fajardo" />
            <AvatarFallback className="bg-gray-100 text-gray-600">
              DF
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-gray-900 block">Dave Fajardo</span>
            <span className="text-xs text-gray-600">Pro Version</span>
          </div>
          <ChevronUp className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isDropdownOpen ? "rotate-180" : ""
          )} />
        </button>
      </div>
    </div>
  )
}