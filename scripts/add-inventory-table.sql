-- Create inventory table for storing player items
CREATE TABLE IF NOT EXISTS player_inventory (
  id BIGSERIAL PRIMARY KEY,
  steam_id VARCHAR(20) NOT NULL,
  item_type VARCHAR(50) NOT NULL, -- 'case', 'skin', 'agent', 'charm'
  item_id BIGINT NOT NULL,
  item_name VARCHAR(300) NOT NULL,
  item_key VARCHAR(200),
  rarity VARCHAR(50),
  float_value DECIMAL(10, 8),
  wear VARCHAR(50), -- 'Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'
  is_stattrak BOOLEAN DEFAULT FALSE,
  is_equipped BOOLEAN DEFAULT FALSE,
  acquired_from VARCHAR(100) DEFAULT 'purchase', -- 'purchase', 'case_opening', 'admin_gift', 'mission_reward'
  acquired_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- for temporary items (rentals)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_player_inventory_steam_id ON player_inventory(steam_id);
CREATE INDEX IF NOT EXISTS idx_player_inventory_item_type ON player_inventory(item_type);
CREATE INDEX IF NOT EXISTS idx_player_inventory_acquired_at ON player_inventory(acquired_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_inventory_is_equipped ON player_inventory(is_equipped);
