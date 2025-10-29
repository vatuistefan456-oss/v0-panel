-- Comprehensive CS2 Skins Database
-- This script adds a wide variety of CS2 weapon skins across all weapon types

-- Pistols
-- Fixed column names to match schema: price -> price_credits, real_money_price -> price_real_money, removed metadata column
INSERT INTO shop_items (name, description, category, price_credits, price_real_money, image_url, stock, is_active) VALUES
('Desert Eagle | Ocean Drive', 'Covert Pistol Skin', 'skins', 850, 8.50, '/placeholder.svg?height=200&width=300', 10, true),
('USP-S | Kill Confirmed', 'Covert Pistol Skin', 'skins', 1200, 12.00, '/placeholder.svg?height=200&width=300', 5, true),
('Glock-18 | Fade', 'Covert Pistol Skin', 'skins', 950, 9.50, '/placeholder.svg?height=200&width=300', 8, true),
('P250 | Asiimov', 'Classified Pistol Skin', 'skins', 450, 4.50, '/placeholder.svg?height=200&width=300', 15, true),
('Five-SeveN | Hyper Beast', 'Classified Pistol Skin', 'skins', 380, 3.80, '/placeholder.svg?height=200&width=300', 20, true),
('CZ75-Auto | Victoria', 'Classified Pistol Skin', 'skins', 420, 4.20, '/placeholder.svg?height=200&width=300', 12, true),
('Dual Berettas | Hemoglobin', 'Restricted Pistol Skin', 'skins', 280, 2.80, '/placeholder.svg?height=200&width=300', 25, true),
('Tec-9 | Fuel Injector', 'Classified Pistol Skin', 'skins', 390, 3.90, '/placeholder.svg?height=200&width=300', 18, true),
('P2000 | Fire Elemental', 'Classified Pistol Skin', 'skins', 410, 4.10, '/placeholder.svg?height=200&width=300', 14, true),
('R8 Revolver | Fade', 'Covert Pistol Skin', 'skins', 780, 7.80, '/placeholder.svg?height=200&width=300', 6, true);

-- Rifles
INSERT INTO shop_items (name, description, category, price_credits, price_real_money, image_url, stock, is_active) VALUES
('AK-47 | Redline', 'Classified Rifle Skin', 'skins', 650, 6.50, '/placeholder.svg?height=200&width=300', 20, true),
('M4A4 | Howl', 'Contraband Rifle Skin', 'skins', 5000, 50.00, '/placeholder.svg?height=200&width=300', 2, true),
('M4A1-S | Hyper Beast', 'Classified Rifle Skin', 'skins', 720, 7.20, '/placeholder.svg?height=200&width=300', 15, true),
('AWP | Dragon Lore', 'Covert Sniper Skin', 'skins', 8500, 85.00, '/placeholder.svg?height=200&width=300', 1, true),
('AWP | Asiimov', 'Covert Sniper Skin', 'skins', 1800, 18.00, '/placeholder.svg?height=200&width=300', 8, true),
('AK-47 | Fire Serpent', 'Covert Rifle Skin', 'skins', 2200, 22.00, '/placeholder.svg?height=200&width=300', 5, true),
('M4A4 | In Living Color', 'Covert Rifle Skin', 'skins', 540, 5.40, '/placeholder.svg?height=200&width=300', 12, true),
('FAMAS | Roll Cage', 'Restricted Rifle Skin', 'skins', 320, 3.20, '/placeholder.svg?height=200&width=300', 25, true),
('Galil AR | Cerberus', 'Classified Rifle Skin', 'skins', 480, 4.80, '/placeholder.svg?height=200&width=300', 18, true),
('AUG | Chameleon', 'Classified Rifle Skin', 'skins', 420, 4.20, '/placeholder.svg?height=200&width=300', 16, true),
('SG 553 | Integrale', 'Classified Rifle Skin', 'skins', 390, 3.90, '/placeholder.svg?height=200&width=300', 20, true),
('SSG 08 | Blood in the Water', 'Covert Sniper Skin', 'skins', 1100, 11.00, '/placeholder.svg?height=200&width=300', 7, true),
('SCAR-20 | Crimson Web', 'Restricted Sniper Skin', 'skins', 350, 3.50, '/placeholder.svg?height=200&width=300', 22, true),
('G3SG1 | Flux', 'Classified Sniper Skin', 'skins', 410, 4.10, '/placeholder.svg?height=200&width=300', 15, true);

-- SMGs
INSERT INTO shop_items (name, description, category, price_credits, price_real_money, image_url, stock, is_active) VALUES
('MP9 | Starlight Protector', 'Covert SMG Skin', 'skins', 680, 6.80, '/placeholder.svg?height=200&width=300', 10, true),
('MP7 | Fade', 'Classified SMG Skin', 'skins', 520, 5.20, '/placeholder.svg?height=200&width=300', 14, true),
('UMP-45 | Grand Prix', 'Classified SMG Skin', 'skins', 380, 3.80, '/placeholder.svg?height=200&width=300', 18, true),
('P90 | Asiimov', 'Covert SMG Skin', 'skins', 720, 7.20, '/placeholder.svg?height=200&width=300', 12, true),
('PP-Bizon | Judgement of Anubis', 'Covert SMG Skin', 'skins', 590, 5.90, '/placeholder.svg?height=200&width=300', 15, true),
('MAC-10 | Neon Rider', 'Classified SMG Skin', 'skins', 450, 4.50, '/placeholder.svg?height=200&width=300', 16, true);

-- Heavy Weapons
INSERT INTO shop_items (name, description, category, price_credits, price_real_money, image_url, stock, is_active) VALUES
('Nova | Hyper Beast', 'Classified Shotgun Skin', 'skins', 420, 4.20, '/placeholder.svg?height=200&width=300', 18, true),
('XM1014 | Tranquility', 'Classified Shotgun Skin', 'skins', 380, 3.80, '/placeholder.svg?height=200&width=300', 20, true),
('MAG-7 | Bulldozer', 'Restricted Shotgun Skin', 'skins', 290, 2.90, '/placeholder.svg?height=200&width=300', 25, true),
('Sawed-Off | The Kraken', 'Covert Shotgun Skin', 'skins', 650, 6.50, '/placeholder.svg?height=200&width=300', 10, true),
('M249 | Nebula Crusader', 'Covert Machine Gun Skin', 'skins', 580, 5.80, '/placeholder.svg?height=200&width=300', 12, true),
('Negev | Lionfish', 'Classified Machine Gun Skin', 'skins', 410, 4.10, '/placeholder.svg?height=200&width=300', 15, true);

-- Knives
INSERT INTO shop_items (name, description, category, price_credits, price_real_money, image_url, stock, is_active) VALUES
('Karambit | Fade', 'Covert Knife Skin', 'skins', 12000, 120.00, '/placeholder.svg?height=200&width=300', 1, true),
('Butterfly Knife | Doppler', 'Covert Knife Skin', 'skins', 9500, 95.00, '/placeholder.svg?height=200&width=300', 2, true),
('M9 Bayonet | Crimson Web', 'Covert Knife Skin', 'skins', 8800, 88.00, '/placeholder.svg?height=200&width=300', 2, true),
('Bayonet | Tiger Tooth', 'Covert Knife Skin', 'skins', 7200, 72.00, '/placeholder.svg?height=200&width=300', 3, true),
('Flip Knife | Gamma Doppler', 'Covert Knife Skin', 'skins', 6500, 65.00, '/placeholder.svg?height=200&width=300', 3, true),
('Gut Knife | Autotronic', 'Covert Knife Skin', 'skins', 4800, 48.00, '/placeholder.svg?height=200&width=300', 4, true);

-- Gloves
INSERT INTO shop_items (name, description, category, price_credits, price_real_money, image_url, stock, is_active) VALUES
('Sport Gloves | Pandora''s Box', 'Extraordinary Gloves', 'skins', 15000, 150.00, '/placeholder.svg?height=200&width=300', 1, true),
('Driver Gloves | Crimson Weave', 'Extraordinary Gloves', 'skins', 12500, 125.00, '/placeholder.svg?height=200&width=300', 1, true),
('Hand Wraps | Cobalt Skulls', 'Extraordinary Gloves', 'skins', 9800, 98.00, '/placeholder.svg?height=200&width=300', 2, true),
('Specialist Gloves | Fade', 'Extraordinary Gloves', 'skins', 11200, 112.00, '/placeholder.svg?height=200&width=300', 1, true),
('Moto Gloves | Boom!', 'Extraordinary Gloves', 'skins', 8500, 85.00, '/placeholder.svg?height=200&width=300', 2, true);
