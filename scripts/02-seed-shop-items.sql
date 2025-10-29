-- Seed shop items with credits, cases, VIP packages, and shards

-- Credit Packages
INSERT INTO shop_items (category, name, description, price_real_money, discount_percentage, is_active) VALUES
('credits', '1000 Credits', 'Small credit package for quick purchases', 4.99, 0, true),
('credits', '2500 Credits', 'Medium credit package with 5% bonus', 9.99, 0, true),
('credits', '5000 Credits', 'Large credit package with 10% bonus', 19.99, 0, true),
('credits', '10000 Credits', 'Mega credit package with 15% bonus', 34.99, 0, true);

-- Cases
INSERT INTO shop_items (category, name, description, price_credits, discount_percentage, stock, is_active) VALUES
('cases', 'Bronze Case', 'Contains common to rare skins', 500, 0, -1, true),
('cases', 'Silver Case', 'Contains rare to epic skins', 1000, 0, -1, true),
('cases', 'Gold Case', 'Contains epic to legendary skins', 2500, 0, -1, true),
('cases', 'Diamond Case', 'Guaranteed legendary skin', 5000, 0, -1, true);

-- VIP Packages
INSERT INTO shop_items (category, name, description, price_real_money, discount_percentage, is_active) VALUES
('vip', 'VIP DEFAULT (30 Days)', 'Get 30% discount on all purchases for 30 days', 9.99, 0, true),
('vip', 'VIP DEFAULT (90 Days)', 'Get 30% discount on all purchases for 90 days', 24.99, 10, true),
('vip', 'VIP LEGEND (30 Days)', 'Get 20% discount + exclusive perks for 30 days', 19.99, 0, true),
('vip', 'VIP LEGEND (90 Days)', 'Get 20% discount + exclusive perks for 90 days', 49.99, 10, true);

-- Shards (for upgrading items)
INSERT INTO shop_items (category, name, description, price_credits, price_real_money, discount_percentage, is_active) VALUES
('shards', '10 Upgrade Shards', 'Use shards to upgrade your items', 1000, 2.99, 0, true),
('shards', '25 Upgrade Shards', 'Use shards to upgrade your items', 2000, 5.99, 5, true),
('shards', '50 Upgrade Shards', 'Use shards to upgrade your items', 3500, 9.99, 10, true),
('shards', '100 Upgrade Shards', 'Use shards to upgrade your items', 6000, 16.99, 15, true);
