-- Fix personal_gallery table to remove user_id column constraint
-- Run this in Supabase SQL Editor

-- First, let's check what columns exist in the table
-- This will help us understand the current schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'personal_gallery'
ORDER BY ordinal_position;

-- If user_id column exists and is causing issues, we can either:
-- 1. Make it nullable, or
-- 2. Remove it entirely if we're using user_email

-- Option 1: Make user_id nullable (if it exists)
DO $$ 
BEGIN
    -- Check if user_id column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'personal_gallery' 
        AND column_name = 'user_id'
    ) THEN
        -- Make user_id nullable
        ALTER TABLE personal_gallery ALTER COLUMN user_id DROP NOT NULL;
        RAISE NOTICE 'Made user_id column nullable in personal_gallery table';
    ELSE
        RAISE NOTICE 'user_id column does not exist in personal_gallery table';
    END IF;
END $$;

-- Ensure user_email column exists and is properly configured
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
        RAISE NOTICE 'Added user_email column to personal_gallery table';
    ELSE
        RAISE NOTICE 'user_email column already exists in personal_gallery table';
    END IF;
    
    -- Update existing records with a default email if user_email is null
    UPDATE personal_gallery SET user_email = 'default@example.com' WHERE user_email IS NULL;
    
    -- Make user_email NOT NULL after updating existing records
    ALTER TABLE personal_gallery ALTER COLUMN user_email SET NOT NULL;
END $$;
