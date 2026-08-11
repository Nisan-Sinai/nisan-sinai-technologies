#!/usr/bin/env bash
# Confirms the Supabase Data API still accepts the publishable key the site
# deploys with. A rotated, mistyped or whitespace-padded key fails here loudly
# instead of silently dropping every lead the contact form collects.
#
# Usage: SUPABASE_URL=... SUPABASE_PUBLISHABLE_KEY=... bash scripts/check-data-api.sh
set -euo pipefail

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_PUBLISHABLE_KEY:-}" ]]; then
  echo "SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is unset; skipping the Data API check."
  exit 0
fi

# curl already prints 000 when it cannot connect, so `|| true` keeps that
# value instead of appending a second one.
code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 \
  -H "apikey: ${SUPABASE_PUBLISHABLE_KEY}" \
  "${SUPABASE_URL%/}/rest/v1/" 2>/dev/null || true)"
code="${code:-000}"

if [[ "${code}" == "200" ]]; then
  echo "ok: the Data API accepts the publishable key"
  exit 0
fi

echo "FAIL: the Data API answered ${code} for the publishable key" >&2
if [[ "${code}" == "401" ]]; then
  echo "  A 401 means the key is wrong, was rotated, or carries stray" >&2
  echo "  whitespace. Re-enter it in the hosting platform and redeploy." >&2
fi
exit 1
