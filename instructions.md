# Next.js Restaurant Content Calendar Project

## Project Overview
Create a modern Next.js + Vite restaurant content calendar application with a black/white/grayscale color scheme using shadcn/ui components and Tailwind CSS. The app should have a professional dashboard layout with three different views for managing social media content. Use this HTML layout for reference: C:\Users\dmfaj\Documents\GitHub\mondabot-content-generator-prototype\layout.html

## Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with black/white/grayscale theme
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React (comes with shadcn)
- **State Management**: React hooks (useState, useEffect)

## Project Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   ├── content-calendar/
│   │   ├── empty-state.tsx
│   │   ├── loading-skeleton.tsx
│   │   ├── grid-view.tsx
│   │   ├── calendar-view.tsx
│   │   ├── kanban-view.tsx
│   │   └── post-card.tsx
│   └── view-controls.tsx
├── lib/
│   ├── utils.ts
│   └── mock-data.ts
└── types/
    └── post.ts
```

## Required shadcn/ui Components
Install and use these components:
- `sidebar` - for the main navigation
- `card` - for post cards and layout containers  
- `button` - for all interactive elements
- `badge` - for post status indicators
- `avatar` - for user profile
- `skeleton` - for loading states
- `calendar` - for calendar view
- `tabs` - for view switching
- `separator` - for visual divisions
- `scroll-area` - for scrollable content

## Color Scheme & Design System
```css
/* Use these Tailwind classes for consistent theming */
backgrounds: bg-white, bg-black, bg-gray-50, bg-gray-100, bg-gray-900
text: text-black, text-white, text-gray-600, text-gray-800, text-gray-900
borders: border-gray-200, border-gray-300, border-gray-800
accents: hover:bg-gray-50, hover:bg-gray-100, focus:ring-gray-200
```

## Core Features to Implement

### 1. Sidebar Navigation
- Use shadcn `sidebar` component
- App logo at top
- Navigation menu (Dashboard, Content Calendar, Settings)
- User profile section at bottom with avatar
- Active state styling with subtle gray highlights

### 2. Main Content Area
- **Empty State**: Clean centered layout with generate button
- **Loading State**: Use shadcn `skeleton` components in grid layout
- **Content Views**: Three different view modes

### 3. View Controls
- Use shadcn `tabs` or toggle buttons
- Icons: Grid, Calendar, Kanban views
- Clean black/white styling

### 4. Three View Modes

#### Grid View
- Responsive grid using CSS Grid
- shadcn `card` components for each post
- Hover effects with subtle shadows
- Image, date, text, and hashtags

#### Calendar View  
- Use shadcn `calendar` component as base
- Custom styling to show posts on specific dates
- Monthly view with posts as small indicators
- Click to view post details

#### Kanban View
- Three columns: "Needs Approval", "Scheduled", "Published"
- Drag and drop (basic implementation)
- Compact post cards in each column
- Status badges using shadcn `badge`

## Mock Data Structure
```typescript
interface Post {
  id: number;
  date: string; // ISO date format
  text: string;
  hashtags: string;
  imageUrl: string;
  status: 'Needs Approval' | 'Scheduled' | 'Published';
}
```

## Key Interactions
1. **Generate Content Button**: Shows loading skeleton, then populates views
2. **View Switching**: Smooth transitions between grid/calendar/kanban
3. **Hover Effects**: Subtle animations on cards and buttons
4. **Responsive Design**: Mobile-friendly sidebar collapse

## Styling Guidelines
- **Typography**: Use font-sans (system fonts)
- **Spacing**: Consistent padding/margins using Tailwind scale
- **Shadows**: Subtle box-shadows for depth
- **Borders**: 1px borders in gray tones
- **Animations**: Smooth transitions, fade-in effects
- **Focus States**: Proper accessibility with focus rings

## Implementation Notes
- Start with the basic layout and sidebar
- Implement the empty state first
- Add the skeleton loading animation
- Build each view incrementally
- Use TypeScript for type safety
- Ensure proper responsive behavior
- Add smooth transitions between states

## Additional Enhancements
- Add search/filter functionality
- Implement date picker for calendar navigation
- Add post editing capabilities
- Include analytics dashboard
- Add dark mode toggle (optional)

## Setup Commands
```bash
npx create-next-app@latest restaurant-calendar --typescript --tailwind --app
cd restaurant-calendar
npx shadcn@latest init
npx shadcn@latest add sidebar card button badge avatar skeleton calendar tabs separator scroll-area
```

This should create a professional, modern restaurant content calendar application with a clean black/white aesthetic and smooth user interactions. Focus on component reusability and clean code structure.