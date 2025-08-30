-- Content Dashboard Table
-- Creates the main content calendar table with specified fields
--
-- Supabase Storage Integration:
-- 1. Create bucket: CREATE BUCKET 'post-images' WITH public = true;
-- 2. Upload images to bucket via Supabase client
-- 3. Store public URLs in thumbnail_url field
-- 4. URLs format: https://[project-id].supabase.co/storage/v1/object/public/post-images/[filename]
-- 5. Built-in CDN, image transformations, and caching included

CREATE TABLE content_dashboard (
    content_id char(8) PRIMARY KEY DEFAULT SUBSTR(gen_random_uuid()::text, 1, 8),
    content_title text NOT NULL,
    posting_date date NOT NULL,
    content_description text,
    social_media_text text NOT NULL,
    thumbnail_url text,
    tags text[] DEFAULT '{}',
    platforms text[] DEFAULT '{}' CHECK (
        platforms <@ ARRAY['Facebook', 'LinkedIn', 'YouTube', 'Instagram']
    ),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_content_dashboard_posting_date ON content_dashboard(posting_date);
CREATE INDEX idx_content_dashboard_platforms ON content_dashboard USING GIN(platforms);
CREATE INDEX idx_content_dashboard_tags ON content_dashboard USING GIN(tags);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_dashboard_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_dashboard_updated_at
    BEFORE UPDATE ON content_dashboard
    FOR EACH ROW
    EXECUTE FUNCTION update_content_dashboard_updated_at();

-- Enable Row Level Security
ALTER TABLE content_dashboard ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all authenticated users to read, write, and delete
CREATE POLICY "Allow all users full access to content_dashboard" ON content_dashboard
    FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');