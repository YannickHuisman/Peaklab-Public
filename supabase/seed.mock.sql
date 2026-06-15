-- =============================================================================
-- PEAKLAB — Mock Data Seed
-- For DEVELOPMENT and ACCEPTANCE only. NEVER run on production.
--
-- HOW TO APPLY:
--   1. First apply reference data (biomarkers, panels, labs):
--        pnpm seed --env <development|acceptance>
--
--   2. Then apply mock user data:
--        pnpm seed:mock --env <development|acceptance>
--
-- Creates:
--   - 4 fake users (inserted directly into auth.users via psql superuser)
--   - Subscriptions, blood tests, results, performance data, goals
--
-- NOTE ON AUTH USERS:
--   auth.users rows are inserted directly. This works because the DATABASE_URL
--   connects as the postgres superuser. A trigger (handle_new_user) automatically
--   creates a minimal profile row on auth.users INSERT, so the profiles INSERT
--   below uses ON CONFLICT DO UPDATE to fill in the remaining fields.
--
-- MOCK UUIDs:
--   mock-user-1: 00000000-0000-0000-0000-000000000001  (lars@peaklab.test)
--   mock-user-2: 00000000-0000-0000-0000-000000000002  (sophie@peaklab.test)
--   mock-user-3: 00000000-0000-0000-0000-000000000003  (tom@peaklab.test)
--   mock-user-4: 00000000-0000-0000-0000-000000000004  (emma@peaklab.test)
-- =============================================================================

-- Clean up existing mock data (safe to re-run)
DELETE FROM public.blood_test_results
  WHERE blood_test_id IN (
    SELECT id FROM public.blood_tests
    WHERE user_id IN (
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000003',
      '00000000-0000-0000-0000-000000000004'
    )
  );
DELETE FROM public.blood_tests
  WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
DELETE FROM public.subscriptions
  WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
DELETE FROM public.goals
  WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
DELETE FROM public.performance_profiles
  WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
DELETE FROM public.user_settings
  WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
DELETE FROM public.profiles
  WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );
DELETE FROM auth.users
  WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
  );

-- =============================================================================
-- AUTH USERS
-- Inserting directly via psql superuser. The handle_new_user trigger will
-- automatically create a minimal row in public.profiles for each user.
-- =============================================================================

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'lars@peaklab.test', '',
    now(), '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Lars van den Berg"}',
    false,
    now() - interval '6 months', now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sophie@peaklab.test', '',
    now(), '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sophie Jansen"}',
    false,
    now() - interval '4 months', now()
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tom@peaklab.test', '',
    now(), '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Tom de Vries"}',
    false,
    now() - interval '2 months', now()
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'emma@peaklab.test', '',
    now(), '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Emma Bakker"}',
    false,
    now() - interval '1 month', now()
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- PROFILES
-- The handle_new_user trigger already created a minimal row (id, full_name,
-- avatar_url). Update with the remaining profile fields.
-- =============================================================================

INSERT INTO public.profiles (id, full_name, username, birth_date, gender, weight_kg, sport_type, sport_frequency_per_week, panel_id, show_all_biomarkers, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Lars van den Berg',
    'lars_mock',
    '1990-03-15',
    'male',
    82.5,
    'cycling',
    5,
    1,
    false,
    now() - interval '6 months'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Sophie Jansen',
    'sophie_mock',
    '1994-07-22',
    'female',
    62.0,
    'running',
    4,
    1,
    false,
    now() - interval '4 months'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Tom de Vries',
    'tom_mock',
    '1985-11-08',
    'male',
    91.0,
    'strength',
    3,
    NULL,
    true,
    now() - interval '2 months'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Emma Bakker',
    'emma_mock',
    '1998-01-30',
    'female',
    58.5,
    'triathlon',
    6,
    1,
    false,
    now() - interval '1 month'
  )
ON CONFLICT (id) DO UPDATE SET
  full_name                  = EXCLUDED.full_name,
  username                   = EXCLUDED.username,
  birth_date                 = EXCLUDED.birth_date,
  gender                     = EXCLUDED.gender,
  weight_kg                  = EXCLUDED.weight_kg,
  sport_type                 = EXCLUDED.sport_type,
  sport_frequency_per_week   = EXCLUDED.sport_frequency_per_week,
  panel_id                   = EXCLUDED.panel_id,
  show_all_biomarkers        = EXCLUDED.show_all_biomarkers,
  created_at                 = EXCLUDED.created_at;

-- =============================================================================
-- USER SETTINGS
-- =============================================================================

INSERT INTO public.user_settings (user_id)
VALUES
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000004');

-- =============================================================================
-- SUBSCRIPTIONS
-- =============================================================================

INSERT INTO public.subscriptions (user_id, status, plan, started_at, ends_at)
VALUES
  -- Active paid subscriber
  ('00000000-0000-0000-0000-000000000001', 'active',    'pro', now() - interval '3 months', now() + interval '9 months'),
  -- Trialing user
  ('00000000-0000-0000-0000-000000000002', 'trialing',  'pro', now() - interval '7 days',   now() + interval '7 days'),
  -- Active paid subscriber
  ('00000000-0000-0000-0000-000000000003', 'active',    'pro', now() - interval '1 month',  now() + interval '11 months'),
  -- Canceled
  ('00000000-0000-0000-0000-000000000004', 'canceled',  'pro', now() - interval '2 months', now() - interval '1 day');

-- =============================================================================
-- BLOOD TESTS
-- Requires panels (id=1) and labs (id=1) to exist — run `pnpm seed` first.
-- =============================================================================

-- Lars: 3 blood tests over 6 months
INSERT INTO public.blood_tests (id, user_id, panel_id, lab_id, sample_taken_at, lab_name, status)
VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1, 1, current_date - interval '5 months', 'Synlab',   'completed'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 1, 1, current_date - interval '3 months', 'Synlab',   'completed'),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 1, 1, current_date - interval '1 month',  'Synlab',   'completed');

-- Sophie: 2 blood tests
INSERT INTO public.blood_tests (id, user_id, panel_id, lab_id, sample_taken_at, lab_name, status)
VALUES
  ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 1, 1, current_date - interval '3 months', 'Eurofins', 'completed'),
  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 1, 1, current_date - interval '2 weeks',  'Eurofins', 'completed');

-- Tom: 1 blood test
INSERT INTO public.blood_tests (id, user_id, panel_id, lab_id, sample_taken_at, lab_name, status)
VALUES
  ('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 1, 1, current_date - interval '6 weeks',  'Synlab',   'completed');

-- Emma: 1 pending test
INSERT INTO public.blood_tests (id, user_id, panel_id, lab_id, sample_taken_at, lab_name, status)
VALUES
  ('a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', 1, 1, current_date - interval '3 days',   'Eurofins', 'pending');

-- =============================================================================
-- BLOOD TEST RESULTS
-- Biomarker IDs are resolved by name so this stays correct regardless of the
-- sequence values assigned when seed.sql was applied.
--   hemoglobine        — Hemoglobin
--   ferritine          — Ferritine
--   vitamine_d         — Vitamine D (25-OH)
--   testosteron_totaal — Testosterone (totaal)
--   hscrp              — hsCRP
-- Requires biomarkers to exist — run `pnpm seed` first.
-- =============================================================================

-- Lars — test 1 (slightly suboptimal baseline)
INSERT INTO public.blood_test_results (blood_test_id, biomarker_id, value, unit, flag)
VALUES
  ('a0000000-0000-0000-0000-000000000001', (SELECT id FROM public.biomarkers WHERE name = 'hemoglobine'),        14.2, 'g/dL',   'normal'),
  ('a0000000-0000-0000-0000-000000000001', (SELECT id FROM public.biomarkers WHERE name = 'ferritine'),          18.0, 'µg/L',   'low'),
  ('a0000000-0000-0000-0000-000000000001', (SELECT id FROM public.biomarkers WHERE name = 'vitamine_d'),         38.0, 'nmol/L', 'low'),
  ('a0000000-0000-0000-0000-000000000001', (SELECT id FROM public.biomarkers WHERE name = 'testosteron_totaal'), 15.2, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000001', (SELECT id FROM public.biomarkers WHERE name = 'hscrp'),               2.1, 'mg/L',   'normal');

-- Lars — test 2 (improving)
INSERT INTO public.blood_test_results (blood_test_id, biomarker_id, value, unit, flag)
VALUES
  ('a0000000-0000-0000-0000-000000000002', (SELECT id FROM public.biomarkers WHERE name = 'hemoglobine'),        14.8, 'g/dL',   'normal'),
  ('a0000000-0000-0000-0000-000000000002', (SELECT id FROM public.biomarkers WHERE name = 'ferritine'),          45.0, 'µg/L',   'normal'),
  ('a0000000-0000-0000-0000-000000000002', (SELECT id FROM public.biomarkers WHERE name = 'vitamine_d'),         62.0, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000002', (SELECT id FROM public.biomarkers WHERE name = 'testosteron_totaal'), 16.8, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000002', (SELECT id FROM public.biomarkers WHERE name = 'hscrp'),               1.4, 'mg/L',   'normal');

-- Lars — test 3 (optimal)
INSERT INTO public.blood_test_results (blood_test_id, biomarker_id, value, unit, flag)
VALUES
  ('a0000000-0000-0000-0000-000000000003', (SELECT id FROM public.biomarkers WHERE name = 'hemoglobine'),        15.4, 'g/dL',   'normal'),
  ('a0000000-0000-0000-0000-000000000003', (SELECT id FROM public.biomarkers WHERE name = 'ferritine'),          72.0, 'µg/L',   'normal'),
  ('a0000000-0000-0000-0000-000000000003', (SELECT id FROM public.biomarkers WHERE name = 'vitamine_d'),         89.0, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000003', (SELECT id FROM public.biomarkers WHERE name = 'testosteron_totaal'), 18.1, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000003', (SELECT id FROM public.biomarkers WHERE name = 'hscrp'),               0.8, 'mg/L',   'normal');

-- Sophie — test 1
INSERT INTO public.blood_test_results (blood_test_id, biomarker_id, value, unit, flag)
VALUES
  ('a0000000-0000-0000-0000-000000000004', (SELECT id FROM public.biomarkers WHERE name = 'hemoglobine'),  12.1, 'g/dL',   'low'),
  ('a0000000-0000-0000-0000-000000000004', (SELECT id FROM public.biomarkers WHERE name = 'ferritine'),     9.0, 'µg/L',   'low'),
  ('a0000000-0000-0000-0000-000000000004', (SELECT id FROM public.biomarkers WHERE name = 'vitamine_d'),   28.0, 'nmol/L', 'low'),
  ('a0000000-0000-0000-0000-000000000004', (SELECT id FROM public.biomarkers WHERE name = 'hscrp'),         3.2, 'mg/L',   'high');

-- Sophie — test 2 (after supplementation)
INSERT INTO public.blood_test_results (blood_test_id, biomarker_id, value, unit, flag)
VALUES
  ('a0000000-0000-0000-0000-000000000005', (SELECT id FROM public.biomarkers WHERE name = 'hemoglobine'), 13.4, 'g/dL',   'normal'),
  ('a0000000-0000-0000-0000-000000000005', (SELECT id FROM public.biomarkers WHERE name = 'ferritine'),   32.0, 'µg/L',   'normal'),
  ('a0000000-0000-0000-0000-000000000005', (SELECT id FROM public.biomarkers WHERE name = 'vitamine_d'),  55.0, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000005', (SELECT id FROM public.biomarkers WHERE name = 'hscrp'),        1.9, 'mg/L',   'normal');

-- Tom — test 1
INSERT INTO public.blood_test_results (blood_test_id, biomarker_id, value, unit, flag)
VALUES
  ('a0000000-0000-0000-0000-000000000006', (SELECT id FROM public.biomarkers WHERE name = 'hemoglobine'),        16.1, 'g/dL',   'normal'),
  ('a0000000-0000-0000-0000-000000000006', (SELECT id FROM public.biomarkers WHERE name = 'ferritine'),          55.0, 'µg/L',   'normal'),
  ('a0000000-0000-0000-0000-000000000006', (SELECT id FROM public.biomarkers WHERE name = 'vitamine_d'),         44.0, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000006', (SELECT id FROM public.biomarkers WHERE name = 'testosteron_totaal'), 21.3, 'nmol/L', 'normal'),
  ('a0000000-0000-0000-0000-000000000006', (SELECT id FROM public.biomarkers WHERE name = 'hscrp'),               1.1, 'mg/L',   'normal');

-- =============================================================================
-- PERFORMANCE PROFILES
-- =============================================================================

INSERT INTO public.performance_profiles (user_id, is_complete, current_step)
VALUES
  ('00000000-0000-0000-0000-000000000001', true,  5),
  ('00000000-0000-0000-0000-000000000002', true,  5),
  ('00000000-0000-0000-0000-000000000003', false, 2),
  ('00000000-0000-0000-0000-000000000004', false, 1);

-- =============================================================================
-- GOALS
-- Valid goal_type enum values:
--   '5k_time', '10k_time', 'half_marathon_time', 'marathon_time',
--   'triathlon', 'cycling_power', 'body_fat_percentage',
--   'bench_press_1rm', 'hyrox', 'other'
-- =============================================================================

INSERT INTO public.goals (user_id, type, title, target_value, target_unit, target_date, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'cycling_power',  'FTP verhogen naar 320W',     320, 'W',      current_date + interval '3 months', true),
  ('00000000-0000-0000-0000-000000000001', 'other',          'Ferritine boven 60 µg/L',     60, 'µg/L',   current_date + interval '2 months', true),
  ('00000000-0000-0000-0000-000000000002', 'marathon_time',  'Sub-4 uur marathon lopen',   240, 'min',    current_date + interval '6 months', true),
  ('00000000-0000-0000-0000-000000000002', 'other',          'Vitamine D boven 75 nmol/L',  75, 'nmol/L', current_date + interval '1 month',  true),
  ('00000000-0000-0000-0000-000000000003', 'bench_press_1rm','200 kg deadlift',            200, 'kg',     current_date + interval '4 months', true);
