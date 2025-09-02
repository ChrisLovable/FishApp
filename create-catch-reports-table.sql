-- Create catch_reports table for "What's Biting Where?" feature
CREATE TABLE IF NOT EXISTS catch_reports (
  id bigserial primary key,
  species text not null,
  quantity integer not null default 1,
  location_name text not null,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  date_caught timestamp with time zone default now(),
  time_caught time,
  conditions text,
  bait_used text,
  notes text,
  angler_name text not null,
  angler_contact text,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_catch_reports_location ON catch_reports(location_name);
CREATE INDEX IF NOT EXISTS idx_catch_reports_species ON catch_reports(species);
CREATE INDEX IF NOT EXISTS idx_catch_reports_date ON catch_reports(date_caught DESC);
CREATE INDEX IF NOT EXISTS idx_catch_reports_coordinates ON catch_reports(latitude, longitude);

-- Enable RLS (Row Level Security)
ALTER TABLE catch_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can view catch reports" ON catch_reports
  FOR SELECT USING (true);

CREATE POLICY "Public can insert catch reports" ON catch_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update own reports" ON catch_reports
  FOR UPDATE USING (angler_name = current_setting('app.current_user', true));

-- Create function to calculate distance between two points (in kilometers)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 numeric, lon1 numeric, 
  lat2 numeric, lon2 numeric
) RETURNS numeric AS $$
BEGIN
  RETURN 6371 * acos(
    cos(radians(lat1)) * cos(radians(lat2)) * 
    cos(radians(lon2) - radians(lon1)) + 
    sin(radians(lat1)) * sin(radians(lat2))
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get nearby reports
CREATE OR REPLACE FUNCTION get_nearby_reports(
  user_lat numeric, 
  user_lon numeric, 
  radius_km numeric DEFAULT 50
) RETURNS TABLE (
  id bigint,
  species text,
  quantity integer,
  location_name text,
  latitude numeric,
  longitude numeric,
  date_caught timestamp with time zone,
  time_caught time,
  conditions text,
  bait_used text,
  notes text,
  angler_name text,
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
    cr.latitude,
    cr.longitude,
    cr.date_caught,
    cr.time_caught,
    cr.conditions,
    cr.bait_used,
    cr.notes,
    cr.angler_name,
    cr.verified,
    calculate_distance(user_lat, user_lon, cr.latitude, cr.longitude) as distance_km
  FROM catch_reports cr
  WHERE calculate_distance(user_lat, user_lon, cr.latitude, cr.longitude) <= radius_km
  ORDER BY cr.date_caught DESC, distance_km ASC;
END;
$$ LANGUAGE plpgsql;
