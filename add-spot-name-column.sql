-- Add spot_name column to catch_reports table
-- This migration adds the spot_name column that was added to the form
-- Also ensures all columns (notes, geolocation, angler_contact) are properly included

-- Add the spot_name column
ALTER TABLE catch_reports 
ADD COLUMN IF NOT EXISTS spot_name text;

-- Ensure all required columns exist (these should already exist but adding for safety)
ALTER TABLE catch_reports 
ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE catch_reports 
ADD COLUMN IF NOT EXISTS latitude numeric(10, 8);

ALTER TABLE catch_reports 
ADD COLUMN IF NOT EXISTS longitude numeric(11, 8);

ALTER TABLE catch_reports 
ADD COLUMN IF NOT EXISTS angler_contact text;

-- Drop the existing function first (since return type changed)
DROP FUNCTION IF EXISTS get_nearby_reports(numeric, numeric, numeric);

-- Update the get_nearby_reports function to include all columns
CREATE OR REPLACE FUNCTION get_nearby_reports(
  user_lat numeric, 
  user_lon numeric, 
  radius_km numeric DEFAULT 50
) RETURNS TABLE (
  id bigint,
  species text,
  quantity integer,
  location_name text,
  spot_name text,
  latitude numeric,
  longitude numeric,
  date_caught timestamp with time zone,
  time_caught time,
  conditions text,
  bait_used text,
  notes text,
  angler_name text,
  angler_contact text,
  verified boolean,
  distance_km numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id,
    cr.species,
    cr.quantity,
    cr.location_name,
    cr.spot_name,
    cr.latitude,
    cr.longitude,
    cr.date_caught,
    cr.time_caught,
    cr.conditions,
    cr.bait_used,
    cr.notes,
    cr.angler_name,
    cr.angler_contact,
    cr.verified,
    calculate_distance(user_lat, user_lon, cr.latitude, cr.longitude) as distance_km
  FROM catch_reports cr
  WHERE calculate_distance(user_lat, user_lon, cr.latitude, cr.longitude) <= radius_km
  ORDER BY cr.date_caught DESC, distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Add comments to the columns
COMMENT ON COLUMN catch_reports.spot_name IS 'Specific fishing spot name (e.g., Grotto Beach, Die Plaat)';
COMMENT ON COLUMN catch_reports.notes IS 'Additional notes about the catch, conditions, or fishing tips';
COMMENT ON COLUMN catch_reports.latitude IS 'GPS latitude coordinate for exact location';
COMMENT ON COLUMN catch_reports.longitude IS 'GPS longitude coordinate for exact location';
COMMENT ON COLUMN catch_reports.angler_contact IS 'Angler contact information (WhatsApp, email, social media)';
