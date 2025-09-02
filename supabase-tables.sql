-- FisApp Supabase Database Schema
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
    fishing_info JSONB, -- Array of fishing information
    regulations JSONB, -- Size limits, bag limits, closed seasons
    detailed_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PERSONAL GALLERY TABLE (user's private catch log)
CREATE TABLE IF NOT EXISTS personal_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Simple user identifier for now
    species TEXT NOT NULL,
    date DATE NOT NULL,
    place TEXT NOT NULL,
    length DECIMAL(8,2), -- in cm
    weight DECIMAL(8,2), -- in kg
    bait TEXT,
    conditions TEXT,
    photo_url TEXT, -- URL to stored image
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
    length DECIMAL(8,2), -- in cm
    weight DECIMAL(8,2), -- in kg
    weather TEXT,
    tide TEXT,
    moon_phase TEXT,
    notes TEXT,
    image_url TEXT NOT NULL, -- URL to stored image
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
    image_urls TEXT[] NOT NULL, -- Array of image URLs
    is_sold BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMMUNITY Q&A TABLE (for future "Ask a Question" feature)
CREATE TABLE IF NOT EXISTS community_qa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    question TEXT NOT NULL,
    category TEXT NOT NULL, -- 'fish_identification', 'fishing_techniques', 'equipment', 'locations', 'general'
    tags TEXT[], -- Array of tags for better search
    answer TEXT,
    answered_by TEXT, -- User ID of who answered
    answered_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FISH IDENTIFICATIONS TABLE (for tracking AI identifications)
CREATE TABLE IF NOT EXISTS fish_identifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    identified_species TEXT,
    confidence_score INTEGER, -- 0-100
    ai_response JSONB, -- Full AI response for debugging
    user_feedback TEXT, -- 'correct', 'incorrect', 'unsure'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_species_english_name ON species(english_name);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_user_id ON personal_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_gallery_date ON personal_gallery(date);
CREATE INDEX IF NOT EXISTS idx_public_gallery_species ON public_gallery(species);
CREATE INDEX IF NOT EXISTS idx_public_gallery_date ON public_gallery(date);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_category ON second_hand_store(category);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_location ON second_hand_store(location);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_is_sold ON second_hand_store(is_sold);
CREATE INDEX IF NOT EXISTS idx_community_qa_category ON community_qa(category);
CREATE INDEX IF NOT EXISTS idx_community_qa_is_resolved ON community_qa(is_resolved);
CREATE INDEX IF NOT EXISTS idx_fish_identifications_user_id ON fish_identifications(user_id);

-- Enable Row Level Security (RLS) for user data
ALTER TABLE personal_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE second_hand_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish_identifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on personal_gallery" ON personal_gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations on public_gallery" ON public_gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations on second_hand_store" ON second_hand_store FOR ALL USING (true);
CREATE POLICY "Allow all operations on community_qa" ON community_qa FOR ALL USING (true);
CREATE POLICY "Allow all operations on fish_identifications" ON fish_identifications FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON species FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_gallery_updated_at BEFORE UPDATE ON personal_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_public_gallery_updated_at BEFORE UPDATE ON public_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_second_hand_store_updated_at BEFORE UPDATE ON second_hand_store FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_qa_updated_at BEFORE UPDATE ON community_qa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample species data (you can replace this with your actual data)
INSERT INTO species (english_name, afrikaans_name, scientific_name, slope, intercept, image_filename, distribution_map_filename) VALUES
('Bronze bream', 'Bronze brasem', 'Pachymetopon grande', 2.8, 0.12, 'bronze-bream.jpg', 'bream-distribution.jpg'),
('Common kob', 'Kabeljou', 'Argyrosomus japonicus', 3.1, 0.15, 'common-kob.jpg', 'kob-distribution.jpg'),
('Dusky kob', 'Donskabeljou', 'Argyrosomus coronus', 3.0, 0.14, 'dusky-kob.jpg', 'kob-distribution.jpg'),
('Eagle ray', 'Arendrog', 'Myliobatis aquila', 2.9, 0.18, 'eagle-ray.jpg', 'ray-distribution.jpg'),
('Galjoen', 'Galjoen', 'Dichistius capensis', 2.7, 0.11, 'galjoen.jpg', 'galjoen-distribution.jpg')
ON CONFLICT (english_name) DO NOTHING;

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES
('fish-images', 'fish-images', true),
('distribution-maps', 'distribution-maps', true),
('catch-photos', 'catch-photos', true),
('store-items', 'store-items', true);

-- Set up storage policies
CREATE POLICY "Public fish images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'fish-images');
CREATE POLICY "Public distribution maps are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'distribution-maps');
CREATE POLICY "Public catch photos are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'catch-photos');
CREATE POLICY "Public store items are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'store-items');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload catch photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'catch-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload store items" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-items' AND auth.role() = 'authenticated');

COMMENT ON TABLE species IS 'Fish species data with identification parameters and images';
COMMENT ON TABLE personal_gallery IS 'Private catch log for individual users';
COMMENT ON TABLE public_gallery IS 'Public shared catch photos and details';
COMMENT ON TABLE second_hand_store IS 'Marketplace for fishing equipment and items';
COMMENT ON TABLE community_qa IS 'Community questions and answers about fishing';
COMMENT ON TABLE fish_identifications IS 'AI fish identification results and user feedback';
