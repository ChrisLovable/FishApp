-- Fix all storage buckets to support HEIC images
-- This updates all storage buckets to include HEIC format support

-- Update public-gallery bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']
WHERE id = 'public-gallery';

-- Update catch-photos bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']
WHERE id = 'catch-photos';

-- Update fish-images bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']
WHERE id = 'fish-images';

-- Update distribution-maps bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']
WHERE id = 'distribution-maps';

-- Update store-items bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']
WHERE id = 'store-items';

-- If any buckets don't exist, create them with HEIC support
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('public-gallery', 'public-gallery', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']),
  ('catch-photos', 'catch-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']),
  ('fish-images', 'fish-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']),
  ('distribution-maps', 'distribution-maps', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp']),
  ('store-items', 'store-items', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp'])
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'image/tiff', 'image/bmp'];

-- Verify all buckets have HEIC support
SELECT id, name, allowed_mime_types FROM storage.buckets WHERE id IN ('public-gallery', 'catch-photos', 'fish-images', 'distribution-maps', 'store-items');
