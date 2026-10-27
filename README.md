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
cd alvand-next
npm install
npm run dev
```

سپس به آدرس `http://localhost:3000` برو.

## ساخت نسخه پروداکشن

```bash
npm run build
npm start
```

## ساختار

```
app/
  layout.tsx      # فونت فارسی + metadata
  page.tsx        # صفحه اصلی
  globals.css     # تم و متغیرها
components/
  Navbar.tsx
  Hero.tsx        # Morning/Night toggle + ambient background
  Services.tsx
  Cases.tsx
  About.tsx
  Careers.tsx
  Resources.tsx
  Customers.tsx
  Footer.tsx
  SectionLabel.tsx
```

## دامنه

آماده برای استقرار روی `alvandmarketing.ir`
