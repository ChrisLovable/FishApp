-- Create personal_gallery table for user's private catch log
-- This table stores catch photos that are private to each user

-- Create the personal_gallery table
CREATE TABLE IF NOT EXISTS personal_gallery (
  id bigserial PRIMARY KEY,
  user_email text NOT NULL, -- User's email identifier
  species text NOT NULL,
  date date NOT NULL,
  place text NOT NULL,
  length numeric(8,2), -- in cm
  weight numeric(8,2), -- in kg
  bait text,
  conditions text,
  photo_url text, -- URL to image stored in Supabase storage
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personal_gallery_user_email ON personal_gallery(user_email);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_date ON personal_gallery(date DESC);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_species ON personal_gallery(species);

-- Enable Row Level Security (RLS)
ALTER TABLE personal_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for user-specific access
-- Users can only see their own catches
CREATE POLICY "Users can view their own catches" ON personal_gallery
  FOR SELECT USING (user_email = current_setting('app.current_user_email', true));

-- Users can only insert their own catches
CREATE POLICY "Users can insert their own catches" ON personal_gallery
  FOR INSERT WITH CHECK (user_email = current_setting('app.current_user_email', true));

-- Users can only update their own catches
CREATE POLICY "Users can update their own catches" ON personal_gallery
  FOR UPDATE USING (user_email = current_setting('app.current_user_email', true));

-- Users can only delete their own catches
CREATE POLICY "Users can delete their own catches" ON personal_gallery
  FOR DELETE USING (user_email = current_setting('app.current_user_email', true));

-- Create a function to get user's personal gallery entries
CREATE OR REPLACE FUNCTION get_personal_gallery_entries(user_email_param text)
RETURNS TABLE (
  id bigint,
  user_email text,
  species text,
  date date,
  place text,
  length numeric,
  weight numeric,
  bait text,
  conditions text,
  photo_url text,
  notes text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg.id,
    pg.user_email,
    pg.species,
    pg.date,
    pg.place,
    pg.length,
    pg.weight,
    pg.bait,
    pg.conditions,
    pg.photo_url,
    pg.notes,
    pg.created_at,
    pg.updated_at
  FROM personal_gallery pg
  WHERE pg.user_email = user_email_param
  ORDER BY pg.date DESC, pg.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
