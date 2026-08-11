#!/usr/bin/env bash
# Applies supabase/migrations to a throwaway database and asserts the contact
# form's security model still holds: the public roles may add a lead and do
# nothing else. Supabase enforces this in production, so a regression here is
# invisible until leads leak or stop arriving.
#
# Usage: DATABASE_URL=postgres://... bash scripts/test-migrations.sh
set -euo pipefail

: "${DATABASE_URL:?set DATABASE_URL to a throwaway Postgres database}"

psql_q() {
  psql -v ON_ERROR_STOP=1 --quiet --no-psqlrc --tuples-only --no-align \
    "${DATABASE_URL}" "$@"
}

expect_reject() {
  local label="$1" sql="$2"
  if psql -v ON_ERROR_STOP=1 --quiet --no-psqlrc "${DATABASE_URL}" \
      -c "${sql}" >/dev/null 2>&1; then
    echo "FAIL: ${label} was allowed but must be rejected" >&2
    exit 1
  fi
  echo "  ok: ${label} is rejected"
}

echo "==> Creating the Supabase roles the migrations grant to"
# A bare Postgres has no anon/authenticated; Supabase ships them.
psql_q -c "do \$\$ begin
  if not exists (select from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end \$\$;"

echo "==> Applying migrations"
shopt -s nullglob
migrations=(supabase/migrations/*.sql)
if [[ ${#migrations[@]} -eq 0 ]]; then
  echo "FAIL: no migrations found under supabase/migrations" >&2
  exit 1
fi
for migration in "${migrations[@]}"; do
  echo "  applying $(basename "${migration}")"
  psql_q -f "${migration}"
done

echo "==> Asserting the schema and its guarantees"
psql_q -c "do \$\$
begin
  assert (select relrowsecurity from pg_class where oid = 'public.contact_leads'::regclass),
    'row level security must stay enabled on contact_leads';
  assert exists (
    select from pg_policies
    where schemaname = 'public' and tablename = 'contact_leads' and cmd = 'INSERT'
  ), 'the public insert policy must exist';
  assert not exists (
    select from information_schema.role_table_grants
    where table_name = 'contact_leads'
      and grantee in ('anon', 'authenticated')
      and privilege_type in ('SELECT', 'UPDATE', 'DELETE')
  ), 'public roles must never hold select, update or delete on contact_leads';
end \$\$;"
echo "  ok: RLS on, insert policy present, no read or write-back grants"

echo "==> Exercising the public role"
psql_q -c "set role anon;
  insert into public.contact_leads (name, phone, message)
  values ('בדיקת מיגרציה', '0500000000', 'הודעת בדיקה עבור צינור ה-CI.');"
echo "  ok: a valid lead is accepted"

expect_reject "reading leads back" \
  "set role anon; select * from public.contact_leads;"
expect_reject "deleting leads" \
  "set role anon; delete from public.contact_leads;"
expect_reject "a lead claiming a foreign source" \
  "set role anon; insert into public.contact_leads (name, phone, message, source)
   values ('מקור זר', '0500000000', 'הודעת בדיקה עבור צינור ה-CI.', 'elsewhere');"
expect_reject "a lead that skips the queue" \
  "set role anon; insert into public.contact_leads (name, phone, message, status)
   values ('דילוג תור', '0500000000', 'הודעת בדיקה עבור צינור ה-CI.', 'closed');"
expect_reject "a message below the minimum length" \
  "set role anon; insert into public.contact_leads (name, phone, message)
   values ('קצר מדי', '0500000000', 'קצר');"

echo "==> Migration checks passed"
