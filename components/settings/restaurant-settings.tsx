'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Loader2, RotateCcw, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useRestaurantSettings } from '@/hooks/use-restaurant-settings'
import { FormSection } from './settings-form'

const formSchema = z.object({
  restaurantName: z.string().min(2, {
    message: 'Restaurant name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  cuisineType: z.string({
    message: 'Please select a cuisine type.',
  }),
  dailyCustomerCount: z.string({
    message: 'Please select daily customer count.',
  }),
  teamSize: z.string({
    message: 'Please select team size.',
  }),
  mainSocialPlatform: z.string({
    message: 'Please select your main social media platform.',
  }),
  weeklyPostCount: z.string({
    message: 'Please select posting frequency.',
  }),
  brandTone: z.string({
    message: 'Please select brand tone.',
  }),
})

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

export function RestaurantSettings() {
  const { settings, saveSettings, resetSettings, isLoading } = useRestaurantSettings()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: '',
      location: '',
      cuisineType: '',
      dailyCustomerCount: '',
      teamSize: '',
      mainSocialPlatform: '',
      weeklyPostCount: '',
      brandTone: '',
    },
  })

  // Sync form with loaded settings from localStorage
  useEffect(() => {
    if (!isLoading) {
      form.reset(settings)
    }
  }, [settings, isLoading, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true)
    
    const result = await saveSettings(values)
    
    if (result.success) {
      toast.success('Settings saved!', {
        description: 'Your restaurant settings have been updated successfully.',
      })
    } else {
      toast.error('Failed to save settings', {
        description: 'Please try again or contact support if the problem persists.',
      })
    }
    
    setIsSaving(false)
  }

  const handleReset = () => {
    resetSettings()
    form.reset({
      restaurantName: '',
      location: '',
      cuisineType: '',
      dailyCustomerCount: '',
      teamSize: '',
      mainSocialPlatform: '',
      weeklyPostCount: '',
      brandTone: '',
    })
    toast.info('Form reset', {
      description: 'All fields have been cleared.',
    })
  }

  return (
    <Card className="w-full max-w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900">Restaurant Settings</CardTitle>
        <CardDescription className="text-gray-600">
          Configure your restaurant details to generate personalized content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <FormSection 
              title="Basic Information" 
              description="Essential details about your restaurant"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Restaurant Name */}
                <FormField
                  control={form.control}
                  name="restaurantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Restaurant Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your restaurant name" 
                          className="border-gray-300 focus:border-gray-400 h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 text-sm">
                        The official name of your restaurant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Downtown Miami, Brooklyn, etc." 
                          className="border-gray-300 focus:border-gray-400 h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 text-sm">
                        Your restaurant&apos;s city or neighborhood
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cuisine Type */}
                <FormField
                  control={form.control}
                  name="cuisineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Cuisine Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 h-11">
                            <SelectValue placeholder="Select cuisine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cuisineTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500 text-sm">
                        Primary type of food you serve
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand Tone */}
                <FormField
                  control={form.control}
                  name="brandTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Brand Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 h-11">
                            <SelectValue placeholder="Select brand tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brandTones.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500 text-sm">
                        How you want to communicate with your audience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            {/* Business Details Section */}
            <FormSection 
              title="Business Details" 
              description="Information about your restaurant&apos;s size and operations"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Customer Count */}
                <FormField
                  control={form.control}
                  name="dailyCustomerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Daily Customer Count</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 h-11">
                            <SelectValue placeholder="Select customer count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customerCounts.map((count) => (
                            <SelectItem key={count} value={count}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500 text-sm">
                        Average number of customers served daily
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Team Size */}
                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Team Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 h-11">
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500 text-sm">
                        Total number of employees at your restaurant
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            {/* Marketing Preferences Section */}
            <FormSection 
              title="Marketing Preferences" 
              description="Configure your social media strategy and posting frequency"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Social Media Platform */}
                <FormField
                  control={form.control}
                  name="mainSocialPlatform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Main Social Media Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 h-11">
                            <SelectValue placeholder="Select your primary platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {socialPlatforms.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500 text-sm">
                        Your primary platform for social media marketing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weekly Post Count */}
                <FormField
                  control={form.control}
                  name="weeklyPostCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Weekly Posting Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-gray-400 h-11">
                            <SelectValue placeholder="Select posting frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weeklyPostCounts.map((count) => (
                            <SelectItem key={count} value={count}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-500 text-sm">
                        How many posts per week do you want to publish?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                type="submit" 
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
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}