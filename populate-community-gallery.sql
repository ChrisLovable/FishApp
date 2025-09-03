-- Script to populate public_gallery table with Community Gallery dummy data
-- Run this in your Supabase SQL Editor

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM public_gallery;

-- Insert 10 comprehensive Community Gallery entries
INSERT INTO public_gallery (
    angler_name, species, date_caught, location, bait_used, length_cm, weight_kg,
    weather_conditions, tide_state, moon_phase, notes, image_url, user_id, created_at
) VALUES 
-- Entry 1: Big Bronze Bream
(
    'Mike Johnson',
    'Bronze bream',
    CURRENT_DATE - INTERVAL '2 days',
    'Durban North Pier',
    'Live prawns',
    65.5,
    4.2,
    'Clear skies, light wind, excellent visibility',
    'Incoming tide',
    'Waxing gibbous',
    'Amazing morning session! This big bream put up an incredible fight for 15 minutes. Caught on live prawns at the North Pier. The fish was released safely after measurement.',
    '/images/gallery/bronze-bream-catch.jpg',
    'user_001',
    NOW() - INTERVAL '2 days'
),
-- Entry 2: Trophy Kob
(
    'Sarah Wilson',
    'Common / Dusky kob',
    CURRENT_DATE - INTERVAL '1 day',
    'Ballito Thompson Bay',
    'Live shad',
    85.0,
    8.5,
    'Overcast, moderate swell, good water clarity',
    'High tide',
    'Full moon',
    'Trophy kob! This beauty weighed in at 8.5kg and measured 85cm. Caught on live shad just before sunrise. The fight lasted 25 minutes - absolutely epic!',
    '/images/gallery/trophy-kob.jpg',
    'user_002',
    NOW() - INTERVAL '1 day'
),
-- Entry 3: Monster Cracker
(
    'David Brown',
    'Black musselcracker',
    CURRENT_DATE - INTERVAL '3 days',
    'Umhlanga Lighthouse',
    'Red bait',
    95.0,
    12.8,
    'Clear conditions, light offshore wind',
    'Outgoing tide',
    'Waning crescent',
    'Monster cracker! This beast weighed 12.8kg and fought like a demon for 35 minutes. Released safely after photos. Best catch of my life!',
    '/images/gallery/monster-cracker.jpg',
    'user_003',
    NOW() - INTERVAL '3 days'
),
-- Entry 4: Shad Bonanza
(
    'Lisa Davis',
    'Elf / Shad',
    CURRENT_DATE - INTERVAL '4 hours',
    'Scottburgh Main Beach',
    'Small spoons',
    45.0,
    1.2,
    'Good swell, clear water, light wind',
    'Low tide',
    'New moon',
    'Shad bonanza! Caught 12 shad in 2 hours. This was the biggest at 45cm. Perfect for bait and eating. Great fun on light tackle!',
    '/images/gallery/shad-bonanza.jpg',
    'user_004',
    NOW() - INTERVAL '4 hours'
),
-- Entry 5: Galjoen Action
(
    'Anna Botha',
    'Galjoen',
    CURRENT_DATE - INTERVAL '1 day',
    'Port Elizabeth Sardinia Bay',
    'Red bait',
    42.5,
    2.1,
    'Clear skies, moderate swell, good visibility',
    'Incoming tide',
    'Waxing quarter',
    'Galjoen action! Caught 4 galjoen today, this was the biggest at 42.5cm. They were hitting red bait hard on the rocky outcrops.',
    '/images/gallery/galjoen-action.jpg',
    'user_005',
    NOW() - INTERVAL '1 day'
),
-- Entry 6: Roman Beauty
(
    'Johan Pretorius',
    'Roman',
    CURRENT_DATE - INTERVAL '2 days',
    'East London Nahoon Beach',
    'Live sand prawns',
    55.0,
    3.8,
    'Light wind, clear water, good conditions',
    'High tide',
    'Waxing gibbous',
    'Beautiful roman! This 55cm specimen was caught on live sand prawns. The colors were absolutely stunning in the morning light.',
    '/images/gallery/roman-beauty.jpg',
    'user_006',
    NOW() - INTERVAL '2 days'
),
-- Entry 7: Blacktail Frenzy
(
    'Hendrik van Wyk',
    'Blacktail',
    CURRENT_DATE - INTERVAL '6 hours',
    'Jeffreys Bay Supertubes',
    'Small spoons',
    38.0,
    1.5,
    'Good swell, clear conditions',
    'Incoming tide',
    'Waning gibbous',
    'Blacktail frenzy! Caught 8 blacktail in 90 minutes. This 38cm fish was the biggest. Great fun on light tackle!',
    '/images/gallery/blacktail-frenzy.jpg',
    'user_007',
    NOW() - INTERVAL '6 hours'
),
-- Entry 8: Steenbras Success
(
    'Maria Ferreira',
    'White steenbras',
    CURRENT_DATE - INTERVAL '1 day',
    'Port Alfred Kelly Beach',
    'Live bloodworm',
    68.0,
    5.2,
    'Moderate wind, good water clarity',
    'Outgoing tide',
    'Full moon',
    'Steenbras success! This 68cm beauty weighed 5.2kg. Caught on live bloodworm during the outgoing tide. Amazing fight!',
    '/images/gallery/steenbras-success.jpg',
    'user_008',
    NOW() - INTERVAL '1 day'
),
-- Entry 9: Stumpnose Session
(
    'Chris de Villiers',
    'Cape stumpnose',
    CURRENT_DATE - INTERVAL '3 hours',
    'Cape Town Muizenberg',
    'Live prawns',
    32.5,
    1.8,
    'Clear skies, light wind, excellent visibility',
    'High tide',
    'Waxing quarter',
    'Stumpnose session! Caught 6 stumpnose today, this 32.5cm fish was the biggest. Great action in the deeper holes.',
    '/images/gallery/stumpnose-session.jpg',
    'user_009',
    NOW() - INTERVAL '3 hours'
),
-- Entry 10: Garrick Glory
(
    'Amanda Botha',
    'Leervis / Garrick',
    CURRENT_DATE - INTERVAL '5 hours',
    'Hermanus Grotto Beach',
    'Live shad',
    92.0,
    15.5,
    'Good swell, clear water, light offshore wind',
    'Incoming tide',
    'Waning crescent',
    'Garrick glory! This monster weighed 15.5kg and measured 92cm. The fight lasted 40 minutes - absolutely epic! Released safely.',
    '/images/gallery/garrick-glory.jpg',
    'user_010',
    NOW() - INTERVAL '5 hours'
);

-- Verify the data was inserted
SELECT COUNT(*) as total_gallery_entries FROM public_gallery;
SELECT species, COUNT(*) as count FROM public_gallery GROUP BY species ORDER BY count DESC;
SELECT location, COUNT(*) as count FROM public_gallery GROUP BY location ORDER BY count DESC;
SELECT 
    DATE(date_caught) as catch_date,
    COUNT(*) as entries_count
FROM public_gallery 
GROUP BY DATE(date_caught) 
ORDER BY catch_date DESC;

-- Show recent entries
SELECT 
    angler_name,
    species,
    location,
    length_cm,
    weight_kg,
    date_caught,
    created_at
FROM public_gallery 
ORDER BY created_at DESC 
LIMIT 10;
