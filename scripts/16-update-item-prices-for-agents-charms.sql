-- Update item_prices table to support agents and charms
-- Agents and charms only have "Normal" pricing (no StatTrak/Souvenir)

ALTER TABLE item_prices 
ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) DEFAULT 'skin';

-- Add index for item type
CREATE INDEX IF NOT EXISTS idx_item_prices_item_type ON item_prices(item_type);

-- Update RLS policies to include item_type
DROP POLICY IF EXISTS "Allow public read access to item_prices" ON item_prices;
CREATE POLICY "Allow public read access to item_prices"
  ON item_prices FOR SELECT
  TO public
  USING (true);
