-- Monthly leaderboard snapshots
CREATE TABLE IF NOT EXISTS monthly_leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM' (e.g., '2025-10')
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  headshots INTEGER DEFAULT 0,
  mvp INTEGER DEFAULT 0,
  time_played INTEGER DEFAULT 0, -- In minutes
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Leaderboard settings (admin configurable)
CREATE TABLE IF NOT EXISTS leaderboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  top_players_count INTEGER DEFAULT 10, -- How many top players to display
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO leaderboard_settings (top_players_count) VALUES (10)
ON CONFLICT DO NOTHING;

-- Add MVP column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS mvp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS matches_played INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS wins INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_leaderboards_month ON monthly_leaderboards(month);
CREATE INDEX IF NOT EXISTS idx_monthly_leaderboards_user_id ON monthly_leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_leaderboards_kills ON monthly_leaderboards(kills DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_leaderboards_deaths ON monthly_leaderboards(deaths DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_leaderboards_headshots ON monthly_leaderboards(headshots DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_leaderboards_mvp ON monthly_leaderboards(mvp DESC);
