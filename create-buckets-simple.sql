-- Simple bucket creation for FisApp
-- Run this in Supabase SQL Editor

-- Check existing buckets
SELECT * FROM storage.buckets;

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES
('fish-images', 'fish-images', true),
('distribution-maps', 'distribution-maps', true),
('catch-photos', 'catch-photos', true),
('store-items', 'store-items', true)
ON CONFLICT (id) DO NOTHING;

-- Check buckets again
SELECT * FROM storage.buckets;

-- Create simple public access policies
CREATE POLICY "Public access for fish images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'fish-images');

CREATE POLICY "Public access for distribution maps" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'distribution-maps');

CREATE POLICY "Public access for catch photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'catch-photos');

CREATE POLICY "Public access for store items" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'store-items');
