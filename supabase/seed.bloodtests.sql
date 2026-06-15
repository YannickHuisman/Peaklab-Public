-- =============================================================================
-- PEAKLAB — Blood Test Mock Seed (per user)
-- Invoked by scripts/seed.bloodtests.sh — do not run directly.
--
-- Requires psql variables:
--   email     — auth.users email of the target user
--   num_tests — number of blood tests to generate (5–10)
--
-- Prerequisites:
--   - pnpm seed --env <env>  (populates biomarkers, panels, labs)
--   - Target user must exist in auth.users (create via seed.mock or dashboard)
--
-- What it creates:
--   - num_tests blood tests spread evenly over the past 12 months
--   - Results for every active biomarker, with values that trend from
--     slightly suboptimal (test 1) toward near-optimal (last test)
-- =============================================================================

-- Pass psql variables into the session so the DO block can read them
SELECT set_config('seed.email',     :'email',     false);
SELECT set_config('seed.num_tests', :'num_tests', false);

DO $body$
DECLARE
  v_email      text    := current_setting('seed.email');
  v_num_tests  integer := current_setting('seed.num_tests')::integer;

  v_user_id    uuid;
  v_gender     text;
  v_panel_id   integer;
  v_lab_id     integer;
  v_lab_name   text;

  v_i          integer;
  v_test_id    uuid;
  v_date       date;

  v_ref_min    numeric;
  v_ref_max    numeric;
  v_fraction   numeric;
  v_value      numeric;
  v_flag       text;

  b            record;
BEGIN
  -- ------------------------------------------------------------------
  -- Resolve user
  -- ------------------------------------------------------------------
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found with email "%"', v_email;
  END IF;

  SELECT gender INTO v_gender FROM public.profiles WHERE id = v_user_id;

  -- ------------------------------------------------------------------
  -- Resolve panel and lab — prefer the user's panel, fall back to first
  -- ------------------------------------------------------------------
  SELECT COALESCE(
    (SELECT panel_id FROM public.profiles WHERE id = v_user_id AND panel_id IS NOT NULL),
    (SELECT id FROM public.panels LIMIT 1)
  ) INTO v_panel_id;

  SELECT id, name INTO v_lab_id, v_lab_name FROM public.labs LIMIT 1;

  IF v_panel_id IS NULL THEN
    RAISE EXCEPTION 'No panels found — run "pnpm seed --env <env>" first';
  END IF;
  IF v_lab_id IS NULL THEN
    RAISE EXCEPTION 'No labs found — run "pnpm seed --env <env>" first';
  END IF;

  RAISE NOTICE 'Seeding % blood tests for user % (%, panel %, lab %)',
    v_num_tests, v_email, COALESCE(v_gender, 'unknown gender'),
    v_panel_id, v_lab_name;

  -- ------------------------------------------------------------------
  -- Delete existing mock blood tests for this user so re-runs are safe.
  -- We only delete tests whose lab_name ends with '[mock]'.
  -- ------------------------------------------------------------------
  DELETE FROM public.blood_test_results
    WHERE blood_test_id IN (
      SELECT id FROM public.blood_tests
      WHERE user_id = v_user_id AND lab_name LIKE '%[mock]'
    );
  DELETE FROM public.blood_tests
    WHERE user_id = v_user_id AND lab_name LIKE '%[mock]';

  -- ------------------------------------------------------------------
  -- Generate blood tests
  -- ------------------------------------------------------------------
  FOR v_i IN 1..v_num_tests LOOP
    v_test_id := gen_random_uuid();

    -- Spread tests evenly over the past 12 months; most recent = today
    v_date := current_date
      - make_interval(days => ((v_num_tests - v_i) * 365 / GREATEST(v_num_tests - 1, 1))::integer);

    INSERT INTO public.blood_tests (id, user_id, panel_id, lab_id, sample_taken_at, lab_name, status)
    VALUES (v_test_id, v_user_id, v_panel_id, v_lab_id, v_date, v_lab_name || ' [mock]', 'completed');

    -- ----------------------------------------------------------------
    -- Results for every active biomarker
    -- ----------------------------------------------------------------
    FOR b IN
      SELECT id, unit, kind,
             ref_male_min,    ref_male_max,
             ref_female_min,  ref_female_max
        FROM public.biomarkers
       WHERE is_active = true
       ORDER BY id
    LOOP
      -- Pick gender-appropriate reference range
      IF v_gender = 'female' THEN
        v_ref_min := b.ref_female_min;
        v_ref_max := b.ref_female_max;
      ELSE
        v_ref_min := b.ref_male_min;
        v_ref_max := b.ref_male_max;
      END IF;

      IF v_ref_min IS NOT NULL AND v_ref_max IS NOT NULL AND v_ref_max > v_ref_min THEN
        -- Trend from ~55 % of range (test 1) to ~90 % (last test),
        -- with ±15 % of range width as random noise.
        v_fraction := 0.55
          + ((v_i - 1.0) / GREATEST(v_num_tests - 1, 1)) * 0.35
          + (random() - 0.5) * 0.30;

        v_value := GREATEST(0, v_ref_min + v_fraction * (v_ref_max - v_ref_min));
        v_value := ROUND(v_value, 2);

        IF    v_value < v_ref_min THEN v_flag := 'low';
        ELSIF v_value > v_ref_max THEN v_flag := 'high';
        ELSE                           v_flag := 'normal';
        END IF;
      ELSE
        -- No reference range — generate a small positive placeholder
        v_value    := ROUND((random() * 5 + 0.5)::numeric, 2);
        v_ref_min  := NULL;
        v_ref_max  := NULL;
        v_flag     := 'normal';
      END IF;

      INSERT INTO public.blood_test_results
        (blood_test_id, biomarker_id, value, unit, ref_low, ref_high, flag)
      VALUES
        (v_test_id, b.id, v_value, b.unit, v_ref_min, v_ref_max, v_flag);
    END LOOP;

    RAISE NOTICE '  test % / % — % — % biomarker results inserted',
      v_i, v_num_tests, v_date,
      (SELECT COUNT(*) FROM public.blood_test_results WHERE blood_test_id = v_test_id);
  END LOOP;

  RAISE NOTICE 'Done. % blood tests created for %.', v_num_tests, v_email;
END;
$body$;
