"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "./SectionLabel";

const packages = [
  {
    name: "پکیج طراحی سایت",
    suitable: "برای برندهایی که سایت سریع، واضح و تبدیل‌محور می‌خواهند",
    items: [
      "طراحی UI/UX ریسپانسیو",
      "پیاده‌سازی استاندارد سرعت و سئو فنی",
      "فرم تماس و اتصال به واتساپ",
      "آموزش مدیریت محتوا",
      "پشتیبانی اولیه بعد از تحویل",
    ],
    href: "/خدمات/طراحی-سایت",
  },
  {
    name: "پکیج تولید محتوا",
    suitable: "برای کسانی که متن واقعی و اثرگذار می‌خواهند، نه پر کردن صفحه",
    items: [
      "متن صفحات اصلی سایت",
      "مقالات بلاگ سئو شده",
      "کپشن و سناریوی اینستاگرام",
      "بازبینی لحن برند",
      "تحویل قابل انتشار",
    ],
    href: "/خدمات/تولید-محتوا",
  },
  {
    name: "پکیج سئو",
    suitable: "برای رشد پایدار ترافیک از گوگل روی کلمات واقعی بازار",
    items: [
      "آدیت فنی و محتوایی",
      "تحقیق کلمات کلیدی اولویت‌دار",
      "بهینه‌سازی صفحات اصلی",
      "پایش رتبه و ترافیک",
      "گزارش ماهانه شفاف",
    ],
    href: "/خدمات/سئو",
  },
  {
    name: "پکیج هوش مصنوعی",
    suitable: "برای تیم‌هایی که می‌خواهند کار تکراری را هوشمند و کنترل‌شده کنند",
    items: [
      "طراحی جریان کار با ابزارهای AI",
      "قالب و پرامپت آماده برای تیم شما",
      "اتصال به محتوا یا پشتیبانی",
      "آموزش استفاده به تیم",
      "نظارت انسانی روی خروجی",
    ],
    href: "/خدمات/هوش-مصنوعی",
  },
  {
    name: "پکیج اینستاگرام",
    suitable: "برای پیج‌هایی که فالوور واقعی و تبدیل به مشتری می‌خواهند",
    items: [
      "استراتژی و تقویم محتوا",
      "تولید و انتشار پست و استوری",
      "پاسخ‌گویی اولیه به دایرکت (در صورت توافق)",
      "گزارش ماهانه عملکرد",
      "بهینه‌سازی بر اساس داده",
    ],
    href: "/خدمات/اینستاگرام",
  },
  {
    name: "پکیج تبلیغات اینترنتی",
    suitable: "برای کمپین‌هایی که هدف مشخص و گزارش هزینه به‌ازای نتیجه دارند",
    items: [
      "طراحی و راه‌اندازی کمپین",
      "ساخت یا بهینه‌سازی لندینگ",
      "پایش و بهینه‌سازی هفتگی",
      "گزارش شفاف عملکرد",
      "پیشنهاد ادامه یا توقف بر اساس داده",
    ],
    href: "/خدمات/تبلیغات-اینترنتی",
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۴" title="هزینه" />
            <p className="text-caption text-muted-foreground leading-persian">
              هر خدمت پکیج جدا دارد. جزئیات و برآورد بعد از شناخت کسب‌وکار شماست.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-12"
            >
              حدود هزینه همکاری
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-6 flex flex-col"
                >
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-caption text-muted-foreground leading-persian mb-5">
                    {pkg.suitable}
                  </p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {pkg.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-persian flex gap-2"
                      >
                        <span className="text-accent shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={pkg.href}
                    className="text-sm font-bold text-accent hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                  >
                    جزئیات خدمت
                    <span className="text-xs">←</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
