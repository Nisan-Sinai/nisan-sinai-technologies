grant select on table public.contact_leads to authenticated;

drop policy if exists "admin_can_read_contact_leads" on public.contact_leads;

create policy "admin_can_read_contact_leads"
  on public.contact_leads
  for select
  to authenticated
  using (
    lower(coalesce(
      nullif(current_setting('request.jwt.claim.email', true), ''),
      (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'),
      ''
    )) = 'nisan.sinai5@gmail.com'
  );
