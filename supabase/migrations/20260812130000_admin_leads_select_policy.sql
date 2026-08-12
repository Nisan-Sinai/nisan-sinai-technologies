revoke select on table public.contact_leads from authenticated;
drop policy if exists "admin_can_read_contact_leads" on public.contact_leads;

create or replace function public.admin_contact_leads()
returns table (
  id uuid,
  name text,
  business_name text,
  phone text,
  email text,
  service text,
  message text,
  status text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  caller_email text;
begin
  caller_email := lower(coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'),
    ''
  ));

  if caller_email <> 'nisan.sinai5@gmail.com' then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  return query
    select l.id, l.name, l.business_name, l.phone, l.email, l.service, l.message, l.status, l.created_at
    from public.contact_leads as l
    order by l.created_at desc
    limit 500;
end;
$$;

revoke all on function public.admin_contact_leads() from public;
grant execute on function public.admin_contact_leads() to authenticated;
