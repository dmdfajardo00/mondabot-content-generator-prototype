-- Add missing columns to content_dashboard table to support current UI interface
-- These columns are required for full compatibility with the Post interface

-- Add status column for Kanban view functionality
ALTER TABLE content_dashboard 
ADD COLUMN status text DEFAULT 'Needs Approval' 
CHECK (status IN ('Needs Approval', 'Scheduled', 'Published'));

-- Add hashtags column for easier display and filtering
-- Note: This can also be derived from social_media_text, but having it as a separate field is cleaner
ALTER TABLE content_dashboard 
ADD COLUMN hashtags text DEFAULT '';

-- Update existing records to set proper status based on posting_date
UPDATE content_dashboard 
SET status = CASE 
    WHEN posting_date < CURRENT_DATE THEN 'Published'
    WHEN posting_date = CURRENT_DATE THEN 'Scheduled' 
    ELSE 'Scheduled'
END
WHERE status IS NULL;

-- Create index for status column for better performance in Kanban view
CREATE INDEX idx_content_dashboard_status ON content_dashboard(status);

-- Note: Run this script in your Supabase SQL editor to add the missing columns