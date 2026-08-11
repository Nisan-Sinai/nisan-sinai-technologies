#!/usr/bin/env bash
# Checks a deployed environment from the outside. Green CI only proves the code
# builds; this proves the thing users actually reach is serving.
#
# Usage: SITE_URL=https://example.com bash scripts/smoke.sh
set -euo pipefail

SITE_URL="${SITE_URL:-https://nisan-sinai-technologies.vercel.app}"
SITE_URL="${SITE_URL%/}"
status=0

check() {
  local label="$1" expected="$2" actual="$3"
  if [[ "${actual}" == "${expected}" ]]; then
    echo "  ok: ${label} (${actual})"
  else
    echo "FAIL: ${label} expected ${expected}, got ${actual}" >&2
    status=1
  fi
}

# curl already prints 000 when it cannot connect, so `|| true` keeps that
# value instead of appending a second one.
get_code() {
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 --retry 2 \
    --retry-delay 5 --retry-all-errors "$1" 2>/dev/null || true)"
  echo "${code:-000}"
}

post_code() {
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 \
    -X POST -H "Content-Type: $2" --data "$3" "$1" 2>/dev/null || true)"
  echo "${code:-000}"
}

echo "==> Smoke testing ${SITE_URL}"
check "homepage responds"  200 "$(get_code "${SITE_URL}/")"
check "privacy page"       200 "$(get_code "${SITE_URL}/privacy")"
check "robots.txt"         200 "$(get_code "${SITE_URL}/robots.txt")"
check "sitemap.xml"        200 "$(get_code "${SITE_URL}/sitemap.xml")"

# These two reach the lead route and stop inside its guards, so a deployed API
# is proven without writing a lead into the database.
check "lead API rejects non-JSON" 415 \
  "$(post_code "${SITE_URL}/api/leads" "text/plain" "hello")"
check "lead API rejects malformed JSON" 400 \
  "$(post_code "${SITE_URL}/api/leads" "application/json" "{")"

if [[ ${status} -eq 0 ]]; then
  echo "==> Smoke checks passed"
fi
exit "${status}"
