-- Subscription integration hardening
-- 1. Track whether a live subscription is set to cancel at period end (drives
--    "cancels on <date>" messaging and the past_due grace window in the UI).
-- 2. Add a webhook-event ledger so Stripe events are processed exactly once even
--    when Stripe re-delivers them.

-- ---------------------------------------------------------------------------
-- 1. subscriptions.cancel_at_period_end
-- ---------------------------------------------------------------------------
alter table "public"."subscriptions"
  add column if not exists "cancel_at_period_end" boolean not null default false;

-- ---------------------------------------------------------------------------
-- 2. stripe_events — webhook idempotency ledger
-- ---------------------------------------------------------------------------
create table if not exists "public"."stripe_events" (
  "id" text not null,            -- Stripe event id (evt_...)
  "type" text not null,
  "received_at" timestamp with time zone not null default now(),
  constraint "stripe_events_pkey" primary key ("id")
);

alter table "public"."stripe_events" enable row level security;

-- Service role (the backend) bypasses RLS; no policies means clients cannot
-- read or write this table at all. Only the backend touches it.
grant select, insert, delete on table "public"."stripe_events" to "service_role";

-- The reconcile backstop is scheduled in 20260614150100_reconcile_cron.sql.
