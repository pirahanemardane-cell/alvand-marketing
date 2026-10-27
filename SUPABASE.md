# راه‌اندازی Supabase برای الوند مارکتینگ

## ۱. متغیرهای محیطی

در ریشه پروژه فایل `.env.local` بسازید:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

مقادیر را از **Project Settings → API** کپی کنید.

در Vercel: Project → Settings → Environment Variables همان سه متغیر را اضافه کنید.

## ۲. SQL

در سوپابیس: **SQL Editor → New query** و محتوای فایل `supabase/schema.sql` را اجرا کنید.

## ۳. Auth

- Authentication → Providers → **Email** را روشن کنید.
- اگر می‌خواهید بدون تأیید ایمیل وارد شوند: Authentication → Providers → Email → **Confirm email** را خاموش کنید (برای تست).
- Site URL را روی دامنه سایت بگذارید (مثلاً `https://alvandmarketing.ir`).
- Redirect URLs: `https://alvandmarketing.ir/**` و `http://localhost:3000/**`

## ۴. تأیید نظرات ادمین

Table Editor → `blog_comments` → ردیف‌های با `approved = false` را ببینید و برای انتشار `approved` را `true` کنید.

لینک در متن نظر در API رد می‌شود.
