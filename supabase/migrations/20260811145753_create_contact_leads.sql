create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  business_name text check (
    business_name is null
    or char_length(btrim(business_name)) between 1 and 100
  ),
  phone text not null check (char_length(btrim(phone)) between 7 and 24),
  email text check (
    email is null
    or char_length(btrim(email)) between 3 and 160
  ),
  service text check (
    service is null
    or service in ('website', 'crm', 'erp', 'automation', 'custom', 'other')
  ),
  message text not null check (char_length(btrim(message)) between 10 and 1500),
  source text not null default 'nisan-sinai-tech-site'
    check (source = 'nisan-sinai-tech-site'),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now()
);

comment on table public.contact_leads is
  'Contact requests from the Nisan Sinai Technologies website';

alter table public.contact_leads enable row level security;

revoke all on table public.contact_leads from anon, authenticated;
grant insert (name, business_name, phone, email, service, message, source)
  on table public.contact_leads to anon, authenticated;

create policy "public_can_submit_contact_leads"
  on public.contact_leads
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(name)) between 2 and 80
    and char_length(btrim(phone)) between 7 and 24
    and char_length(btrim(message)) between 10 and 1500
    and source = 'nisan-sinai-tech-site'
    and status = 'new'
  );
