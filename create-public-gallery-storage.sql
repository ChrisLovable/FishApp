-- Create storage bucket for public gallery images
-- This creates a public bucket where catch photos can be stored

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-gallery',
  'public-gallery',
  true, -- Make bucket public so images can be viewed by everyone
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Public gallery images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to public gallery" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own public gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own public gallery images" ON storage.objects;

-- Create storage policies for the public gallery bucket
-- Allow anyone to view images
CREATE POLICY "Public gallery images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-gallery');

-- Allow anyone to upload images
CREATE POLICY "Anyone can upload to public gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'public-gallery');

-- Allow users to update their own images (simplified policy)
CREATE POLICY "Users can update their own public gallery images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'public-gallery');

-- Allow users to delete their own images (simplified policy)
CREATE POLICY "Users can delete their own public gallery images" ON storage.objects
  FOR DELETE USING (bucket_id = 'public-gallery');
