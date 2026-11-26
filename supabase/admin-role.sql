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

-- Block clients from choosing a role. The designated email is always admin;
-- every other account is always a regular user, including service-role writes.
create or replace function public.profiles_preserve_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_email text;
begin
  select lower(u.email) into user_email
  from auth.users u
  where u.id = new.id;

  if user_email = 'alvandmarketing.com@gmail.com' then
    new.role := 'admin';
  else
    new.role := 'user';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_preserve_role on public.profiles;
create trigger profiles_preserve_role
  before insert or update on public.profiles
  for each row execute procedure public.profiles_preserve_role();

-- Signup trigger: admin only for the designated email. Never keep a stale admin role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  initial_role text := 'user';
begin
  if lower(coalesce(new.email, '')) = 'alvandmarketing.com@gmail.com' then
    initial_role := 'admin';
  end if;
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    initial_role
  )
  on conflict (id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name),
        role = case
          when lower(coalesce(new.email, '')) = 'alvandmarketing.com@gmail.com' then 'admin'
          else 'user'
        end;
  return new;
end;
$$;
