export interface Post {
  id: number
  date: string
  title: string
  text: string
  description: string
  hashtags: string
  tags: string[]
  platforms: Platform[]
  imageUrl: string
  status: 'Needs Approval' | 'Scheduled' | 'Published'
}

export type Platform = 'Facebook' | 'LinkedIn' | 'YouTube' | 'Instagram'

export type ViewMode = 'grid' | 'calendar' | 'kanban'

export interface ViewState {
  currentView: ViewMode
  isLoading: boolean
  posts: Post[]
}

export interface DragItem {
  id: number
  type: 'post'
  data: Post
}