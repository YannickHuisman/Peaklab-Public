-- =============================================================================
-- PEAKLAB — Read-only dump user for production
--
-- Run this ONCE on production via Supabase SQL Editor.
-- Use the resulting credentials in .env.db.production instead of the
-- postgres superuser, so that user can never write to production.
--
-- After running:
--   DATABASE_URL=postgresql://readonly_dumper:<password>@<host>:5432/postgres
-- =============================================================================

CREATE ROLE readonly_dumper WITH LOGIN PASSWORD 'replace-with-a-strong-password' BYPASSRLS;

GRANT USAGE ON SCHEMA public TO readonly_dumper;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_dumper;

-- Ensure future tables are also covered
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO readonly_dumper;
