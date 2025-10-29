-- Function to increment clan credits safely
CREATE OR REPLACE FUNCTION increment_clan_credits(
  p_clan_id UUID,
  p_amount INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE clans
  SET clan_credits = COALESCE(clan_credits, 0) + p_amount,
      updated_at = NOW()
  WHERE id = p_clan_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add clan experience
CREATE OR REPLACE FUNCTION add_clan_experience(
  p_clan_id UUID,
  p_experience INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_current_level INTEGER;
  v_current_exp INTEGER;
  v_new_exp INTEGER;
  v_exp_needed INTEGER;
BEGIN
  SELECT level, experience INTO v_current_level, v_current_exp
  FROM clans
  WHERE id = p_clan_id;
  
  v_new_exp := v_current_exp + p_experience;
  v_exp_needed := v_current_level * 1000;
  
  -- Level up if enough experience
  WHILE v_new_exp >= v_exp_needed LOOP
    v_current_level := v_current_level + 1;
    v_new_exp := v_new_exp - v_exp_needed;
    v_exp_needed := v_current_level * 1000;
  END LOOP;
  
  UPDATE clans
  SET level = v_current_level,
      experience = v_new_exp,
      updated_at = NOW()
  WHERE id = p_clan_id;
END;
$$ LANGUAGE plpgsql;
