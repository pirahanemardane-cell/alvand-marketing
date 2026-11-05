-- Smoke / e2e debris cleanup for Alvand Marketing
-- Prefer service-role Admin API for auth.users; this SQL covers public tables.
-- NEVER delete alvandmarketing.com@gmail.com

delete from public.blog_comments
where post_slug ilike '%smoke%'
   or author_name ilike '%smoke%'
   or body ilike '%smoke%'
   or author_name ilike '%e2e%';

delete from public.blog_posts
where slug ilike '%smoke%'
   or title ilike '%smoke%'
   or coalesce(excerpt, '') ilike '%smoke%';

delete from public.contact_leads
where name ilike '%smoke%'
   or coalesce(message, '') ilike '%smoke%'
   or name ilike '%e2e%';

insert into public.blog_categories (name, slug, sort_order, description, is_active)
values
  ('طراحی سایت', 'طراحی-سایت', 1, 'مقالات طراحی و توسعه وب', true),
  ('تولید محتوا', 'تولید-محتوا', 2, 'محتوای بازاریابی و کپی‌رایتینگ', true),
  ('سئو', 'سئو', 3, 'سئو فنی و محتوایی', true),
  ('هوش مصنوعی', 'هوش-مصنوعی', 4, 'کاربرد AI در بازاریابی', true),
  ('اینستاگرام', 'اینستاگرام', 5, 'مدیریت و رشد اینستاگرام', true),
  ('تبلیغات اینترنتی', 'تبلیغات-اینترنتی', 6, 'گوگل ادز و تبلیغات پولی', true)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    description = excluded.description,
    is_active = true;
