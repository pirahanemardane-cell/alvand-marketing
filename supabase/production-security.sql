-- Production security: one admin email, no client role changes, tighter RLS.
-- Safe to re-run. Apply on project alvandmarketingcom (xmethizicfpmyersznii).

-- Case-insensitive auth metadata. Only the designated mailbox is admin.
create or replace function public.protect_user_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(coalesce(new.email, '')) = 'alvandmarketing.com@gmail.com' then
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
  else
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"user"}'::jsonb;
    new.raw_user_meta_data :=
      coalesce(new.raw_user_meta_data, '{}'::jsonb) || '{"role":"user"}'::jsonb;
  end if;
  return new;
end;
$$;

create or replace function public.enforce_user_roles()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(coalesce(new.email, '')) = 'alvandmarketing.com@gmail.com' then
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
    new.raw_user_meta_data :=
      coalesce(new.raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
  else
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"user"}'::jsonb;
    new.raw_user_meta_data :=
      coalesce(new.raw_user_meta_data, '{}'::jsonb) || '{"role":"user"}'::jsonb;
  end if;
  return new;
end;
$$;

create or replace function public.get_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when auth.uid() is null then null
    when (
      select lower(email) from auth.users where id = auth.uid()
    ) = 'alvandmarketing.com@gmail.com' then 'admin'
    else 'user'
  end;
$$;

-- Profiles role follows the auth email on insert and update.
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

-- Signup never preserves a stale admin role on any other account.
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

update public.profiles p
set role = case
  when lower(u.email) = 'alvandmarketing.com@gmail.com' then 'admin'
  else 'user'
end
from auth.users u
where u.id = p.id
  and p.role is distinct from (
    case
      when lower(u.email) = 'alvandmarketing.com@gmail.com' then 'admin'
      else 'user'
    end
  );

-- These functions are triggers or internal helpers, not a public RPC API.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.profiles_preserve_role() from public, anon, authenticated;
revoke all on function public.protect_user_role() from public, anon, authenticated;
revoke all on function public.enforce_user_roles() from public, anon, authenticated;
revoke all on function public.get_user_role() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

-- Own-row policies: initplan form of auth.uid() (same access, cheaper plans).
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users read own comments" on public.blog_comments;
create policy "Users read own comments"
  on public.blog_comments for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Authenticated insert pending comments" on public.blog_comments;
create policy "Authenticated insert pending comments"
  on public.blog_comments for insert to authenticated
  with check (
    approved = false
    and (select auth.uid()) = user_id
  );

-- contact_leads stays service-role only. An explicit deny documents that.
drop policy if exists "No client access" on public.contact_leads;
create policy "No client access"
  on public.contact_leads
  for all
  to anon, authenticated
  using (false)
  with check (false);

alter table public.profiles force row level security;
alter table public.blog_comments force row level security;
alter table public.blog_posts force row level security;
alter table public.blog_categories force row level security;
alter table public.seo_pages force row level security;
alter table public.contact_leads force row level security;
