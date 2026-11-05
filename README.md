# الوند مارکتینگ — Alvand Marketing

سایت برند الوند مارکتینگ با شعار **«مثل کوه پشتتیم»**

ساخته‌شده با:
- Next.js 15
- React 19
- Tailwind CSS
- Framer Motion (انیمیشن‌های اسکرول، ترنزیشن‌ها، ambient drift)
- RTL کامل + فونت وزیرمتن

## اجرا

```bash
npm install
npm run dev
```

سپس به آدرس `http://localhost:3000` برو.

برای Auth و نظرات، فایل `.env.local` را طبق `SUPABASE.md` بسازید.

Envهای مهم (نام‌ها فقط — مقادیر را در چت paste نکنید؛ از `.env.example` / Cursor Secrets / Vercel استفاده کنید):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- تصاویر CDN (R2): `NEXT_PUBLIC_R2_PUBLIC_BASE_URL`؛ آپلود: `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` — سپس `npm run media:migrate-r2`
- اختیاری سایت: `NEXT_PUBLIC_SITE_URL`
- اختیاری Sentry (no-op بدون DSN): `SENTRY_DSN` (سرور)، `NEXT_PUBLIC_SENTRY_DSN` (مرورگر)
- اختیاری اعلان ایمیل فرم تماس (no-op مگر هر دو ست شوند): `RESEND_API_KEY`، `CONTACT_NOTIFY_EMAIL`؛ اختیاری `CONTACT_NOTIFY_FROM`

SEO: `robots.txt` و `sitemap.xml` پویا؛ `metadataBase` برای canonical مطلق؛ صفحات عمومی index/follow؛ مسیرهای auth/پنل noindex.
پیش‌نمایش پیش‌نویس بلاگ برای ادمین: `/blog/<slug>?preview=1`

## ساخت نسخه پروداکشن

```bash
npm run build
npm start
```

## مسیرهای اصلی

| مسیر | توضیح |
|------|--------|
| `/` | صفحه اصلی |
| `/services` | خدمات (بازنویسی از `/خدمات`) |
| `/blog` | بلاگ (بازنویسی از `/بلاگ`) |
| `/contact` | تماس (بازنویسی از `/تماس`) |
| `/login` `/register` | ورود و ثبت‌نام |

## ساختار

```
app/
  layout.tsx
  page.tsx
  services/ contact/ blog/
  login/ register/ dashboard/ admin/
components/
  Navbar.tsx Hero.tsx Services.tsx ...
lib/supabase/   # کلاینت سوپابیس
middleware.ts    # بازنویسی URLهای فارسی قدیمی
```

## دامنه

آماده برای استقرار روی `alvandmarketing.ir`
