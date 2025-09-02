-- Fix public_gallery table structure
-- This migration adds missing columns to the existing public_gallery table

-- Check if the table exists and add missing columns
DO $$
BEGIN
    -- Add date_caught column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'date_caught') THEN
        ALTER TABLE public_gallery ADD COLUMN date_caught date;
    END IF;

    -- Add other missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'angler_name') THEN
        ALTER TABLE public_gallery ADD COLUMN angler_name text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'species') THEN
        ALTER TABLE public_gallery ADD COLUMN species text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'location') THEN
        ALTER TABLE public_gallery ADD COLUMN location text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'bait_used') THEN
        ALTER TABLE public_gallery ADD COLUMN bait_used text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'length_cm') THEN
        ALTER TABLE public_gallery ADD COLUMN length_cm numeric(6,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'weight_kg') THEN
        ALTER TABLE public_gallery ADD COLUMN weight_kg numeric(8,3);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'weather_conditions') THEN
        ALTER TABLE public_gallery ADD COLUMN weather_conditions text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'tide_state') THEN
        ALTER TABLE public_gallery ADD COLUMN tide_state text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'moon_phase') THEN
        ALTER TABLE public_gallery ADD COLUMN moon_phase text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'notes') THEN
        ALTER TABLE public_gallery ADD COLUMN notes text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'image_url') THEN
        ALTER TABLE public_gallery ADD COLUMN image_url text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'user_id') THEN
        ALTER TABLE public_gallery ADD COLUMN user_id text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'created_at') THEN
        ALTER TABLE public_gallery ADD COLUMN created_at timestamp with time zone DEFAULT now();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'public_gallery' AND column_name = 'updated_at') THEN
        ALTER TABLE public_gallery ADD COLUMN updated_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_public_gallery_date ON public_gallery(date_caught DESC);
CREATE INDEX IF NOT EXISTS idx_public_gallery_species ON public_gallery(species);
CREATE INDEX IF NOT EXISTS idx_public_gallery_location ON public_gallery(location);
CREATE INDEX IF NOT EXISTS idx_public_gallery_user_id ON public_gallery(user_id);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public gallery is viewable by everyone" ON public_gallery;
DROP POLICY IF EXISTS "Anyone can add to public gallery" ON public_gallery;
DROP POLICY IF EXISTS "Users can update their own entries" ON public_gallery;
DROP POLICY IF EXISTS "Users can delete their own entries" ON public_gallery;

-- Create policies for public access
-- Anyone can read public gallery entries
CREATE POLICY "Public gallery is viewable by everyone" ON public_gallery
  FOR SELECT USING (true);

-- Anyone can insert new entries
CREATE POLICY "Anyone can add to public gallery" ON public_gallery
  FOR INSERT WITH CHECK (true);

-- Users can only update/delete their own entries
CREATE POLICY "Users can update their own entries" ON public_gallery
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own entries" ON public_gallery
  FOR DELETE USING (auth.uid()::text = user_id);

-- Drop and recreate the function to ensure it matches the current table structure
DROP FUNCTION IF EXISTS get_public_gallery_entries(integer, integer);

-- Create a function to get recent public gallery entries
CREATE OR REPLACE FUNCTION get_public_gallery_entries(
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
) RETURNS TABLE (
  id bigint,
  angler_name text,
  species text,
  date_caught date,
  location text,
  bait_used text,
  length_cm numeric,
  weight_kg numeric,
  weather_conditions text,
  tide_state text,
  moon_phase text,
  notes text,
  image_url text,
  user_id text,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg.id,
    pg.angler_name,
    pg.species,
    pg.date_caught,
    pg.location,
    pg.bait_used,
    pg.length_cm,
    pg.weight_kg,
    pg.weather_conditions,
    pg.tide_state,
    pg.moon_phase,
    pg.notes,
    pg.image_url,
    pg.user_id,
    pg.created_at
  FROM public_gallery pg
  ORDER BY pg.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
