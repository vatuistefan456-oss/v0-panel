-- Create table for navigation order customization
CREATE TABLE IF NOT EXISTS navigation_order (
  id SERIAL PRIMARY KEY,
  item_key VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for shop item order customization
CREATE TABLE IF NOT EXISTS shop_item_order (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(item_id)
);

-- Insert default navigation order
INSERT INTO navigation_order (item_key, display_order) VALUES
  ('dashboard', 1),
  ('shop', 2),
  ('inventory', 3),
  ('market', 4),
  ('ranks', 5),
  ('profile', 6),
  ('moderation', 7),
  ('players', 8),
  ('admins', 9),
  ('manage_admins_vips', 10),
  ('settings', 11),
  ('search', 12)
ON CONFLICT (item_key) DO NOTHING;
