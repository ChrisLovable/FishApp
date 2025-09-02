-- Fix storage policies for FisApp
-- Run this in Supabase SQL Editor

-- First, let's check what storage buckets exist
    SELECT * FROM storage.buckets;

    -- Drop existing policies if they exist (using correct syntax)
    DROP POLICY IF EXISTS "Public fish images are viewable by everyone" ON storage.objects;
    DROP POLICY IF EXISTS "Public distribution maps are viewable by everyone" ON storage.objects;
    DROP POLICY IF EXISTS "Public catch photos are viewable by everyone" ON storage.objects;
    DROP POLICY IF EXISTS "Public store items are viewable by everyone" ON storage.objects;

    -- Create new storage policies for public access
    CREATE POLICY "Public fish images are viewable by everyone" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'fish-images');

    CREATE POLICY "Public distribution maps are viewable by everyone" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'distribution-maps');

    CREATE POLICY "Public catch photos are viewable by everyone" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'catch-photos');

    CREATE POLICY "Public store items are viewable by everyone" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'store-items');

    -- Check what policies exist now
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage';
