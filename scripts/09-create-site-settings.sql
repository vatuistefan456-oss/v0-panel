-- Create site_settings table for customizable banners and configurations
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default VIP banner settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('vip_banner_text', 'DEFAULT VIP - 30% OFF'),
  ('vip_banner_text_color', '#fb923c'),
  ('vip_banner_border_color', '#fb923c'),
  ('vip_banner_bg_color', 'transparent'),
  ('vip_banner_enabled', 'true')
ON CONFLICT (setting_key) DO NOTHING;

-- Add published_to_store column to shop_items
ALTER TABLE shop_items ADD COLUMN IF NOT EXISTS published_to_store BOOLEAN DEFAULT false;

-- Add display_order column for shop items
ALTER TABLE shop_items ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
