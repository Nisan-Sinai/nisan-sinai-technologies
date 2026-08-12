create table if not exists public.admin_users (
  email text primary key,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint admin_users_email_normalized check (email = lower(btrim(email))),
  constraint admin_users_email_shape check (position('@' in email) > 1)
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;

insert into public.admin_users (email)
values ('nisan.sinai5@gmail.com')
on conflict (email) do update set is_active = true;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(
      coalesce(
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'),
        ''
      )
    )
      and is_active
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists admin_can_read_contact_leads on public.contact_leads;
create policy admin_can_read_contact_leads
on public.contact_leads
for select
to authenticated
using (public.is_admin());
