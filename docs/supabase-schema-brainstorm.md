# Supabase Database Schema - Content Calendar System

## Overview

This document outlines the proposed Supabase schema for the Restaurant Content Calendar application. The schema is designed to support multi-tenant restaurant content management, AI-powered content generation, and comprehensive social media scheduling.

## Core Entities & Relationships

### 1. User Management & Authentication

```sql
-- Users table (managed by Supabase Auth)
-- Built-in table, reference only
auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
```

### 2. Restaurant Management

```sql
-- Restaurants table
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  cuisine_type text,
  daily_customer_count text,
  team_size text,
  brand_tone text,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Social media platform preferences
CREATE TABLE restaurant_platforms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'Twitter')),
  is_active boolean DEFAULT true,
  platform_specific_settings jsonb,
  created_at timestamp with time zone DEFAULT NOW()
);
```

### 3. Content Calendar & Posts

```sql
-- Content posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_text text NOT NULL,
  description text,
  hashtags text,
  scheduled_date date NOT NULL,
  scheduled_time time,
  image_url text,
  status text NOT NULL DEFAULT 'needs_approval' 
    CHECK (status IN ('needs_approval', 'scheduled', 'published', 'draft', 'archived')),
  content_type text DEFAULT 'standard' 
    CHECK (content_type IN ('standard', 'promotion', 'story', 'event', 'menu_item', 'team_spotlight')),
  ai_generated boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW(),
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone
);

-- Post tags (many-to-many relationship)
CREATE TABLE post_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Post platforms (which platforms this post is scheduled for)
CREATE TABLE post_platforms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'Twitter')),
  platform_post_id text, -- External platform's post ID after publishing
  published_at timestamp with time zone,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT NOW()
);
```

### 4. Content Generation & AI Integration

```sql
-- AI content generation requests
CREATE TABLE content_generation_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES auth.users(id),
  request_type text DEFAULT 'batch' CHECK (request_type IN ('batch', 'single', 'template')),
  generation_parameters jsonb, -- Settings used for generation
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  posts_generated integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT NOW(),
  completed_at timestamp with time zone,
  error_message text
);

-- Generated content batches
CREATE TABLE content_batches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  generation_request_id uuid REFERENCES content_generation_requests(id) ON DELETE SET NULL,
  batch_name text,
  date_range_start date,
  date_range_end date,
  total_posts integer DEFAULT 0,
  approved_posts integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Link posts to batches
ALTER TABLE posts ADD COLUMN batch_id uuid REFERENCES content_batches(id) ON DELETE SET NULL;
```

### 5. Analytics & Performance Tracking

```sql
-- Post performance analytics
CREATE TABLE post_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  platform text NOT NULL,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  clicks integer DEFAULT 0,
  engagement_rate decimal(5,2),
  recorded_at timestamp with time zone DEFAULT NOW(),
  data_source text DEFAULT 'manual' CHECK (data_source IN ('manual', 'api', 'webhook'))
);

-- Daily restaurant analytics summary
CREATE TABLE restaurant_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_posts integer DEFAULT 0,
  published_posts integer DEFAULT 0,
  total_engagement integer DEFAULT 0,
  total_reach integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT NOW(),
  UNIQUE(restaurant_id, date)
);
```

### 6. User Activity & Audit Trail

```sql
-- Activity log for audit trail
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, -- 'created', 'updated', 'deleted', 'published', 'approved'
  entity_type text NOT NULL, -- 'post', 'restaurant', 'settings'
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Essential indexes for query performance
CREATE INDEX idx_posts_restaurant_date ON posts(restaurant_id, scheduled_date);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_restaurant_status ON posts(restaurant_id, status);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_platforms_post_id ON post_platforms(post_id);
CREATE INDEX idx_activity_log_restaurant_date ON activity_log(restaurant_id, created_at);
CREATE INDEX idx_restaurant_platforms_restaurant ON restaurant_platforms(restaurant_id);
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Restaurant access policies
CREATE POLICY "Users can access their own restaurants" ON restaurants
  FOR ALL USING (auth.uid() = user_id);

-- Post access policies
CREATE POLICY "Users can access posts from their restaurants" ON posts
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Similar policies for all other tables...
-- (Additional policies would follow the same pattern)
```

## Database Functions & Triggers

```sql
-- Function to update post updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_post_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (
    restaurant_id, 
    user_id, 
    action, 
    entity_type, 
    entity_id, 
    old_values, 
    new_values
  ) VALUES (
    COALESCE(NEW.restaurant_id, OLD.restaurant_id),
    auth.uid(),
    TG_OP,
    'post',
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Activity logging trigger
CREATE TRIGGER log_posts_activity
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW EXECUTE FUNCTION log_post_activity();
```

## Migration Strategy

### Phase 1: Core Tables
1. Set up user authentication (built into Supabase)
2. Create restaurants table
3. Create restaurant_platforms table
4. Create posts table with basic fields

### Phase 2: Enhanced Features
1. Add post_tags table
2. Add post_platforms table
3. Implement RLS policies
4. Add indexes

### Phase 3: Analytics & AI
1. Add content_generation_requests table
2. Add content_batches table
3. Add analytics tables
4. Add activity_log table

### Phase 4: Advanced Features
1. Implement triggers and functions
2. Add advanced analytics
3. Performance optimization
4. Data archiving policies

## Key Design Decisions

### 1. Multi-tenant Architecture
- Each restaurant is isolated by restaurant_id
- RLS ensures data security between tenants
- Scalable for multiple restaurant chains

### 2. Flexible Post System
- Posts can be scheduled for multiple platforms
- Supports different content types
- AI-generated vs manual content tracking
- Comprehensive status workflow

### 3. Analytics Ready
- Built-in analytics tables for performance tracking
- Audit trail for compliance and debugging
- Flexible jsonb fields for platform-specific data

### 4. AI Integration
- Tracks AI generation requests and batches
- Links generated content to source requests
- Supports different generation strategies

### 5. Platform Agnostic
- Designed to support current and future social platforms
- Platform-specific settings stored as jsonb
- Extensible without schema changes

## Sample Queries

### Get all posts for a restaurant's calendar view
```sql
SELECT p.*, 
       array_agg(pt.tag) as tags,
       array_agg(pp.platform) as platforms
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN post_platforms pp ON p.id = pp.post_id
WHERE p.restaurant_id = $1 
  AND p.scheduled_date BETWEEN $2 AND $3
GROUP BY p.id
ORDER BY p.scheduled_date, p.scheduled_time;
```

### Get dashboard analytics
```sql
SELECT 
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE status = 'published') as published_posts,
  COUNT(*) FILTER (WHERE status = 'needs_approval') as pending_approval,
  COUNT(*) FILTER (WHERE ai_generated = true) as ai_generated_posts
FROM posts 
WHERE restaurant_id = $1 
  AND created_at >= NOW() - INTERVAL '30 days';
```

### Get performance analytics
```sql
SELECT 
  p.title,
  p.scheduled_date,
  pa.platform,
  pa.views,
  pa.likes,
  pa.engagement_rate
FROM posts p
JOIN post_analytics pa ON p.id = pa.post_id
WHERE p.restaurant_id = $1
  AND p.status = 'published'
ORDER BY pa.engagement_rate DESC;
```

## Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database Configuration (handled by Supabase)
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

## Future Enhancements

### 1. Advanced Features
- Content templates library
- Automated scheduling based on optimal posting times
- Content approval workflows with multiple reviewers
- A/B testing for post variations

### 2. Integration Expansions
- Direct social media API integrations
- Image generation AI integration
- Calendar synchronization
- CRM integration for customer data

### 3. Analytics Enhancements
- Competitor analysis
- Trend identification
- ROI tracking
- Custom dashboard builder

### 4. Collaboration Features
- Team member roles and permissions
- Comment system for post reviews
- Client approval workflows
- Brand guideline enforcement

This schema provides a solid foundation for the content calendar system while being flexible enough to accommodate future feature expansions and integrations.