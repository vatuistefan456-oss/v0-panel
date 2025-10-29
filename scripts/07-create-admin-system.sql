-- Admin system configuration
CREATE TABLE IF NOT EXISTS admin_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_admin_steam_id VARCHAR(50) UNIQUE,
  site_name VARCHAR(100) DEFAULT 'CS2 Admin Panel',
  is_configured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin permission flags
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name VARCHAR(50) UNIQUE NOT NULL,
  flag_code VARCHAR(10) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin groups
CREATE TABLE IF NOT EXISTS admin_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  immunity_level INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin group permissions (many-to-many)
CREATE TABLE IF NOT EXISTS admin_group_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES admin_groups(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, permission_id)
);

-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  steam_id VARCHAR(50) UNIQUE NOT NULL,
  steam_name VARCHAR(100),
  group_id UUID REFERENCES admin_groups(id) ON DELETE SET NULL,
  is_root BOOLEAN DEFAULT FALSE,
  immunity_level INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin individual permissions (overrides)
CREATE TABLE IF NOT EXISTS admin_individual_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(admin_id, permission_id)
);

-- Insert default permission flags
INSERT INTO admin_permissions (flag_name, flag_code, description) VALUES
  ('Root Access', 'z', 'Full root access to all features'),
  ('Ban Players', 'b', 'Can ban players from the server'),
  ('Kick Players', 'k', 'Can kick players from the server'),
  ('Mute Players', 'm', 'Can mute players'),
  ('Change Map', 'c', 'Can change server map'),
  ('Manage Admins', 'a', 'Can add/remove admins'),
  ('View Logs', 'l', 'Can view admin action logs'),
  ('Manage Shop', 's', 'Can manage shop items'),
  ('Manage Players', 'p', 'Can manage player accounts and balances'),
  ('Server Config', 'g', 'Can configure server settings'),
  ('RCON Access', 'r', 'Can execute RCON commands'),
  ('Immunity', 'i', 'Cannot be targeted by lower immunity admins')
ON CONFLICT (flag_code) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admins_steam_id ON admins(steam_id);
CREATE INDEX IF NOT EXISTS idx_admin_group_permissions_group_id ON admin_group_permissions(group_id);
CREATE INDEX IF NOT EXISTS idx_admin_individual_permissions_admin_id ON admin_individual_permissions(admin_id);
