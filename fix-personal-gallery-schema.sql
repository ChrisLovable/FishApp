-- Fix personal_gallery table schema to add user_email column
-- Run this in Supabase SQL Editor

-- First, check if the user_email column exists, if not add it
DO $$ 
BEGIN
    -- Check if user_email column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'personal_gallery' 
        AND column_name = 'user_email'
    ) THEN
        -- Add the user_email column
        ALTER TABLE personal_gallery ADD COLUMN user_email text;
        
        -- Update existing records with a default email (you can change this)
        UPDATE personal_gallery SET user_email = 'default@example.com' WHERE user_email IS NULL;
        
        -- Make the column NOT NULL after updating existing records
        ALTER TABLE personal_gallery ALTER COLUMN user_email SET NOT NULL;
        
        RAISE NOTICE 'Added user_email column to personal_gallery table';
    ELSE
        RAISE NOTICE 'user_email column already exists in personal_gallery table';
    END IF;
END $$;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_personal_gallery_user_email ON personal_gallery(user_email);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_date ON personal_gallery(date DESC);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_species ON personal_gallery(species);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE personal_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own catches" ON personal_gallery;
DROP POLICY IF EXISTS "Users can insert their own catches" ON personal_gallery;
DROP POLICY IF EXISTS "Users can update their own catches" ON personal_gallery;
DROP POLICY IF EXISTS "Users can delete their own catches" ON personal_gallery;

-- Create new policies for user-specific access
-- Note: These policies use a simpler approach since we're using email-based auth
CREATE POLICY "Users can view their own catches" ON personal_gallery
  FOR SELECT USING (true); -- Allow all reads for now

CREATE POLICY "Users can insert their own catches" ON personal_gallery
  FOR INSERT WITH CHECK (true); -- Allow all inserts for now

CREATE POLICY "Users can update their own catches" ON personal_gallery
  FOR UPDATE USING (true); -- Allow all updates for now

CREATE POLICY "Users can delete their own catches" ON personal_gallery
  FOR DELETE USING (true); -- Allow all deletes for now
