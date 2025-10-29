-- Seed monthly leaderboard data for October 2025
INSERT INTO monthly_leaderboards (user_id, month, kills, deaths, headshots, mvp, time_played, matches_played, wins)
SELECT 
  id,
  '2025-10',
  kills,
  deaths,
  headshots,
  mvp,
  time_played,
  matches_played,
  wins
FROM users
WHERE id IN (SELECT id FROM users LIMIT 50)
ON CONFLICT (user_id, month) DO NOTHING;

-- Update users table with MVP and matches data
UPDATE users SET mvp = FLOOR(RANDOM() * 500 + 100)::INTEGER WHERE mvp = 0;
UPDATE users SET matches_played = FLOOR(RANDOM() * 1000 + 200)::INTEGER WHERE matches_played = 0;
UPDATE users SET wins = FLOOR(matches_played * (0.4 + RANDOM() * 0.2))::INTEGER WHERE wins = 0;
