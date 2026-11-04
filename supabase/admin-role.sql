-- Additive: profiles.role for DB-backed admin (safe to re-run).
-- Keep email allowlist in lib/admin.ts as fallback during migrate.
-- Run AFTER schema.sql (profiles table must exist).

alter table public.profiles
  add column if not exists role text not null default 'user';

-- Constrain allowed values (idempotent via drop/add)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('user', 'admin'));
  end if;
end $$;

create index if not exists profiles_role_idx on public.profiles (role);

-- Seed known allowlisted admin email(s)
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('alvandmarketing.com@gmail.com')
  and p.role is distinct from 'admin';

-- Block authenticated clients from elevating themselves; service_role JWT may change role.
create or replace function public.profiles_preserve_role()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE'
     and new.role is distinct from old.role
     and coalesce(auth.jwt() ->> 'role', '') is distinct from 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_preserve_role on public.profiles;
create trigger profiles_preserve_role
  before update on public.profiles
  for each row execute procedure public.profiles_preserve_role();

-- Signup trigger: auto-admin for allowlisted emails
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  initial_role text := 'user';
begin
  if lower(coalesce(new.email, '')) = lower('alvandmarketing.com@gmail.com') then
    initial_role := 'admin';
  end if;
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    initial_role
  )
  on conflict (id) do update
    set role = case
      when public.profiles.role = 'admin' then 'admin'
      when excluded.role = 'admin' then 'admin'
      else public.profiles.role
    end;
  return new;
end;
$$;
