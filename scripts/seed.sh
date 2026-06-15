#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Parse --env flag
ENV=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env) ENV="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

if [ -z "$ENV" ]; then
  echo "Error: --env is required. Usage: pnpm seed --env <development|acceptance>"
  exit 1
fi

if [ "$ENV" = "production" ]; then
  echo "Error: cannot seed into production. Use 'pnpm seed:dump' to pull data from production."
  exit 1
fi

ENV_FILE="$ROOT_DIR/.env.db.$ENV"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found."
  echo "Copy .env.db.example to .env.db.$ENV and fill in your DATABASE_URL."
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL is not set in $ENV_FILE"
  exit 1
fi

PSQL=$(command -v psql || echo "/usr/local/bin/psql")

if [ ! -x "$PSQL" ]; then
  echo "Error: psql not found. Run: brew install libpq"
  exit 1
fi

echo "Running seed.sql against [$ENV]: $(echo "$DATABASE_URL" | sed 's/:.*@/:***@/')"
"$PSQL" "$DATABASE_URL" \
  -c "SET session_replication_role = replica;" \
  -f "$ROOT_DIR/supabase/seed.sql" \
  -c "SET session_replication_role = DEFAULT;"
echo "Done."
