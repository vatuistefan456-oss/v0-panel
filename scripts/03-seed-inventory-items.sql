-- Seed some sample inventory items for testing
-- Note: Replace the user_id with actual user IDs from your users table

-- Sample skins
INSERT INTO inventory (user_id, item_type, item_name, item_skin, weapon_type, wear_value, wear_condition, quality, price, quantity) VALUES
((SELECT id FROM users LIMIT 1), 'skin', 'M4A4', 'Howl', 'M4A4', 0.03, 'Factory New', 'Normal', 15000, 1),
((SELECT id FROM users LIMIT 1), 'skin', 'AK-47', 'Fire Serpent', 'AK-47', 0.15, 'Minimal Wear', 'StatTrak™', 12000, 1),
((SELECT id FROM users LIMIT 1), 'skin', 'AWP', 'Dragon Lore', 'AWP', 0.07, 'Factory New', 'Souvenir', 25000, 1),
((SELECT id FROM users LIMIT 1), 'skin', 'Desert Eagle', 'Blaze', 'Desert Eagle', 0.01, 'Factory New', 'Normal', 3500, 1),
((SELECT id FROM users LIMIT 1), 'skin', 'Glock-18', 'Fade', 'Glock-18', 0.02, 'Factory New', 'Normal', 2800, 1);

-- Sample cases
INSERT INTO inventory (user_id, item_type, item_name, weapon_type, price, quantity) VALUES
((SELECT id FROM users LIMIT 1), 'case', 'Bronze Case', NULL, 500, 3),
((SELECT id FROM users LIMIT 1), 'case', 'Silver Case', NULL, 1000, 2),
((SELECT id FROM users LIMIT 1), 'case', 'Gold Case', NULL, 2500, 1);

-- Sample shards
INSERT INTO inventory (user_id, item_type, item_name, weapon_type, price, quantity) VALUES
((SELECT id FROM users LIMIT 1), 'shard', 'Upgrade Shard', NULL, 100, 25);
