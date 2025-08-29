import { useState, useEffect } from 'react'

export interface RestaurantSettings {
  restaurantName: string
  location: string
  cuisineType: string
  dailyCustomerCount: string
  teamSize: string
  socialPlatforms: string[]
  brandTone: string
}

const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: '',
  location: '',
  cuisineType: '',
  dailyCustomerCount: '',
  teamSize: '',
  socialPlatforms: [],
  brandTone: ''
}

const STORAGE_KEY = 'restaurant-settings'

export function useRestaurantSettings() {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings(parsed)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = async (newSettings: RestaurantSettings) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
      setSettings(newSettings)
      setHasUnsavedChanges(false)
      
      return { success: true }
    } catch (error) {
      console.error('Failed to save settings:', error)
      return { success: false, error }
    }
  }

  // Update settings and mark as unsaved
  const updateSettings = (updates: Partial<RestaurantSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    setHasUnsavedChanges(true)
  }

  // Reset to default settings
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    setHasUnsavedChanges(true)
  }

  // Check if settings are complete
  const isComplete = Object.entries(settings).every(([key, value]) => {
    if (key === 'socialPlatforms') {
      return Array.isArray(value) && value.length > 0
    }
    return value !== ''
  })

  return {
    settings,
    isLoading,
    hasUnsavedChanges,
    isComplete,
    saveSettings,
    updateSettings,
    resetSettings,
    DEFAULT_SETTINGS
  }
}