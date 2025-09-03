-- Create storage bucket for personal gallery images (safe version)
-- Run this in Supabase SQL Editor

-- Create the personal-gallery storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('personal-gallery', 'personal-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Create storage policies for personal-gallery bucket
-- Users can upload their own images
CREATE POLICY "Users can upload their own images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'personal-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own images
CREATE POLICY "Users can view their own images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'personal-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own images
CREATE POLICY "Users can update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'personal-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'personal-gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
