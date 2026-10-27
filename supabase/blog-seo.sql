-- Blog + SEO for Alvand Marketing (run in Supabase SQL Editor)

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.blog_categories (id) on delete set null,
  author_id uuid references auth.users (id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_url text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  meta_title text,
  meta_description text,
  focus_keyphrase text,
  og_title text,
  og_description text,
  og_image_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  canonical_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

create table if not exists public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  title text,
  body_preview text,
  meta_title text,
  meta_description text,
  focus_keyphrases text[] default '{}',
  og_title text,
  og_description text,
  og_image_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  canonical_url text,
  updated_at timestamptz not null default now()
);

alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.seo_pages enable row level security;

drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
  on public.blog_posts for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Public read active categories" on public.blog_categories;
create policy "Public read active categories"
  on public.blog_categories for select to anon, authenticated
  using (is_active = true);

drop policy if exists "Public read seo pages" on public.seo_pages;
create policy "Public read seo pages"
  on public.seo_pages for select to anon, authenticated
  using (true);

insert into public.seo_pages (page_key, title, meta_title, meta_description)
values
  ('home', 'صفحه اصلی', 'الوند مارکتینگ | مثل کوه پشتتیم', 'آژانس دیجیتال مارکتینگ؛ طراحی سایت، سئو، محتوا و تبلیغات.'),
  ('services', 'خدمات', 'خدمات الوند مارکتینگ', 'طراحی سایت، سئو، تولید محتوا، تبلیغات اینترنتی.'),
  ('blog', 'بلاگ', 'بلاگ الوند مارکتینگ', 'مقالات تخصصی دیجیتال مارکتینگ و سئو.'),
  ('contact', 'تماس', 'تماس با الوند مارکتینگ', 'درخواست مشاوره رایگان.')
on conflict (page_key) do nothing;
