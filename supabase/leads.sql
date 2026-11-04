-- Lead capture for contact form (run in Supabase SQL Editor)

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 8 and 40),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads (created_at desc);

alter table public.contact_leads enable row level security;

-- No public read/write — inserts go through Next.js API with service role.
-- Optional: allow authenticated admins to read via service role APIs only.
