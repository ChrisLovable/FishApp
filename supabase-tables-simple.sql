-- FisApp Supabase Database Schema - Simple Version
-- Run this script in your Supabase SQL Editor

-- 1. SPECIES TABLE (for fish species data and images)
CREATE TABLE IF NOT EXISTS species (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    english_name TEXT NOT NULL,
    afrikaans_name TEXT,
    scientific_name TEXT,
    slope DECIMAL(10,6),
    intercept DECIMAL(10,6),
    image_filename TEXT,
    distribution_map_filename TEXT,
    fishing_info JSONB,
    regulations JSONB,
    detailed_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PERSONAL GALLERY TABLE (user's private catch log)
CREATE TABLE IF NOT EXISTS personal_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    species TEXT NOT NULL,
    date DATE NOT NULL,
    place TEXT NOT NULL,
    length DECIMAL(8,2),
    weight DECIMAL(8,2),
    bait TEXT,
    conditions TEXT,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PUBLIC GALLERY TABLE (shared catch photos)
CREATE TABLE IF NOT EXISTS public_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    angler_name TEXT NOT NULL,
    species TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    bait TEXT,
    length DECIMAL(8,2),
    weight DECIMAL(8,2),
    weather TEXT,
    tide TEXT,
    moon_phase TEXT,
    notes TEXT,
    image_url TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SECOND HAND STORE TABLE (marketplace items)
CREATE TABLE IF NOT EXISTS second_hand_store (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    location TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    image_urls TEXT[] NOT NULL,
    is_sold BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMMUNITY Q&A TABLE
CREATE TABLE IF NOT EXISTS community_qa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    question TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    answer TEXT,
    answered_by TEXT,
    answered_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FISH IDENTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS fish_identifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    identified_species TEXT,
    confidence_score INTEGER,
    ai_response JSONB,
    user_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_species_english_name ON species(english_name);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_user_id ON personal_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_public_gallery_species ON public_gallery(species);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_category ON second_hand_store(category);

-- Enable RLS
ALTER TABLE personal_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE second_hand_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_identifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now)
CREATE POLICY "Allow all operations on personal_gallery" ON personal_gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations on public_gallery" ON public_gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations on second_hand_store" ON second_hand_store FOR ALL USING (true);
CREATE POLICY "Allow all operations on community_qa" ON community_qa FOR ALL USING (true);
CREATE POLICY "Allow all operations on fish_identifications" ON fish_identifications FOR ALL USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('fish-images', 'fish-images', true),
('distribution-maps', 'distribution-maps', true),
('catch-photos', 'catch-photos', true),
('store-items', 'store-items', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public fish images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'fish-images');
CREATE POLICY "Public distribution maps are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'distribution-maps');
CREATE POLICY "Public catch photos are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'catch-photos');
CREATE POLICY "Public store items are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'store-items');
