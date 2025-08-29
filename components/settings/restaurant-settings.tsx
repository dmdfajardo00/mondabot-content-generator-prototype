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

const formSchema = z.object({
  restaurantName: z.string().min(2, {
    message: 'Restaurant name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  cuisineType: z.string({
    required_error: 'Please select a cuisine type.',
  }),
  dailyCustomerCount: z.string({
    required_error: 'Please select daily customer count.',
  }),
  teamSize: z.string({
    required_error: 'Please select team size.',
  }),
  socialPlatforms: z.array(z.string()).min(1, {
    message: 'Please select at least one social platform.',
  }),
  brandTone: z.string({
    required_error: 'Please select brand tone.',
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
  'Multiple Platforms',
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
  const { settings, saveSettings, resetSettings } = useRestaurantSettings()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  })

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
      socialPlatforms: [],
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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurant Name */}
              <FormField
                control={form.control}
                name="restaurantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Restaurant Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your restaurant name" 
                        className="border-gray-300 focus:border-gray-400"
                        {...field} 
                      />
                    </FormControl>
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
                    <FormLabel className="text-gray-700">Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City/Area" 
                        className="border-gray-300 focus:border-gray-400"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Your restaurant's city or area
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
                    <FormLabel className="text-gray-700">Cuisine Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-gray-400">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Daily Customer Count */}
              <FormField
                control={form.control}
                name="dailyCustomerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Daily Customer Count</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-gray-400">
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
                    <FormLabel className="text-gray-700">Team Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-gray-400">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Platform */}
              <FormField
                control={form.control}
                name="socialPlatforms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-gray-700">Social Platform</FormLabel>
                      <FormDescription className="text-gray-500">
                        Select the platforms you use for your restaurant
                      </FormDescription>
                    </div>
                    <div className="space-y-3">
                      {socialPlatforms.map((platform) => (
                        <FormField
                          key={platform}
                          control={form.control}
                          name="socialPlatforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={platform}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(platform)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, platform])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== platform
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-700">
                                  {platform}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
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
                    <FormLabel className="text-gray-700">Brand Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-gray-400">
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
                    <FormDescription className="text-gray-500">
                      How you want to communicate with your audience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}