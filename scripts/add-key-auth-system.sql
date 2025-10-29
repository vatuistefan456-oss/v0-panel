-- Add columns for key-based authentication if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS unique_key VARCHAR(64) UNIQUE,
ADD COLUMN IF NOT EXISTS key_created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS key_reset_count INTEGER DEFAULT 0;

-- Create index for faster key lookups
CREATE INDEX IF NOT EXISTS idx_users_unique_key ON users(unique_key);

-- Create table for key reset history
CREATE TABLE IF NOT EXISTS key_reset_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  old_key VARCHAR(64),
  new_key VARCHAR(64),
  reset_at TIMESTAMP DEFAULT NOW(),
  reason TEXT
);

-- Create index for key reset history
CREATE INDEX IF NOT EXISTS idx_key_reset_history_user_id ON key_reset_history(user_id);
