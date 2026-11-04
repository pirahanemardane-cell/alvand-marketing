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

Envهای مهم:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- اختیاری: `NEXT_PUBLIC_SITE_URL`، `SENTRY_DSN`، `NEXT_PUBLIC_SENTRY_DSN`

SEO: `robots.txt` و `sitemap.xml` پویا؛ صفحات عمومی به‌صورت پیش‌فرض indexable هستند.
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
