-- Schedule the subscription reconcile backstop entirely inside Postgres.
-- pg_cron fires daily and calls the backend's POST /api/subscriptions/reconcile
-- via pg_net, healing any rows left stale by a missed Stripe webhook.
--
-- The endpoint URL and the cron secret are read from Supabase Vault AT RUN TIME,
-- so nothing environment-specific or sensitive is committed here. Create the two
-- secrets ONCE PER ENVIRONMENT (acceptance + production) in the Supabase SQL
-- editor before the job can succeed:
--
--   select vault.create_secret(
--     'https://<your-backend-host>/api/subscriptions/reconcile', 'reconcile_url');
--   select vault.create_secret('<CRON_SECRET>', 'reconcile_cron_secret');
--
-- <CRON_SECRET> must match the CRON_SECRET env var on the backend service.
-- The job is created regardless; until the secrets exist it simply no-ops/fails
-- at run time without affecting anything else.

do $setup$
begin
  -- pg_cron / pg_net ship with Supabase. Guard the whole block so a permissions
  -- hiccup can never block a deploy — the reconcile job is only a safety net.
  execute 'create extension if not exists pg_cron';
  execute 'create extension if not exists pg_net';

  -- Drop any previous definition first so re-applying this migration is safe.
  perform cron.unschedule(jobid) from cron.job where jobname = 'reconcile-subscriptions';

  perform cron.schedule(
    'reconcile-subscriptions',
    '0 3 * * *', -- daily at 03:00 UTC
    $cmd$
      select net.http_post(
        url := (
          select decrypted_secret from vault.decrypted_secrets where name = 'reconcile_url'
        ),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cron-secret', (
            select decrypted_secret from vault.decrypted_secrets
            where name = 'reconcile_cron_secret'
          )
        )
      );
    $cmd$
  );
exception
  when others then
    raise warning 'reconcile-subscriptions cron not scheduled: %', sqlerrm;
end
$setup$;
