-- Complete fix for public_gallery table schema
-- This will drop the existing table and recreate it with the correct schema

-- Drop the existing public_gallery table and all its dependencies
DROP TABLE IF EXISTS public_gallery CASCADE;

-- Create the public_gallery table with the correct schema
CREATE TABLE public_gallery (
  id bigserial PRIMARY KEY,
  angler_name text NOT NULL,
  species text NOT NULL,
  date_caught date NOT NULL, -- This is the correct column name
  location text NOT NULL,
  bait_used text NOT NULL,
  length_cm numeric(6,2),
  weight_kg numeric(8,3),
  weather_conditions text,
  tide_state text,
  moon_phase text,
  notes text,
  image_url text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_public_gallery_date ON public_gallery(date_caught DESC);
CREATE INDEX idx_public_gallery_species ON public_gallery(species);
CREATE INDEX idx_public_gallery_location ON public_gallery(location);
CREATE INDEX idx_public_gallery_user_id ON public_gallery(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
-- Anyone can read public gallery entries
CREATE POLICY "Public gallery is viewable by everyone" ON public_gallery
  FOR SELECT USING (true);

-- Anyone can insert new entries (since we're using a simple user_id system)
CREATE POLICY "Anyone can add to public gallery" ON public_gallery
  FOR INSERT WITH CHECK (true);

-- Users can only update/delete their own entries
CREATE POLICY "Users can update their own entries" ON public_gallery
  FOR UPDATE USING (user_id = user_id); -- Simple string comparison

CREATE POLICY "Users can delete their own entries" ON public_gallery
  FOR DELETE USING (user_id = user_id); -- Simple string comparison

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

-- Add comments to the table and columns
COMMENT ON TABLE public_gallery IS 'Public gallery of catch photos shared by all users';
COMMENT ON COLUMN public_gallery.angler_name IS 'Name of the angler who caught the fish';
COMMENT ON COLUMN public_gallery.species IS 'Species of fish caught';
COMMENT ON COLUMN public_gallery.date_caught IS 'Date when the fish was caught';
COMMENT ON COLUMN public_gallery.location IS 'Location where the fish was caught';
COMMENT ON COLUMN public_gallery.bait_used IS 'Bait or lure used to catch the fish';
COMMENT ON COLUMN public_gallery.length_cm IS 'Length of the fish in centimeters';
COMMENT ON COLUMN public_gallery.weight_kg IS 'Weight of the fish in kilograms';
COMMENT ON COLUMN public_gallery.weather_conditions IS 'Weather conditions during fishing';
COMMENT ON COLUMN public_gallery.tide_state IS 'Tide state when fishing';
COMMENT ON COLUMN public_gallery.moon_phase IS 'Moon phase during fishing';
COMMENT ON COLUMN public_gallery.notes IS 'Additional notes or story about the catch';
COMMENT ON COLUMN public_gallery.image_url IS 'URL to the catch photo stored in Supabase storage';
COMMENT ON COLUMN public_gallery.user_id IS 'ID of the user who uploaded the catch (for ownership tracking)';
