-- The public contact form remains insert-only. Authenticated users gain SELECT
-- at the table level, but RLS filters every row unless the JWT belongs to the
-- one administrator allowed to open /admin.
grant select on table public.contact_leads to authenticated;

drop policy if exists admin_can_read_contact_leads on public.contact_leads;
create policy admin_can_read_contact_leads
on public.contact_leads
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'nisan.sinai5@gmail.com');
