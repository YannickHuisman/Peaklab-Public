#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$ROOT_DIR/.env.db.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found."
  echo "Copy .env.db.example to .env.db.production and fill in your DATABASE_URL."
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL is not set in $ENV_FILE"
  exit 1
fi

OUTPUT="$ROOT_DIR/supabase/seed.sql"

PSQL="/usr/local/Cellar/postgresql@17/17.10/bin/psql"

if [ ! -x "$PSQL" ]; then
  echo "Error: psql not found at $PSQL. Run: brew install postgresql@17"
  exit 1
fi

TABLES=(
  biomarker_categories
  biomarkers
  biomarker_dependencies
  panels
  panel_biomarkers
  labs
  lab_biomarker_references
  biomarker_content
  system_config
  partners
)

echo "Dumping reference data from production: $(echo "$DATABASE_URL" | sed 's/:.*@/:***@/')"

> "$OUTPUT"

# Truncate in reverse dependency order so FKs don't block
{
  echo '-- Truncate existing reference data (reverse FK order)'
  echo 'TRUNCATE TABLE'
  echo '  public.biomarker_content,'
  echo '  public.lab_biomarker_references,'
  echo '  public.panel_biomarkers,'
  echo '  public.biomarker_dependencies,'
  echo '  public.biomarkers,'
  echo '  public.biomarker_categories,'
  echo '  public.panels,'
  echo '  public.labs,'
  echo '  public.system_config,'
  echo '  public.partners'
  echo 'RESTART IDENTITY;'
  echo ''
} >> "$OUTPUT"

for table in "${TABLES[@]}"; do
  echo "  → $table"
  {
    printf '\nCOPY public.%s FROM stdin;\n' "$table"
    "$PSQL" "$DATABASE_URL" -c "COPY public.$table TO STDOUT"
    printf '\\.\n'
  } >> "$OUTPUT"
done

echo "Written to $OUTPUT"
echo "Done. Commit seed.sql to apply the dump to other environments."
