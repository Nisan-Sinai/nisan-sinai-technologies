#!/usr/bin/env bash
# Applies Supabase migrations to a throwaway database and asserts the contact
# form's security model: anyone may submit a valid lead, nobody may change or
# delete one, and only the authenticated admin email may read leads.
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

expect_value() {
  local label="$1" expected="$2" sql="$3" actual
  actual="$(psql_q -c "${sql}" | tail -n 1 | tr -d '[:space:]')"
  if [[ "${actual}" != "${expected}" ]]; then
    echo "FAIL: ${label}: expected ${expected}, got ${actual}" >&2
    exit 1
  fi
  echo "  ok: ${label} = ${expected}"
}

echo "==> Creating the Supabase roles the migrations grant to"
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
  assert exists (
    select from pg_policies
    where schemaname = 'public' and tablename = 'contact_leads'
      and cmd = 'SELECT' and policyname = 'admin_can_read_contact_leads'
  ), 'the admin select policy must exist';
  assert exists (
    select from information_schema.role_table_grants
    where table_name = 'contact_leads'
      and grantee = 'authenticated' and privilege_type = 'SELECT'
  ), 'authenticated needs select so RLS can admit the admin';
  assert not exists (
    select from information_schema.role_table_grants
    where table_name = 'contact_leads'
      and grantee = 'anon'
      and privilege_type in ('SELECT', 'UPDATE', 'DELETE')
  ), 'anon must never hold select, update or delete on contact_leads';
  assert not exists (
    select from information_schema.role_table_grants
    where table_name = 'contact_leads'
      and grantee = 'authenticated'
      and privilege_type in ('UPDATE', 'DELETE')
  ), 'authenticated must never update or delete contact_leads';
end \$\$;"
echo "  ok: RLS, public insert and admin-only read contract present"

echo "==> Exercising the public role"
psql_q -c "set role anon;
  insert into public.contact_leads (name, phone, message)
  values ('בדיקת מיגרציה', '0500000000', 'הודעת בדיקה עבור צינור ה-CI.');"
echo "  ok: a valid lead is accepted"

expect_reject "anonymous reading leads back" \
  "set role anon; select * from public.contact_leads;"

expect_value "non-admin authenticated visible leads" "0" \
  "set role authenticated;
   set request.jwt.claims = '{\"email\":\"someone@example.com\"}';
   select count(*) from public.contact_leads;"

expect_value "admin authenticated visible leads" "1" \
  "set role authenticated;
   set request.jwt.claims = '{\"email\":\"nisan.sinai5@gmail.com\"}';
   select count(*) from public.contact_leads;"

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
