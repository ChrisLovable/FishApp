-- Fix public gallery storage bucket to support HEIC images
-- This updates the allowed MIME types to include HEIC format

-- Update the storage bucket to include HEIC support
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
WHERE id = 'public-gallery';

-- If the bucket doesn't exist, create it with HEIC support
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-gallery',
  'public-gallery',
  true, -- Make bucket public so images can be viewed by everyone
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
) ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

-- Verify the update
SELECT id, name, allowed_mime_types FROM storage.buckets WHERE id = 'public-gallery';
