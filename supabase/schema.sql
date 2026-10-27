-- اجرا در SQL Editor سوپابیس

-- نظرات بلاگ (فقط بعد از تایید ادمین نمایش داده می‌شوند)
create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  author_name text not null check (char_length(author_name) between 2 and 80),
  author_email text,
  user_id uuid references auth.users (id) on delete set null,
  body text not null check (char_length(body) between 3 and 1000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_post_slug_idx
  on public.blog_comments (post_slug);

create index if not exists blog_comments_approved_idx
  on public.blog_comments (approved);

alter table public.blog_comments enable row level security;

-- خواندن عمومی: فقط تاییدشده‌ها
drop policy if exists "Public read approved comments" on public.blog_comments;
create policy "Public read approved comments"
  on public.blog_comments
  for select
  to anon, authenticated
  using (approved = true);

-- درج توسط کاربر لاگین‌شده (همیشه approved=false)
drop policy if exists "Authenticated insert pending comments" on public.blog_comments;
create policy "Authenticated insert pending comments"
  on public.blog_comments
  for insert
  to authenticated
  with check (
    approved = false
    and auth.uid() = user_id
  );

-- درج مهمان از API با service role انجام می‌شود (RLS دور زده می‌شود)
-- ادمین: در Table Editor ستون approved را true کنید

-- پروفایل ساده (اختیاری)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

-- ساخت پروفایل بعد از ثبت‌نام
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
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
