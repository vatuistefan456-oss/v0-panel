-- Users table with three-factor authentication (key + username + password)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_key VARCHAR(50) UNIQUE NOT NULL, -- Generated from !key command in CS2
  username VARCHAR(50) UNIQUE NOT NULL, -- Player chosen username
  password_hash TEXT NOT NULL, -- Hashed password
  steam_id VARCHAR(50) UNIQUE NOT NULL, -- Steam ID from game server
  steam_name VARCHAR(100), -- Auto-synced from Steam
  steam_avatar_url TEXT, -- Auto-synced from Steam
  rank VARCHAR(50) DEFAULT 'Unranked',
  vip_tier VARCHAR(20) DEFAULT 'DEFAULT', -- DEFAULT (30% discount) or LEGEND (20% discount)
  credits INTEGER DEFAULT 0,
  real_money_balance DECIMAL(10, 2) DEFAULT 0.00,
  time_played INTEGER DEFAULT 0, -- In minutes
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  headshots INTEGER DEFAULT 0,
  discord_verified BOOLEAN DEFAULT FALSE,
  discord_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL, -- 'skin', 'agent', 'charm', 'case', 'shard', 'voucher'
  item_name VARCHAR(200) NOT NULL,
  item_skin VARCHAR(200), -- Skin name (e.g., 'Hemoglobin', 'In Living Color')
  weapon_type VARCHAR(50), -- 'M4A4', 'AK-47', 'Dual Berettas', etc.
  wear_value DECIMAL(4, 2), -- 0.00 to 1.00
  wear_condition VARCHAR(20), -- 'Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'
  quality VARCHAR(20), -- 'Normal', 'StatTrak™', 'Souvenir'
  price INTEGER NOT NULL, -- Price in credits
  quantity INTEGER DEFAULT 1,
  equipped_t BOOLEAN DEFAULT FALSE, -- Equipped for Terrorist side
  equipped_ct BOOLEAN DEFAULT FALSE, -- Equipped for Counter-Terrorist side
  is_locked BOOLEAN DEFAULT FALSE,
  nametag VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Market listings
CREATE TABLE IF NOT EXISTS market_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  inventory_item_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  tax_percentage DECIMAL(5, 2) DEFAULT 30.00, -- TVA/Tax percentage
  tax_amount INTEGER, -- Calculated tax in credits
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Shop items (cases, credit packages, VIP, etc.)
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- 'credits', 'cases', 'skins', 'vip', 'shards'
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price_credits INTEGER,
  price_real_money DECIMAL(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  image_url TEXT,
  stock INTEGER DEFAULT -1, -- -1 for unlimited
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions history
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'upgrade', 'reward'
  item_name VARCHAR(200),
  amount_credits INTEGER DEFAULT 0,
  amount_real_money DECIMAL(10, 2) DEFAULT 0.00,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin actions log
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  target_user_id UUID REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL, -- 'ban', 'mute', 'kick', 'warn', 'group_change'
  reason TEXT,
  duration INTEGER, -- In minutes, NULL for permanent
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bans table
CREATE TABLE IF NOT EXISTS bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  duration INTEGER, -- In minutes, NULL for permanent
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Mutes table
CREATE TABLE IF NOT EXISTS mutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  duration INTEGER, -- In minutes, NULL for permanent
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Server statistics
CREATE TABLE IF NOT EXISTS server_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_players INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 32,
  current_map VARCHAR(100),
  tick_rate INTEGER DEFAULT 128,
  matches_today INTEGER DEFAULT 0,
  active_matches INTEGER DEFAULT 0,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_unique_key ON users(unique_key);
CREATE INDEX IF NOT EXISTS idx_users_steam_id ON users(steam_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_market_listings_seller_id ON market_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bans_user_id ON bans(user_id);
CREATE INDEX IF NOT EXISTS idx_mutes_user_id ON mutes(user_id);
