-- Admin warnings system
CREATE TABLE IF NOT EXISTS admin_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  warning_message TEXT NOT NULL,
  issued_by_steam_id VARCHAR(50) NOT NULL,
  issued_by_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin activity tracking
CREATE TABLE IF NOT EXISTS admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  day_1_hours DECIMAL(5,2) DEFAULT 0,
  day_1_actions VARCHAR(20) DEFAULT '0/0/0',
  day_2_hours DECIMAL(5,2) DEFAULT 0,
  day_2_actions VARCHAR(20) DEFAULT '0/0/0',
  day_3_hours DECIMAL(5,2) DEFAULT 0,
  day_3_actions VARCHAR(20) DEFAULT '0/0/0',
  day_4_hours DECIMAL(5,2) DEFAULT 0,
  day_4_actions VARCHAR(20) DEFAULT '0/0/0',
  last_connection TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(admin_id, week_start)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_warnings_admin_id ON admin_warnings(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_week ON admin_activity(week_start);
