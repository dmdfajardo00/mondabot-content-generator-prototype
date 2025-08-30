'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import * as z from 'zod'
import { toast } from 'sonner'
import { 
  CalendarIcon, 
  Loader2, 
  Save, 
  X 
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { TagInput } from '@/components/ui/extensions/tag-input'
import { PlatformSelector } from '@/components/ui/extensions/platform-selector'
import { Post, Platform } from '@/types/post'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }).max(100, {
    message: 'Title must be 100 characters or less.',
  }),
  description: z.string().min(1, {
    message: 'Description is required.',
  }).max(500, {
    message: 'Description must be 500 characters or less.',
  }),
  date: z.date({
    message: 'A posting date is required.',
  }),
  tags: z.array(z.string()).max(10, {
    message: 'Maximum 10 tags allowed.',
  }).optional(),
  platforms: z.array(z.enum(['Facebook', 'LinkedIn', 'YouTube', 'Instagram'])).min(1, {
    message: 'At least one platform must be selected.',
  }),
  text: z.string().max(280, {
    message: 'Text must be 280 characters or less.',
  }).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PostDetailModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedPost: Post) => void
  isLoading?: boolean
}

export function PostDetailModal({
  post,
  isOpen,
  onClose,
  onSave,
  isLoading = false
}: PostDetailModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      tags: [],
      platforms: [],
      text: '',
    }
  })

  // Update form when post changes
  useEffect(() => {
    if (post && isOpen) {
      form.reset({
        title: post.title || '',
        description: post.description || '',
        date: new Date(post.date),
        tags: post.tags || [],
        platforms: post.platforms || [],
        text: post.text || '',
      })
    }
  }, [post, isOpen, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const onSubmit = async (values: FormValues) => {
    if (!post) return

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedPost: Post = {
        ...post,
        title: values.title,
        description: values.description,
        date: format(values.date, 'yyyy-MM-dd'),
        tags: values.tags || [],
        platforms: values.platforms,
        text: values.text || post.text,
        // Update hashtags from tags
        hashtags: (values.tags || []).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')
      }

      onSave(updatedPost)
      
      toast.success('Post updated!', {
        description: 'Your post details have been saved successfully.',
      })
      
      handleClose()
    } catch (error) {
      toast.error('Failed to save post', {
        description: 'Please try again or contact support if the problem persists.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Post Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update your content information and scheduling details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-gray-700">Content Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter post title..." 
                        className="border-gray-300 focus:border-gray-400"
                        autoFocus={false}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      A catchy title for your social media post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700">Posting Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'justify-start text-left font-normal border-gray-300 focus:border-gray-400',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Content Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your content in detail..."
                      className="min-h-[100px] resize-y border-gray-300 focus:border-gray-400"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Detailed description of your post content ({field.value?.length || 0}/500)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Media Text (Optional) */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Social Media Text</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your social media caption..."
                      className="min-h-[80px] resize-y border-gray-300 focus:border-gray-400"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    The actual text that will appear on social media ({field.value?.length || 0}/280)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Field */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      tags={field.value || []}
                      onChange={field.onChange}
                      placeholder="Add tag and press Enter..."
                      maxTags={10}
                      className="border-gray-300 focus-within:border-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Add relevant tags for categorization (press Enter or comma to add)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Platform Selection */}
            <FormField
              control={form.control}
              name="platforms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Platforms</FormLabel>
                  <FormControl>
                    <PlatformSelector
                      platforms={['Facebook', 'LinkedIn', 'YouTube', 'Instagram']}
                      selectedPlatforms={field.value}
                      onChange={field.onChange}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-500">
                    Select the social media platforms where this post will be shared
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2 pt-6 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSaving}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}