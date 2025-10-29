-- VIP packages/tiers
CREATE TABLE IF NOT EXISTS vip_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  price_credits INTEGER DEFAULT 0,
  price_real_money DECIMAL(10, 2) DEFAULT 0,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Player VIP access
CREATE TABLE IF NOT EXISTS player_vip_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  steam_id VARCHAR(50) NOT NULL,
  package_id UUID REFERENCES vip_packages(id) ON DELETE CASCADE,
  granted_by VARCHAR(50),
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default VIP packages
INSERT INTO vip_packages (package_name, description, duration_days, price_credits, price_real_money, features) VALUES
  ('VIP Bronze', 'Basic VIP access with essential perks', 30, 50000, 4.99, '["Reserved Slot", "Chat Tag", "Join Full Server"]'),
  ('VIP Silver', 'Enhanced VIP with additional benefits', 30, 100000, 9.99, '["Reserved Slot", "Chat Tag", "Join Full Server", "Custom Models", "No Ads"]'),
  ('VIP Gold', 'Premium VIP with exclusive features', 30, 200000, 19.99, '["Reserved Slot", "Chat Tag", "Join Full Server", "Custom Models", "No Ads", "Priority Support", "Exclusive Skins"]'),
  ('VIP Platinum', 'Ultimate VIP experience', 90, 500000, 49.99, '["Reserved Slot", "Chat Tag", "Join Full Server", "Custom Models", "No Ads", "Priority Support", "Exclusive Skins", "Custom Commands", "VIP Lounge Access"]')
ON CONFLICT (package_name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_player_vip_access_steam_id ON player_vip_access(steam_id);
CREATE INDEX IF NOT EXISTS idx_player_vip_access_expires_at ON player_vip_access(expires_at);
CREATE INDEX IF NOT EXISTS idx_player_vip_access_is_active ON player_vip_access(is_active);
