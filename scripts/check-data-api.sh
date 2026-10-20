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

# The OpenAPI root now requires a secret key. Probe the real application table
# instead, without sending user data or attempting a write. This table is
# intentionally insert-only for anonymous clients, so PostgREST may answer
# either 200 (RLS-filtered empty result) or 401/42501 (SELECT is denied). The
# latter still proves that the gateway accepted the publishable key and routed
# the request to PostgREST.
body_file="$(mktemp)"
trap 'rm -f "${body_file}"' EXIT

# curl already prints 000 when it cannot connect, so `|| true` keeps that
# value instead of appending a second one.
code="$(curl -sS -o "${body_file}" -w '%{http_code}' --max-time 30 \
  -G \
  -H "apikey: ${SUPABASE_PUBLISHABLE_KEY}" \
  --data-urlencode 'select=id' \
  --data-urlencode 'limit=0' \
  "${SUPABASE_URL%/}/rest/v1/contact_leads" 2>/dev/null || true)"
code="${code:-000}"

if [[ "${code}" == "200" || "${code}" == "206" ]]; then
  echo "ok: the Data API accepts the publishable key"
  exit 0
fi

if [[ "${code}" == "401" ]] \
  && grep -Eq '"code"[[:space:]]*:[[:space:]]*"42501"' "${body_file}"; then
  echo "ok: the Data API accepts the publishable key and keeps contact leads private"
  exit 0
fi

echo "FAIL: the Data API answered ${code} for the publishable key" >&2
if [[ "${code}" == "401" ]]; then
  echo "  The key is wrong, rotated, whitespace-padded, or the expected" >&2
  echo "  insert-only contact_leads table is unavailable." >&2
fi
exit 1
