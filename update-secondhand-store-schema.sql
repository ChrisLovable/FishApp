-- Update Second Hand Store table schema to include proper timestamps
-- This script updates the existing second_hand_store table

-- First, let's check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS second_hand_store (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    location TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    user_id TEXT NOT NULL,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_second_hand_store_created_at ON second_hand_store(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_category ON second_hand_store(category);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_location ON second_hand_store(location);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_user_id ON second_hand_store(user_id);
CREATE INDEX IF NOT EXISTS idx_second_hand_store_is_sold ON second_hand_store(is_sold);

-- Enable Row Level Security
ALTER TABLE second_hand_store ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to read items
CREATE POLICY "Allow public read access" ON second_hand_store
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own items
CREATE POLICY "Allow users to insert their own items" ON second_hand_store
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own items
CREATE POLICY "Allow users to update their own items" ON second_hand_store
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Allow users to delete their own items
CREATE POLICY "Allow users to delete their own items" ON second_hand_store
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_second_hand_store_updated_at ON second_hand_store;
CREATE TRIGGER update_second_hand_store_updated_at
    BEFORE UPDATE ON second_hand_store
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data with proper timestamps
INSERT INTO second_hand_store (
    title, description, price, category, condition, location,
    contact_name, contact_phone, contact_email, image_urls, user_id, is_sold, created_at
) VALUES 
(
    'Shimano Stradic 3000 Spinning Reel',
    'Excellent condition Shimano Stradic 3000 spinning reel. Used only a few times, comes with original box and papers. Perfect for light to medium fishing.',
    1200.00,
    'Rods & Reels',
    'Excellent',
    'Cape Town',
    'John Smith',
    '082 123 4567',
    'john.smith@email.com',
    ARRAY['/images/placeholder-reel.jpg'],
    'dummy_user_1',
    false,
    NOW() - INTERVAL '30 minutes'
),
(
    'Penn Battle II 4000 Combo',
    'Penn Battle II 4000 spinning reel with 7ft medium action rod. Great for surf fishing and light offshore work. Some minor scratches but fully functional.',
    1800.00,
    'Rods & Reels',
    'Good',
    'Durban',
    'Mike Johnson',
    '083 987 6543',
    'mike.j@email.com',
    ARRAY['/images/placeholder-combo.jpg'],
    'dummy_user_2',
    false,
    NOW() - INTERVAL '1 hour'
),
(
    'Assorted Soft Plastics Lures',
    'Collection of 50+ soft plastic lures including paddle tails, jerkbaits, and worms. Various colors and sizes. Great for bass and saltwater fishing.',
    150.00,
    'Tackle & Lures',
    'Good',
    'Port Elizabeth',
    'Sarah Wilson',
    '084 555 1234',
    'sarah.w@email.com',
    ARRAY['/images/placeholder-lures.jpg'],
    'dummy_user_3',
    false,
    NOW() - INTERVAL '2 hours'
),
(
    'Garmin Striker 4 Fish Finder',
    'Garmin Striker 4 fish finder with GPS. Includes transducer and mounting hardware. Works perfectly, selling due to upgrade.',
    2200.00,
    'Electronics',
    'Excellent',
    'East London',
    'David Brown',
    '082 444 7890',
    'david.brown@email.com',
    ARRAY['/images/placeholder-fishfinder.jpg'],
    'dummy_user_4',
    false,
    NOW() - INTERVAL '1 day'
),
(
         'Fishing Tackle Box with Tools',
     'Large tackle box with multiple compartments, includes pliers, line cutter, hook remover, and various terminal tackle. Everything you need to get started.',
     300.00,
     'Accessories',
     'Good',
     'Knysna',
     'Lisa Davis',
     '083 222 3456',
     'lisa.davis@email.com',
     ARRAY['/images/placeholder-tacklebox.jpg'],
     'dummy_user_5',
     false,
     NOW() - INTERVAL '2 days'
 ),
 (
     'Daiwa Saltist 4000 Spinning Reel',
     'Daiwa Saltist 4000 spinning reel in excellent condition. Perfect for saltwater fishing, comes with spare spool and original box.',
     2500.00,
     'Rods & Reels',
     'Excellent',
     'Hermanus',
     'Peter van der Merwe',
     '082 111 2222',
     'peter.vdm@email.com',
     ARRAY['/images/placeholder-reel.jpg'],
     'dummy_user_6',
     false,
     NOW() - INTERVAL '20 minutes'
 ),
 (
     'Okuma Ceymar C-30 Spinning Reel',
     'Lightweight Okuma Ceymar C-30 spinning reel. Great for freshwater fishing, very smooth drag system.',
     450.00,
     'Rods & Reels',
     'Good',
     'Stellenbosch',
     'Anna Botha',
     '083 333 4444',
     'anna.botha@email.com',
     ARRAY['/images/placeholder-reel.jpg'],
     'dummy_user_7',
     false,
     NOW() - INTERVAL '30 minutes'
 ),
 (
     'Penn Fierce III 5000 Combo',
     'Penn Fierce III 5000 spinning reel with 8ft heavy action rod. Perfect for surf fishing and light offshore work.',
     1500.00,
     'Rods & Reels',
     'Good',
     'Jeffreys Bay',
     'Johan Pretorius',
     '084 555 6666',
     'johan.p@email.com',
     ARRAY['/images/placeholder-combo.jpg'],
     'dummy_user_8',
     false,
     NOW() - INTERVAL '45 minutes'
 ),
 (
     'Assorted Hard Lures Collection',
     'Collection of 30+ hard lures including poppers, stickbaits, and diving lures. Various brands and colors for different species.',
     800.00,
     'Tackle & Lures',
     'Good',
     'Mossel Bay',
     'Carlos Mendez',
     '085 777 8888',
     'carlos.m@email.com',
     ARRAY['/images/placeholder-lures.jpg'],
     'dummy_user_9',
     false,
     NOW() - INTERVAL '1 hour'
 ),
 (
     'Fishing Net with Extendable Handle',
     'Large fishing net with telescopic handle extending to 3 meters. Perfect for landing big fish from shore or boat.',
     350.00,
     'Accessories',
     'Excellent',
     'Plettenberg Bay',
     'Sandra van Rensburg',
     '086 999 0000',
     'sandra.vr@email.com',
     ARRAY['/images/placeholder-net.jpg'],
     'dummy_user_10',
     false,
     NOW() - INTERVAL '1.5 hours'
 ),
 (
     'Lowrance Hook2 4x Fish Finder',
     'Lowrance Hook2 4x fish finder with GPS. Includes transducer and mounting hardware. Great for finding fish.',
     1800.00,
     'Electronics',
     'Good',
     'Knysna',
     'Mark Thompson',
     '087 111 3333',
     'mark.t@email.com',
     ARRAY['/images/placeholder-fishfinder.jpg'],
     'dummy_user_11',
     false,
     NOW() - INTERVAL '2 hours'
 ),
 (
     'Fishing Rod Holders (Set of 4)',
     'Set of 4 adjustable fishing rod holders. Perfect for boat fishing or shore fishing. Made from durable stainless steel.',
     200.00,
     'Accessories',
     'Good',
     'George',
     'Lizzie de Kock',
     '088 222 4444',
     'lizzie.dk@email.com',
     ARRAY['/images/placeholder-holders.jpg'],
     'dummy_user_12',
     false,
     NOW() - INTERVAL '2.5 hours'
 ),
 (
     'Abu Garcia Ambassadeur 6500C',
     'Classic Abu Garcia Ambassadeur 6500C baitcasting reel. Vintage model in excellent working condition.',
     1200.00,
     'Rods & Reels',
     'Good',
     'Oudtshoorn',
     'Frans du Plessis',
     '089 333 5555',
     'frans.dp@email.com',
     ARRAY['/images/placeholder-reel.jpg'],
     'dummy_user_13',
     false,
     NOW() - INTERVAL '3 hours'
 ),
 (
     'Fishing Tackle Bag',
     'Large fishing tackle bag with multiple compartments and waterproof sections. Perfect for organizing all your gear.',
     280.00,
     'Accessories',
     'Good',
     'Beaufort West',
     'Maria Santos',
     '090 444 6666',
     'maria.s@email.com',
     ARRAY['/images/placeholder-bag.jpg'],
     'dummy_user_14',
     false,
     NOW() - INTERVAL '3.5 hours'
 ),
 (
     'Shimano TLD 25/40 Two Speed Reel',
     'Shimano TLD 25/40 two-speed trolling reel. Perfect for big game fishing. Recently serviced and in excellent condition.',
     3200.00,
     'Rods & Reels',
     'Excellent',
     'Cape Agulhas',
     'Hendrik van Wyk',
     '091 555 7777',
     'hendrik.vw@email.com',
     ARRAY['/images/placeholder-reel.jpg'],
     'dummy_user_15',
     false,
     NOW() - INTERVAL '4 hours'
 ),
 (
     'Fishing Line Spooler',
     'Electric fishing line spooler. Makes spooling new line onto reels quick and easy. Includes various adapters.',
     150.00,
     'Accessories',
     'Good',
     'Swellendam',
     'Pieter Botha',
     '092 666 8888',
     'pieter.b@email.com',
     ARRAY['/images/placeholder-spooler.jpg'],
     'dummy_user_16',
     false,
     NOW() - INTERVAL '4.5 hours'
 ),
 (
     'Penn International 50VSW',
     'Penn International 50VSW two-speed reel. Heavy duty reel for big game fishing. Recently overhauled.',
     4500.00,
     'Rods & Reels',
     'Excellent',
     'Gansbaai',
     'Willem de Villiers',
     '093 777 9999',
     'willem.dv@email.com',
     ARRAY['/images/placeholder-reel.jpg'],
     'dummy_user_17',
     false,
     NOW() - INTERVAL '5 hours'
 ),
 (
     'Fishing Scale (Digital)',
     'Digital fishing scale with built-in tape measure. Weighs up to 50kg and measures up to 2 meters. Waterproof design.',
     120.00,
     'Accessories',
     'Good',
     'Worcester',
     'Susan van der Berg',
     '094 888 0000',
     'susan.vdb@email.com',
     ARRAY['/images/placeholder-scale.jpg'],
     'dummy_user_18',
     false,
     NOW() - INTERVAL '5.5 hours'
 ),
 (
     'Fishing Kayak Paddle',
     'Carbon fiber fishing kayak paddle. Lightweight and durable. Perfect for kayak fishing adventures.',
     800.00,
     'Boats & Kayaks',
     'Good',
     'Sedgefield',
     'Andre Nel',
     '095 999 1111',
     'andre.n@email.com',
     ARRAY['/images/placeholder-paddle.jpg'],
     'dummy_user_19',
     false,
     NOW() - INTERVAL '6 hours'
 ),
 (
     'Fishing Cooler Box (50L)',
     'Large 50L fishing cooler box with wheels and telescopic handle. Perfect for keeping your catch fresh.',
     450.00,
     'Accessories',
     'Good',
     'Wilderness',
     'Tanya Steyn',
     '096 000 2222',
     'tanya.s@email.com',
     ARRAY['/images/placeholder-cooler.jpg'],
     'dummy_user_20',
     false,
     NOW() - INTERVAL '6.5 hours'
 ),
 (
     'Fishing Rod Rack (Wall Mount)',
     'Wall-mounted fishing rod rack that holds 8 rods. Made from solid wood with brass hardware.',
     180.00,
     'Accessories',
     'Good',
     'Calitzdorp',
     'Jaco van Zyl',
     '097 111 3333',
     'jaco.vz@email.com',
     ARRAY['/images/placeholder-rack.jpg'],
     'dummy_user_21',
     false,
     NOW() - INTERVAL '7 hours'
 ),
 (
     'Fishing Hook Sharpener',
     'Professional fishing hook sharpener with multiple grits. Keeps your hooks razor sharp for better hookups.',
     80.00,
     'Accessories',
     'Good',
     'Ladismith',
     'Riaan van der Walt',
     '098 222 4444',
     'riaan.vdw@email.com',
     ARRAY['/images/placeholder-sharpener.jpg'],
     'dummy_user_22',
     false,
     NOW() - INTERVAL '7.5 hours'
 ),
 (
     'Fishing Line (Monofilament)',
     'Spool of 20lb monofilament fishing line, 1000 yards. High quality line perfect for various fishing applications.',
     60.00,
     'Tackle & Lures',
     'New',
     'Barrydale',
     'Elize Marais',
     '099 333 5555',
     'elize.m@email.com',
     ARRAY['/images/placeholder-line.jpg'],
     'dummy_user_23',
     false,
     NOW() - INTERVAL '8 hours'
 ),
 (
     'Fishing Pliers Set',
     'Professional fishing pliers set with line cutter, hook remover, and split ring tool. Stainless steel construction.',
     200.00,
     'Accessories',
     'Good',
     'Montagu',
     'Dirk van der Merwe',
     '100 444 6666',
     'dirk.vdm@email.com',
     ARRAY['/images/placeholder-pliers.jpg'],
     'dummy_user_24',
     false,
     NOW() - INTERVAL '8.5 hours'
 ),
 (
     'Fishing Hat with UV Protection',
     'Fishing hat with wide brim and UV protection. Perfect for long days on the water. Adjustable fit.',
     120.00,
     'Accessories',
     'Good',
     'Robertson',
     'Marietjie van Rensburg',
     '101 555 7777',
     'marietjie.vr@email.com',
     ARRAY['/images/placeholder-hat.jpg'],
     'dummy_user_25',
     false,
     NOW() - INTERVAL '9 hours'
 )
 ON CONFLICT DO NOTHING;

-- Create a view for easy querying with formatted timestamps
CREATE OR REPLACE VIEW second_hand_store_with_time AS
SELECT 
    *,
    CASE 
        WHEN created_at > NOW() - INTERVAL '1 hour' THEN 
            EXTRACT(EPOCH FROM (NOW() - created_at))::INTEGER / 60 || 'm ago'
        WHEN created_at > NOW() - INTERVAL '1 day' THEN 
            EXTRACT(EPOCH FROM (NOW() - created_at))::INTEGER / 3600 || 'h ago'
        WHEN created_at > NOW() - INTERVAL '7 days' THEN 
            EXTRACT(EPOCH FROM (NOW() - created_at))::INTEGER / 86400 || 'd ago'
        ELSE 
            TO_CHAR(created_at, 'DD Mon YYYY')
    END as time_ago
FROM second_hand_store
ORDER BY created_at DESC;
