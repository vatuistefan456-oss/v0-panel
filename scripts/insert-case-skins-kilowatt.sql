-- Kilowatt Case skins (most recent active case)

-- First, insert the skins
INSERT INTO cs2_skins (skin_key, skin_name, weapon_type, rarity, min_float, max_float, can_be_stattrak, market_value) VALUES
-- Covert (Red) - 0.64%
('awp_chrome_cannon', 'AWP | Chrome Cannon', 'AWP', 'Covert', 0.00, 0.80, true, 45.00),
('m4a1s_black_lotus', 'M4A1-S | Black Lotus', 'M4A1-S', 'Covert', 0.00, 0.80, true, 38.00),

-- Classified (Pink) - 3.2%
('ak47_inheritance', 'AK-47 | Inheritance', 'AK-47', 'Classified', 0.00, 1.00, true, 18.00),
('usp_s_jawbreaker', 'USP-S | Jawbreaker', 'USP-S', 'Classified', 0.00, 0.80, true, 12.00),
('glock_18_block_18', 'Glock-18 | Block-18', 'Glock-18', 'Classified', 0.00, 0.70, true, 10.00),

-- Restricted (Purple) - 15.98%
('m4a4_etch_lord', 'M4A4 | Etch Lord', 'M4A4', 'Restricted', 0.00, 1.00, true, 5.50),
('five_seven_hybrid_hunter', 'Five-SeveN | Hybrid Hunter', 'Five-SeveN', 'Restricted', 0.00, 0.75, true, 4.00),
('mac10_light_box', 'MAC-10 | Light Box', 'MAC-10', 'Restricted', 0.00, 0.80, true, 3.50),
('ssg_08_dezastre', 'SSG 08 | Dezastre', 'SSG 08', 'Restricted', 0.00, 0.70, true, 3.00),
('tec9_slag', 'Tec-9 | Slag', 'Tec-9', 'Restricted', 0.00, 1.00, true, 2.75),

-- Mil-Spec (Blue) - 79.92%
('mp9_featherweight', 'MP9 | Featherweight', 'MP9', 'Mil-Spec', 0.00, 0.70, true, 1.20),
('p250_re_entry', 'P250 | Re-Entry', 'P250', 'Mil-Spec', 0.00, 0.80, true, 1.00),
('dual_berettas_hideout', 'Dual Berettas | Hideout', 'Dual Berettas', 'Mil-Spec', 0.00, 0.75, true, 0.90),
('nova_dark_sigil', 'Nova | Dark Sigil', 'Nova', 'Mil-Spec', 0.00, 0.70, true, 0.85),
('ump45_motorized', 'UMP-45 | Motorized', 'UMP-45', 'Mil-Spec', 0.00, 0.80, true, 0.80),
('xm1014_irezumi', 'XM1014 | Irezumi', 'XM1014', 'Mil-Spec', 0.00, 0.75, true, 0.75),
('zeus_x27_olympus', 'Zeus x27 | Olympus', 'Zeus x27', 'Mil-Spec', 0.00, 1.00, false, 0.50)
ON CONFLICT (skin_key) DO NOTHING;

-- Link skins to Kilowatt Case
INSERT INTO case_contents (case_id, skin_id, drop_rate_percentage)
SELECT 
  (SELECT id FROM cs2_cases WHERE case_key = 'kilowatt_case'),
  id,
  CASE 
    WHEN rarity = 'Covert' THEN 0.32
    WHEN rarity = 'Classified' THEN 1.07
    WHEN rarity = 'Restricted' THEN 3.20
    WHEN rarity = 'Mil-Spec' THEN 11.42
  END
FROM cs2_skins
WHERE skin_key IN (
  'awp_chrome_cannon', 'm4a1s_black_lotus',
  'ak47_inheritance', 'usp_s_jawbreaker', 'glock_18_block_18',
  'm4a4_etch_lord', 'five_seven_hybrid_hunter', 'mac10_light_box', 'ssg_08_dezastre', 'tec9_slag',
  'mp9_featherweight', 'p250_re_entry', 'dual_berettas_hideout', 'nova_dark_sigil', 'ump45_motorized', 'xm1014_irezumi', 'zeus_x27_olympus'
)
ON CONFLICT (case_id, skin_id) DO NOTHING;
