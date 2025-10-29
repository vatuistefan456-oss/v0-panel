-- Create CS2 Cases System Tables
-- This script creates only the tables needed for the CS2 cases opening system

-- CS2 Cases catalog
CREATE TABLE IF NOT EXISTS cs2_cases (
  id BIGSERIAL PRIMARY KEY,
  case_key VARCHAR(100) UNIQUE NOT NULL,
  case_name VARCHAR(200) NOT NULL,
  case_image_url TEXT,
  price_credits INTEGER NOT NULL DEFAULT 1000,
  rarity VARCHAR(50),
  release_date DATE,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- CS2 Skins catalog
CREATE TABLE IF NOT EXISTS cs2_skins (
  id BIGSERIAL PRIMARY KEY,
  skin_key VARCHAR(200) UNIQUE NOT NULL,
  skin_name VARCHAR(300) NOT NULL,
  weapon_type VARCHAR(100),
  skin_image_url TEXT,
  rarity VARCHAR(50), -- 'Consumer', 'Industrial', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Rare'
  min_float DECIMAL(10, 8) DEFAULT 0.00000000,
  max_float DECIMAL(10, 8) DEFAULT 1.00000000,
  can_be_stattrak BOOLEAN DEFAULT true,
  market_value DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Case contents (which skins are in which cases)
CREATE TABLE IF NOT EXISTS case_contents (
  id BIGSERIAL PRIMARY KEY,
  case_id BIGINT REFERENCES cs2_cases(id) ON DELETE CASCADE,
  skin_id BIGINT REFERENCES cs2_skins(id) ON DELETE CASCADE,
  drop_rate_percentage DECIMAL(5, 2) NOT NULL,
  UNIQUE(case_id, skin_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cs2_cases_active ON cs2_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_cs2_cases_key ON cs2_cases(case_key);
CREATE INDEX IF NOT EXISTS idx_cs2_skins_rarity ON cs2_skins(rarity);
CREATE INDEX IF NOT EXISTS idx_cs2_skins_key ON cs2_skins(skin_key);
CREATE INDEX IF NOT EXISTS idx_case_contents_case_id ON case_contents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_contents_skin_id ON case_contents(skin_id);
