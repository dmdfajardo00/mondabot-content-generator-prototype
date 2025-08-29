'use client'

import { useState, KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxTags?: number
}

export function TagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
  className,
  disabled = false,
  maxTags
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const tag = inputValue.trim()
    if (tag && !tags.includes(tag)) {
      if (!maxTags || tags.length < maxTags) {
        onChange([...tags, tag])
        setInputValue('')
      }
    }
  }

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    onChange(newTags)
  }

  const handleInputBlur = () => {
    addTag()
  }

  return (
    <div
      className={cn(
        'flex min-h-[38px] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
    >
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="gap-1 pr-1 hover:bg-secondary/80"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-destructive focus:outline-none focus:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
      {!disabled && (!maxTags || tags.length < maxTags) && (
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-0 bg-transparent px-0 py-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      )}
    </div>
  )
}