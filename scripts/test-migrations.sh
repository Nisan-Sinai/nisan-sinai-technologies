#!/usr/bin/env bash
# Applies supabase/migrations to a throwaway database and asserts the contact
# form's security model still holds: anonymous visitors may only add a lead,
# while authenticated reads are visible only to the single administrator.
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

echo "==> Creating the Supabase roles and auth.jwt() contract used by migrations"
# A bare Postgres has neither Supabase's roles nor auth.jwt(). Recreate only
# the small contract the migrations need so CI can exercise the real policies.
psql_q -c "do \$\$ begin
  if not exists (select from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end \$\$;
create schema if not exists auth;
create or replace function auth.jwt() returns jsonb
language sql stable
as \$\$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
\$\$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.jwt() to anon, authenticated;"

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
      and grantee = 'anon'
      and privilege_type in ('SELECT', 'UPDATE', 'DELETE')
  ), 'anon must never hold select, update or delete on contact_leads';
  assert exists (
    select from information_schema.role_table_grants
    where table_name = 'contact_leads'
      and grantee = 'authenticated'
      and privilege_type = 'SELECT'
  ), 'authenticated must hold table-level select so RLS can authorize the admin';
  assert not exists (
    select from information_schema.role_table_grants
    where table_name = 'contact_leads'
      and grantee = 'authenticated'
      and privilege_type in ('UPDATE', 'DELETE')
  ), 'authenticated must not hold update or delete on contact_leads';
  assert exists (
    select from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_leads'
      and policyname = 'admin_can_read_contact_leads'
      and cmd = 'SELECT'
      and 'authenticated' = any(roles)
      and qual like '%nisan.sinai5@gmail.com%'
  ), 'the admin-only select policy must stay bound to the approved email';
end \$\$;"
echo "  ok: anonymous is insert-only and authenticated reads are guarded by admin RLS"

echo "==> Exercising the anonymous role"
psql_q -c "set role anon;
  insert into public.contact_leads (name, phone, message)
  values ('בדיקת מיגרציה', '0500000000', 'הודעת בדיקה עבור צינור ה-CI.');"
echo "  ok: a valid lead is accepted"

expect_reject "anonymous reading leads back" \
  "set role anon; select * from public.contact_leads;"
expect_reject "anonymous deleting leads" \
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

echo "==> Exercising authenticated RLS"
non_admin_count="$(psql_q -c "set request.jwt.claims = '{\"email\":\"someone@example.com\"}';
  set role authenticated;
  select count(*) from public.contact_leads;")"
if [[ "${non_admin_count}" != "0" ]]; then
  echo "FAIL: a non-admin authenticated user can see ${non_admin_count} lead(s)" >&2
  exit 1
fi
echo "  ok: a non-admin authenticated user sees no leads"

admin_count="$(psql_q -c "set request.jwt.claims = '{\"email\":\"nisan.sinai5@gmail.com\"}';
  set role authenticated;
  select count(*) from public.contact_leads;")"
if [[ ! "${admin_count}" =~ ^[0-9]+$ ]] || (( admin_count < 1 )); then
  echo "FAIL: the approved administrator could not read the inserted lead" >&2
  exit 1
fi
echo "  ok: the approved administrator can read leads"

echo "==> Migration checks passed"
