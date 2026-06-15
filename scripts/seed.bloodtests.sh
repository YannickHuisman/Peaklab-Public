#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# ---------------------------------------------------------------------------
# Parse flags
# ---------------------------------------------------------------------------
ENV=""
EMAIL=""
NUM_TESTS="7"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)   ENV="$2";       shift 2 ;;
    --email) EMAIL="$2";     shift 2 ;;
    --tests) NUM_TESTS="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

if [ -z "$ENV" ]; then
  echo "Error: --env is required. Usage: pnpm seed:bloodtests --env <development|acceptance> --email <user@email.com>"
  exit 1
fi

if [ -z "$EMAIL" ]; then
  echo "Error: --email is required. Usage: pnpm seed:bloodtests --env <development|acceptance> --email <user@email.com>"
  exit 1
fi

if [ "$ENV" = "production" ]; then
  echo "Error: seed.bloodtests.sql must never run against production."
  exit 1
fi

if ! [[ "$NUM_TESTS" =~ ^[0-9]+$ ]] || [ "$NUM_TESTS" -lt 1 ] || [ "$NUM_TESTS" -gt 20 ]; then
  echo "Error: --tests must be a number between 1 and 20 (got: $NUM_TESTS)"
  exit 1
fi

# ---------------------------------------------------------------------------
# Load database URL
# ---------------------------------------------------------------------------
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

if [ -n "${PROD_GUARD:-}" ] && echo "$DATABASE_URL" | grep -qi "$PROD_GUARD"; then
  echo "Error: DATABASE_URL matches PROD_GUARD pattern. Refusing to seed mock data."
  exit 1
fi

PSQL=$(command -v psql || echo "/usr/local/bin/psql")

if [ ! -x "$PSQL" ]; then
  echo "Error: psql not found. Run: brew install libpq"
  exit 1
fi

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
echo "Seeding $NUM_TESTS blood tests for [$EMAIL] against [$ENV]: $(echo "$DATABASE_URL" | sed 's/:.*@/:***@/')"

"$PSQL" "$DATABASE_URL" \
  -v email="$EMAIL" \
  -v num_tests="$NUM_TESTS" \
  -f "$ROOT_DIR/supabase/seed.bloodtests.sql"

echo "Done."
