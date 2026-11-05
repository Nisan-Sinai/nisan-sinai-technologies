-- Keep direct writes to leads disabled. The owner of this function may update
-- one lead only after the existing administrator check and status comparison.
create or replace function public.set_contact_lead_status(
  lead_id uuid,
  expected_status text,
  next_status text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  if not coalesce(
    (expected_status = 'new' and next_status = 'contacted')
    or (expected_status = 'contacted' and next_status = 'new'),
    false
  ) then
    raise exception 'Invalid lead status transition' using errcode = '22023';
  end if;

  update public.contact_leads
  set status = next_status
  where id = lead_id and status = expected_status;

  return found;
end;
$$;

revoke all on function public.set_contact_lead_status(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.set_contact_lead_status(uuid, text, text)
  to authenticated;
