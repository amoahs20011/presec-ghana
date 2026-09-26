-- ===================================================================
-- PRESEC GHANA — Seed: All 16 Regions of Ghana
-- ===================================================================
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- ===================================================================

INSERT INTO regions (name, code) VALUES
  ('Ahafo',          'AH'),
  ('Ashanti',        'AS'),
  ('Bono',           'BO'),
  ('Bono East',      'BE'),
  ('Central',        'CE'),
  ('Eastern',        'EA'),
  ('Greater Accra',  'GA'),
  ('North East',     'NE'),
  ('Northern',       'NO'),
  ('Oti',            'OT'),
  ('Savannah',       'SA'),
  ('Upper East',     'UE'),
  ('Upper West',     'UW'),
  ('Volta',          'VO'),
  ('Western',        'WE'),
  ('Western North',  'WN')
ON CONFLICT (code) DO NOTHING;

-- Verify
SELECT code, name FROM regions ORDER BY name;
