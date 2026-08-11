#!/usr/bin/env bash
# Fails when a real credential is committed. Environment values belong in the
# hosting platform, never in Git — once pushed, a key is burned even if the
# commit is later removed.
set -euo pipefail

self="scripts/scan-secrets.sh"
status=0

echo "==> Scanning tracked files for credential literals"
# Supabase JWTs (anon and service_role alike) share this header segment, and the
# modern keys carry a fixed prefix. Short placeholders such as the
# sb_publishable_test fixture stay under the length floors on purpose.
patterns=(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJ[A-Za-z0-9_-]{20,}'
  'sb_secret_[A-Za-z0-9_-]{10,}'
  'sb_publishable_[A-Za-z0-9_-]{20,}'
)
for pattern in "${patterns[@]}"; do
  while IFS= read -r file; do
    [[ "${file}" == "${self}" ]] && continue
    if grep -HnE "${pattern}" -- "${file}" >/dev/null 2>&1; then
      echo "FAIL: credential literal in ${file}" >&2
      grep -HnoE "${pattern}" -- "${file}" | sed 's/^/  /' >&2
      status=1
    fi
  done < <(git ls-files)
done

echo "==> Checking that no environment file is tracked"
while IFS= read -r file; do
  case "${file}" in
    .env.example) ;;
    .env|.env.*|*/.env|*/.env.*)
      echo "FAIL: ${file} is tracked; only .env.example belongs in Git" >&2
      status=1
      ;;
  esac
done < <(git ls-files)

if [[ ${status} -eq 0 ]]; then
  echo "==> No credentials found in tracked files"
fi
exit "${status}"
