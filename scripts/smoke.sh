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

# A 200 only proves something answered. For the two pages that exist to satisfy
# a legal requirement, the requirement is the content, so check the content.
body_has() {
  local label="$1" url="$2" needle="$3"
  if curl -sS --max-time 30 --retry 2 --retry-delay 5 --retry-all-errors "${url}" \
      2>/dev/null | grep -qF -- "${needle}"; then
    echo "  ok: ${label}"
  else
    echo "FAIL: ${label} — ${url} does not contain \"${needle}\"" >&2
    status=1
  fi
}

post_code() {
  local code
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 30 \
    -X POST -H "Content-Type: $2" --data "$3" "$1" 2>/dev/null || true)"
  echo "${code:-000}"
}

echo "==> Smoke testing ${SITE_URL}"
check "homepage responds"          200 "$(get_code "${SITE_URL}/")"
check "english homepage"           200 "$(get_code "${SITE_URL}/en")"
check "privacy page"               200 "$(get_code "${SITE_URL}/privacy")"
check "english privacy page"       200 "$(get_code "${SITE_URL}/en/privacy")"
check "accessibility statement"    200 "$(get_code "${SITE_URL}/accessibility")"
check "english accessibility page" 200 "$(get_code "${SITE_URL}/en/accessibility")"
check "blog index"                 200 "$(get_code "${SITE_URL}/blog")"
check "english blog index"         200 "$(get_code "${SITE_URL}/en/blog")"
check "a blog post renders"        200 "$(get_code "${SITE_URL}/blog/website-cost-israel")"
check "english blog post renders"  200 "$(get_code "${SITE_URL}/en/blog/website-cost-israel")"
# A slug that never existed must 404 rather than serve an empty shell.
check "unknown post is a 404"      404 "$(get_code "${SITE_URL}/blog/no-such-post")"
check "robots.txt"                 200 "$(get_code "${SITE_URL}/robots.txt")"
check "sitemap.xml"                200 "$(get_code "${SITE_URL}/sitemap.xml")"

# The two documents a regulator or a claimant would ask for. A deploy that
# serves the pages but loses their substance passes an HTTP check and fails
# the only test that matters.
body_has "accessibility statement names the standard" \
  "${SITE_URL}/accessibility" "5568"
body_has "accessibility statement names a coordinator" \
  "${SITE_URL}/accessibility" "רכז הנגישות"
body_has "privacy policy names the database controller" \
  "${SITE_URL}/privacy" "בעל המאגר"
body_has "privacy policy names the processors" \
  "${SITE_URL}/privacy" "Supabase"
body_has "sitemap lists the blog" \
  "${SITE_URL}/sitemap.xml" "/blog"
body_has "sitemap lists the accessibility statement" \
  "${SITE_URL}/sitemap.xml" "/accessibility"

# NEXT_PUBLIC_SITE_URL feeds every canonical, the sitemap and robots.txt. If it
# is unset or stale the pages quietly nominate a different host as the original
# and hand it the ranking — the one SEO failure that looks fine in a browser.
# Only a deployment can be judged on this: a local build has no public host to
# name, so the check is skipped rather than failed against localhost.
if [[ "${SITE_URL}" == https://* ]]; then
  body_has "canonical names this host" \
    "${SITE_URL}/" "rel=\"canonical\" href=\"${SITE_URL}"
  body_has "robots.txt points at this host's sitemap" \
    "${SITE_URL}/robots.txt" "Sitemap: ${SITE_URL}/sitemap.xml"
else
  echo "  skip: canonical host checks need a deployed https URL"
fi

# The admin login is not content. It must never be indexed.
body_has "admin login is excluded from search" \
  "${SITE_URL}/admin" "noindex"

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
