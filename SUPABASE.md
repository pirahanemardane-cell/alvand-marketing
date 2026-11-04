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

**بدون این سه مقدار:** صفحات عمومی کار می‌کنند؛ پنل کاربری/ادمین و APIهای نوشته به سوپابیس پاسخ `401/403/503` می‌دهند و کلاینت به‌جای crash به `/login` هدایت می‌شود.

## ۲. SQL (به ترتیب)

در سوپابیس: **SQL Editor → New query** و به‌ترتیب اجرا کنید:

1. `supabase/schema.sql` — نظرات، پروفایل، RLS پایه  
2. `supabase/blog-seo.sql` — جداول بلاگ و SEO صفحات  
3. `supabase/hardening.sql` — سیاست‌های تکمیلی (خواندن نظرات خود کاربر، insert پروفایل)  
4. `supabase/leads.sql` — جدول `contact_leads` برای فرم تماس

برای پروژهٔ از قبل راه‌اندازی‌شده، حداقل `hardening.sql` و `leads.sql` را اجرا کنید.

## ۳. Auth

- Authentication → Providers → **Email** را روشن کنید.
- برای تست محلی می‌توانید **Confirm email** را خاموش کنید.
- Site URL: دامنهٔ سایت (مثلاً `https://alvandmarketing.ir`).
- Redirect URLs: `https://alvandmarketing.ir/**` و `http://localhost:3000/**`
- ادمین فعلی با ایمیل hard-coded در `lib/admin.ts` شناخته می‌شود (`alvandmarketing.com@gmail.com`).

## ۴. Realtime (اختیاری)

برای به‌روزرسانی زندهٔ پنل ادمین: Database → Publications → `supabase_realtime` و جداول `blog_comments` / `profiles` را اضافه کنید (دستورهای کامنت‌شده در `hardening.sql`).

## ۵. تأیید نظرات

از **پنل ادمین → نظرات** (API امن با نشست ادمین) یا Table Editor ستون `approved` را `true` کنید.

لینک در متن نظر در API رد می‌شود. ثبت نظر فقط برای کاربر لاگین‌شده مجاز است.
