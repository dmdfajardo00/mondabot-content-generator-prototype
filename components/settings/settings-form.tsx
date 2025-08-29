'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsFormStatusProps {
  isDirty: boolean
  isComplete: boolean
  lastSaved?: Date | null
}

export function SettingsFormStatus({ isDirty, isComplete, lastSaved }: SettingsFormStatusProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    if (!lastSaved) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diff = now.getTime() - lastSaved.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (days > 0) {
        setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`)
      } else if (hours > 0) {
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`)
      } else if (minutes > 0) {
        setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`)
      } else {
        setTimeAgo('Just now')
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [lastSaved])

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        {isComplete ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Settings Complete</p>
              <p className="text-xs text-gray-600">
                All required fields are filled
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Settings Incomplete</p>
              <p className="text-xs text-gray-600">
                Please fill in all required fields
              </p>
            </div>
          </>
        )}
      </div>

      <div className="text-right">
        {isDirty && (
          <p className="text-xs text-amber-600 font-medium">Unsaved changes</p>
        )}
        {lastSaved && !isDirty && (
          <p className="text-xs text-gray-500">Last saved {timeAgo}</p>
        )}
      </div>
    </div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean
  onSave: () => void
  onDiscard: () => void
}

export function UnsavedChangesWarning({ 
  hasUnsavedChanges, 
  onSave, 
  onDiscard 
}: UnsavedChangesWarningProps) {
  if (!hasUnsavedChanges) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            You have unsaved changes
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Save your changes or they will be lost.
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={onSave}
              className="px-3 py-1 text-xs font-medium bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={onDiscard}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}