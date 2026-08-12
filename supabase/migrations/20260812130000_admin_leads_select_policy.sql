grant select on table public.contact_leads to authenticated;

create policy "admin_can_read_contact_leads"
  on public.contact_leads
  for select
  to authenticated
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = 'nisan.sinai5@gmail.com'
  );
