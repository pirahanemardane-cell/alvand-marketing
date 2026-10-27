"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-5 py-16 sm:px-8 md:px-12">
      <div className="mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-3">الوند مارکتینگ</h3>
            <p className="text-caption text-muted-foreground leading-persian">
              تیم بازاریابی دیجیتال که روی نتیجه تمرکز می‌کند، نه فقط روی
              گزارش. از طراحی سایت تا تبلیغات و محتوا، کنار کسب‌وکار شما
              می‌مانیم.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">خدمات دیجیتال مارکتینگ</h4>
            <ul className="space-y-2.5 text-caption text-muted-foreground">
              <li>
                <Link href="/خدمات/طراحی-سایت" className="hover:text-foreground transition-colors">
                  طراحی سایت
                </Link>
              </li>
              <li>
                <Link href="/خدمات/تولید-محتوا" className="hover:text-foreground transition-colors">
                  تولید محتوا
                </Link>
              </li>
              <li>
                <Link href="/خدمات/سئو" className="hover:text-foreground transition-colors">
                  سئو
                </Link>
              </li>
              <li>
                <Link href="/خدمات/اینستاگرام" className="hover:text-foreground transition-colors">
                  اینستاگرام
                </Link>
              </li>
              <li>
                <Link href="/خدمات/تبلیغات-اینترنتی" className="hover:text-foreground transition-colors">
                  تبلیغات اینترنتی
                </Link>
              </li>
              <li>
                <Link href="/خدمات/هوش-مصنوعی" className="hover:text-foreground transition-colors">
                  هوش مصنوعی
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">سایت</h4>
            <ul className="space-y-2.5 text-caption text-muted-foreground">
              <li>
                <Link href="/خدمات" className="hover:text-foreground transition-colors">
                  همه خدمات
                </Link>
              </li>
              <li>
                <a href="/#process" className="hover:text-foreground transition-colors">
                  فرآیند همکاری
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-foreground transition-colors">
                  حدود هزینه
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-foreground transition-colors">
                  سؤالات پرتکرار
                </a>
              </li>
              <li>
                <Link href="/بلاگ" className="hover:text-foreground transition-colors">
                  بلاگ
                </Link>
              </li>
              <li>
                <Link href="/تماس" className="hover:text-foreground transition-colors">
                  مشاوره رایگان
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">تماس</h4>
            <ul className="space-y-2.5 text-caption text-muted-foreground">
              <li>
                <a href="https://wa.me/989921863063" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  واتساپ
                </a>
              </li>
              <li>
                <a href="https://t.me/alvandmarketing" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  تلگرام
                </a>
              </li>
              <li>
                <a href="mailto:info@alvandmarketing.ir" className="hover:text-foreground transition-colors">
                  info@alvandmarketing.ir
                </a>
              </li>
              <li>
                <a href="tel:+989921863063" className="hover:text-foreground transition-colors">
                  ۰۹۹۲۱۸۶۳۰۶۳
                </a>
              </li>
              <li>
                <a href="tel:+982186095954" className="hover:text-foreground transition-colors">
                  ۰۲۱-۸۶۰۹۵۹۵۴
                </a>
              </li>
              <li>تهران</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-8 border-t border-border text-caption text-muted-foreground">
          <span>© ۱۴۰۵ الوند مارکتینگ</span>
          <span>مثل کوه پشتتیم</span>
        </div>
      </div>
    </footer>
  );
}
