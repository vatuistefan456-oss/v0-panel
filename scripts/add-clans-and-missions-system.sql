-- Tabel pentru clan-uri
CREATE TABLE IF NOT EXISTS clans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_name VARCHAR(50) UNIQUE NOT NULL,
  clan_tag VARCHAR(10) UNIQUE NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  total_kills INTEGER DEFAULT 0,
  total_deaths INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  clan_credits INTEGER DEFAULT 0,
  max_members INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel pentru membri clan
CREATE TABLE IF NOT EXISTS clan_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- leader, officer, member
  joined_at TIMESTAMP DEFAULT NOW(),
  contribution_kills INTEGER DEFAULT 0,
  contribution_deaths INTEGER DEFAULT 0,
  contribution_credits INTEGER DEFAULT 0,
  UNIQUE(clan_id, user_id)
);

-- Tabel pentru invitații clan
CREATE TABLE IF NOT EXISTS clan_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  invited_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invited_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, expired
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);

-- Tabel pentru skill-uri clan
CREATE TABLE IF NOT EXISTS clan_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  skill_type VARCHAR(50) NOT NULL, -- health, armor, speed, gravity, damage
  skill_level INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clan_id, skill_type)
);

-- Tabel pentru misiuni
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly
  mission_name VARCHAR(100) NOT NULL,
  description TEXT,
  objective_type VARCHAR(50) NOT NULL, -- kills, headshots, wins, damage, specific_weapon
  objective_weapon VARCHAR(50), -- awp, ak47, m4a1, etc (NULL pentru orice arma)
  objective_target INTEGER NOT NULL, -- numarul de kills/headshots/etc necesar
  reward_credits INTEGER DEFAULT 0,
  reward_experience INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel pentru progresul misiunilor jucatorilor
CREATE TABLE IF NOT EXISTS user_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  reset_at TIMESTAMP, -- cand se reseteaza misiunea (daily/weekly/monthly)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mission_id, reset_at)
);

-- Tabel pentru istoricul misiunilor completate
CREATE TABLE IF NOT EXISTS completed_missions_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  reward_credits INTEGER,
  reward_experience INTEGER
);

-- Indexuri pentru performanta
CREATE INDEX IF NOT EXISTS idx_clan_members_user ON clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_clan ON clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_clan_invites_user ON clan_invites(invited_user_id);
CREATE INDEX IF NOT EXISTS idx_clan_invites_status ON clan_invites(status);
CREATE INDEX IF NOT EXISTS idx_missions_type ON missions(mission_type);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_user ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_mission ON user_mission_progress(mission_id);

-- Inserare misiuni default
INSERT INTO missions (mission_type, mission_name, description, objective_type, objective_weapon, objective_target, reward_credits, reward_experience) VALUES
-- Daily Missions
('daily', '10 Kills cu AWP', 'Obtine 10 eliminari folosind AWP', 'kills', 'awp', 10, 500, 100),
('daily', '40 Headshots cu AK-47', 'Obtine 40 headshots folosind AK-47', 'headshots', 'ak47', 40, 800, 150),
('daily', '20 Kills cu M4A4', 'Obtine 20 eliminari folosind M4A4', 'kills', 'm4a1', 20, 600, 120),
('daily', '5 Victorii', 'Castiga 5 meciuri', 'wins', NULL, 5, 1000, 200),
('daily', '50 Kills Total', 'Obtine 50 eliminari cu orice arma', 'kills', NULL, 50, 700, 140),

-- Weekly Missions
('weekly', '100 Kills cu AWP', 'Obtine 100 eliminari folosind AWP', 'kills', 'awp', 100, 3000, 500),
('weekly', '200 Headshots Total', 'Obtine 200 headshots cu orice arma', 'headshots', NULL, 200, 4000, 700),
('weekly', '50 Kills cu Desert Eagle', 'Obtine 50 eliminari folosind Desert Eagle', 'kills', 'deagle', 50, 2500, 450),
('weekly', '20 Victorii', 'Castiga 20 meciuri', 'wins', NULL, 20, 5000, 800),
('weekly', '300 Kills Total', 'Obtine 300 eliminari cu orice arma', 'kills', NULL, 300, 3500, 600),

-- Monthly Missions
('monthly', '500 Kills cu AWP', 'Obtine 500 eliminari folosind AWP', 'kills', 'awp', 500, 15000, 2000),
('monthly', '1000 Headshots Total', 'Obtine 1000 headshots cu orice arma', 'headshots', NULL, 1000, 20000, 3000),
('monthly', '100 Victorii', 'Castiga 100 meciuri', 'wins', NULL, 100, 25000, 4000),
('monthly', '1500 Kills Total', 'Obtine 1500 eliminari cu orice arma', 'kills', NULL, 1500, 18000, 2500),
('monthly', '200 Kills cu Knife', 'Obtine 200 eliminari cu cutitul', 'kills', 'knife', 200, 30000, 5000);
