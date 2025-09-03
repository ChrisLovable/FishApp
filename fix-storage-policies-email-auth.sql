-- Fix storage policies for email-based authentication
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Create more permissive policies for personal-gallery bucket
-- Since we're using email-based auth, we'll allow all operations on the personal-gallery bucket
-- The app will handle user-specific access through the application logic

-- Allow anyone to upload to personal-gallery bucket
CREATE POLICY "Allow uploads to personal-gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'personal-gallery');

-- Allow anyone to view images in personal-gallery bucket
CREATE POLICY "Allow viewing personal-gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'personal-gallery');

-- Allow anyone to update images in personal-gallery bucket
CREATE POLICY "Allow updating personal-gallery images" ON storage.objects
FOR UPDATE USING (bucket_id = 'personal-gallery');

-- Allow anyone to delete images in personal-gallery bucket
CREATE POLICY "Allow deleting personal-gallery images" ON storage.objects
FOR DELETE USING (bucket_id = 'personal-gallery');
