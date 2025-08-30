'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, RotateCcw, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormSection } from './settings-form'

const STORAGE_KEY = 'restaurant-settings'

const cuisineTypes = [
  'Mexican',
  'Italian',
  'Fast Casual',
  'Fine Dining',
  'Asian Fusion',
  'Mediterranean',
  'American',
  'BBQ',
  'Seafood',
  'Vegan',
  'Other',
]

const customerCounts = [
  'Under 50',
  '50-100',
  '100-200',
  '200-500',
  '500+',
]

const teamSizes = [
  '1-5',
  '6-10',
  '11-20',
  '21-50',
  '50+',
]

const socialPlatforms = [
  'Instagram',
  'Facebook',
  'TikTok',
  'Twitter/X',
  'LinkedIn',
]

const weeklyPostCounts = [
  '1-2 posts',
  '3-4 posts',
  '5-7 posts',
  '8-10 posts',
  '10+ posts',
]

const brandTones = [
  'Casual/Fun',
  'Professional',
  'Family-friendly',
  'Trendy',
  'Upscale',
  'Community-focused',
]

export function RestaurantSettingsV2() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Individual state for each field - fully controlled
  const [restaurantName, setRestaurantName] = useState('')
  const [location, setLocation] = useState('')
  const [cuisineType, setCuisineType] = useState('')
  const [dailyCustomerCount, setDailyCustomerCount] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [mainSocialPlatform, setMainSocialPlatform] = useState('')
  const [weeklyPostCount, setWeeklyPostCount] = useState('')
  const [brandTone, setBrandTone] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    console.log('🔄 Loading settings from localStorage...')
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('✅ Loaded settings:', parsed)
        
        // Set each state individually
        setRestaurantName(parsed.restaurantName || '')
        setLocation(parsed.location || '')
        setCuisineType(parsed.cuisineType || '')
        setDailyCustomerCount(parsed.dailyCustomerCount || '')
        setTeamSize(parsed.teamSize || '')
        setMainSocialPlatform(parsed.mainSocialPlatform || '')
        setWeeklyPostCount(parsed.weeklyPostCount || '')
        setBrandTone(parsed.brandTone || '')
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    const settings = {
      restaurantName,
      location,
      cuisineType,
      dailyCustomerCount,
      teamSize,
      mainSocialPlatform,
      weeklyPostCount,
      brandTone,
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      console.log('💾 Saved settings:', settings)
      
      toast.success('Settings saved!', {
        description: 'Your restaurant settings have been updated successfully.',
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings', {
        description: 'Please try again or contact support if the problem persists.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setRestaurantName('')
    setLocation('')
    setCuisineType('')
    setDailyCustomerCount('')
    setTeamSize('')
    setMainSocialPlatform('')
    setWeeklyPostCount('')
    setBrandTone('')
    
    localStorage.removeItem(STORAGE_KEY)
    
    toast.info('Form reset', {
      description: 'All fields have been cleared.',
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-full mx-auto border-gray-300">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">Restaurant Settings</CardTitle>
          <CardDescription className="text-gray-600">
            Loading your settings...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-full mx-auto border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Restaurant Settings</CardTitle>
        <CardDescription className="text-gray-600">
          Configure your restaurant details to generate personalized content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-8">
          {/* Basic Information Section */}
          <FormSection 
            title="Basic Information" 
            description="Essential details about your restaurant"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Restaurant Name */}
              <div className="space-y-2">
                <Label htmlFor="restaurantName" className="text-gray-700 font-medium">
                  Restaurant Name
                </Label>
                <Input
                  id="restaurantName"
                  placeholder="Enter your restaurant name"
                  className="border-gray-300 focus:border-gray-400 h-11"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
                <p className="text-gray-500 text-sm">
                  The official name of your restaurant
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Downtown Miami, Brooklyn, etc."
                  className="border-gray-300 focus:border-gray-400 h-11"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <p className="text-gray-500 text-sm">
                  Your restaurant&apos;s city or neighborhood
                </p>
              </div>

              {/* Cuisine Type */}
              <div className="space-y-2">
                <Label htmlFor="cuisineType" className="text-gray-700 font-medium">
                  Cuisine Type
                </Label>
                <Select value={cuisineType} onValueChange={setCuisineType}>
                  <SelectTrigger id="cuisineType" className="border-gray-300 focus:border-gray-400 h-11">
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-sm">
                  Primary type of food you serve
                </p>
              </div>

              {/* Brand Tone */}
              <div className="space-y-2">
                <Label htmlFor="brandTone" className="text-gray-700 font-medium">
                  Brand Tone
                </Label>
                <Select value={brandTone} onValueChange={setBrandTone}>
                  <SelectTrigger id="brandTone" className="border-gray-300 focus:border-gray-400 h-11">
                    <SelectValue placeholder="Select brand tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandTones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-sm">
                  How you want to communicate with your audience
                </p>
              </div>
            </div>
          </FormSection>

          {/* Business Details Section */}
          <FormSection 
            title="Business Details" 
            description="Information about your restaurant&apos;s size and operations"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Customer Count */}
              <div className="space-y-2">
                <Label htmlFor="dailyCustomerCount" className="text-gray-700 font-medium">
                  Daily Customer Count
                </Label>
                <Select value={dailyCustomerCount} onValueChange={setDailyCustomerCount}>
                  <SelectTrigger id="dailyCustomerCount" className="border-gray-300 focus:border-gray-400 h-11">
                    <SelectValue placeholder="Select customer count" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerCounts.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-sm">
                  Average number of customers served daily
                </p>
              </div>

              {/* Team Size */}
              <div className="space-y-2">
                <Label htmlFor="teamSize" className="text-gray-700 font-medium">
                  Team Size
                </Label>
                <Select value={teamSize} onValueChange={setTeamSize}>
                  <SelectTrigger id="teamSize" className="border-gray-300 focus:border-gray-400 h-11">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-sm">
                  Total number of employees at your restaurant
                </p>
              </div>
            </div>
          </FormSection>

          {/* Marketing Preferences Section */}
          <FormSection 
            title="Marketing Preferences" 
            description="Configure your social media strategy and posting frequency"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Social Media Platform */}
              <div className="space-y-2">
                <Label htmlFor="mainSocialPlatform" className="text-gray-700 font-medium">
                  Main Social Media Platform
                </Label>
                <Select value={mainSocialPlatform} onValueChange={setMainSocialPlatform}>
                  <SelectTrigger id="mainSocialPlatform" className="border-gray-300 focus:border-gray-400 h-11">
                    <SelectValue placeholder="Select your primary platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-sm">
                  Your primary platform for social media marketing
                </p>
              </div>

              {/* Weekly Post Count */}
              <div className="space-y-2">
                <Label htmlFor="weeklyPostCount" className="text-gray-700 font-medium">
                  Weekly Posting Frequency
                </Label>
                <Select value={weeklyPostCount} onValueChange={setWeeklyPostCount}>
                  <SelectTrigger id="weeklyPostCount" className="border-gray-300 focus:border-gray-400 h-11">
                    <SelectValue placeholder="Select posting frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeklyPostCounts.map((count) => (
                      <SelectItem key={count} value={count}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500 text-sm">
                  How many posts per week do you want to publish?
                </p>
              </div>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="text-gray-600 border-gray-300 hover:bg-gray-50 h-11 px-6"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            
            <Button 
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gray-900 text-white hover:bg-gray-800 h-11 px-8"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}