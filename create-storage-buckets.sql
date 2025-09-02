-- Create storage buckets for FisApp
-- Run this in Supabase SQL Editor

-- First, let's check if buckets already exist
SELECT * FROM storage.buckets WHERE id IN ('fish-images', 'distribution-maps', 'catch-photos', 'store-items');

-- Create the buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('fish-images', 'fish-images', true),
('distribution-maps', 'distribution-maps', true),
('catch-photos', 'catch-photos', true),
('store-items', 'store-items', true)
ON CONFLICT (id) DO NOTHING;

-- Verify buckets were created
SELECT * FROM storage.buckets WHERE id IN ('fish-images', 'distribution-maps', 'catch-photos', 'store-items');
