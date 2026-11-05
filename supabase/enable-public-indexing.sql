-- Ensure public SEO rows stay crawlable (idempotent; no content invent).
-- Run in Supabase SQL Editor if any seo_pages / published posts were left noindex.

update public.seo_pages
set
  robots_index = true,
  robots_follow = true,
  updated_at = now()
where robots_index is distinct from true
   or robots_follow is distinct from true;

update public.blog_posts
set
  robots_index = true,
  robots_follow = true,
  updated_at = now()
where status = 'published'
  and (
    robots_index is distinct from true
    or robots_follow is distinct from true
  );
