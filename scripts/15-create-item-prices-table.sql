-- Create item_prices table to store pricing for CS2 weapon skins
CREATE TABLE IF NOT EXISTS item_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weapon_name VARCHAR(255) NOT NULL,
  skin_name VARCHAR(255) NOT NULL,
  rarity VARCHAR(100),
  normal_min INTEGER NOT NULL DEFAULT 0,
  normal_max INTEGER NOT NULL DEFAULT 0,
  stattrak_min INTEGER NOT NULL DEFAULT 0,
  stattrak_max INTEGER NOT NULL DEFAULT 0,
  souvenir_min INTEGER NOT NULL DEFAULT 0,
  souvenir_max INTEGER NOT NULL DEFAULT 0,
  paint_index VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(weapon_name, skin_name)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_item_prices_weapon_skin ON item_prices(weapon_name, skin_name);
CREATE INDEX IF NOT EXISTS idx_item_prices_rarity ON item_prices(rarity);

-- Add RLS policies
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to item_prices"
  ON item_prices FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert item_prices"
  ON item_prices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update item_prices"
  ON item_prices FOR UPDATE
  TO authenticated
  USING (true);
