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
5. `supabase/admin-role.sql` — ستون `profiles.role` (+ seed ادمین؛ allowlist ایمیل هنوز fallback است)

برای پروژهٔ از قبل راه‌اندازی‌شده، حداقل `hardening.sql`، `leads.sql` و `admin-role.sql` را اجرا کنید.

## ۳. Auth

- Authentication → Providers → **Email** را روشن کنید.
- برای تست محلی می‌توانید **Confirm email** را خاموش کنید.
- Site URL: دامنهٔ سایت (مثلاً `https://alvandmarketing.ir`).
- Redirect URLs (حتماً شامل callback):
  - `https://alvandmarketing.ir/**`
  - `https://alvandmarketing.ir/auth/callback`
  - `http://localhost:3000/**`
  - `http://localhost:3000/auth/callback`
  - `http://127.0.0.1:3000/**`
- تایید ایمیل / بازیابی رمز از مسیر `/auth/callback?next=…` رد می‌شود (نه مستقیم `/dashboard`).
- ادمین: `profiles.role = 'admin'` **یا** ایمیل allowlist در `lib/admin.ts` (`alvandmarketing.com@gmail.com`) به‌عنوان fallback مهاجرت.

## ۶. Rate limit / ضد اسپم (کد)

| مسیر | محدودیت | ضد اسپم |
|------|---------|---------|
| `POST /api/contact` | ۵ درخواست / ۱۵ دقیقه / IP (حافظهٔ سرور) | honeypot `website` + طول فیلد + محدودیت URL |
| `POST /api/comments` | ۸ / ۱۵ دقیقه / IP و per-user | لاگین اجباری + honeypot + ممنوعیت لینک |

این limiter در حافظه است (بدون Upstash). برای چند instance بعداً Redis بگذارید.

## ۷. Observability (اختیاری)

| نام env | کجا | نقش |
|---------|-----|-----|
| `SENTRY_DSN` | سرور / edge | ingest خطاهای سرور |
| `NEXT_PUBLIC_SENTRY_DSN` | مرورگر | ingest خطاهای کلاینت |

بدون این‌ها گزارش خطا no-op است (بدون وابستگی سنگین SDK؛ ingest سبک به Sentry).

Wiring:
- `instrumentation.ts` → `register` + `onRequestError`
- `components/SentryInit` → `initClientSentry` (+ `window.error` / `unhandledrejection`)
- `captureException` در APIهای تماس / نظرات / ادمین و مسیر عمومی بلاگ

## ۸. اعلان ایمیل فرم تماس (اختیاری)

اگر **هر دو** مقدار زیر ست شود، بعد از insert موفق در `contact_leads` یک ایمیل از طریق Resend فرستاده می‌شود؛ در غیر این صورت no-op (فرم همچنان ۲۰۰ برمی‌گرداند؛ lead ذخیره می‌شود):

| نام env | لازم؟ | نقش |
|---------|-------|-----|
| `RESEND_API_KEY` | بله (با هم) | API key رزند |
| `CONTACT_NOTIFY_EMAIL` | بله (با هم) | گیرنده اعلان |
| `CONTACT_NOTIFY_FROM` | خیر | پیش‌فرض `Alvand Contact <onboarding@resend.dev>` — برای دامنهٔ تأییدشده در Resend عوض کنید |

کد: `lib/contact-notify.ts` از `app/api/contact/route.ts`.

## ۹. دامنهٔ سایت برای sitemap / canonical

- اختیاری: `NEXT_PUBLIC_SITE_URL=https://alvandmarketing.ir` (پیش‌فرض همین دامنه در `lib/seo/site.ts` → sitemap / robots / `metadataBase`)
- اگر ردیف‌های SEO اشتباهاً noindex مانده‌اند: `supabase/enable-public-indexing.sql`

## ۴. Realtime (اختیاری)

برای به‌روزرسانی زندهٔ پنل ادمین: Database → Publications → `supabase_realtime` و جداول `blog_comments` / `profiles` را اضافه کنید (دستورهای کامنت‌شده در `hardening.sql`).

## ۵. تأیید نظرات

از **پنل ادمین → نظرات** (API امن با نشست ادمین) یا Table Editor ستون `approved` را `true` کنید.

لینک در متن نظر در API رد می‌شود. ثبت نظر فقط برای کاربر لاگین‌شده مجاز است.
