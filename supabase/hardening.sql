-- Additive hardening for existing projects (safe to re-run).
-- Run AFTER schema.sql and blog-seo.sql.

-- Users can see their own comments (pending + approved)
drop policy if exists "Users read own comments" on public.blog_comments;
create policy "Users read own comments"
  on public.blog_comments
  for select
  to authenticated
  using (auth.uid() = user_id);

create index if not exists blog_comments_user_id_idx
  on public.blog_comments (user_id);

-- Allow client-side profile upsert on register (trigger also creates rows)
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

-- Ensure update policy has WITH CHECK
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Make signup trigger idempotent
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Optional: enable Realtime for admin/dashboard live updates
-- (Dashboard → Database → Replication → add tables if not listed)
-- alter publication supabase_realtime add table public.blog_comments;
-- alter publication supabase_realtime add table public.profiles;
