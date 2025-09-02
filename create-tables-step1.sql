-- Step 1: Create basic tables only
-- Run this in Supabase SQL Editor

-- 1. SPECIES TABLE
CREATE TABLE IF NOT EXISTS species (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    english_name TEXT NOT NULL,
    afrikaans_name TEXT,
    scientific_name TEXT,
    slope DECIMAL(10,6),
    intercept DECIMAL(10,6),
    image_filename TEXT,
    distribution_map_filename TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PERSONAL GALLERY TABLE
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

-- 3. PUBLIC GALLERY TABLE
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

-- 4. SECOND HAND STORE TABLE
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
