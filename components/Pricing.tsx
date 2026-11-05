"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "./SectionLabel";

const packages = [
  {
    name: "پکیج طراحی سایت",
    suitable: "سایت شرکتی یا فروشگاهی ریسپانسیو با تمرکز بر سرعت و مسیر تماس",
    items: [
      "طراحی UI/UX ریسپانسیو و وایرفریم تأییدشده",
      "پیاده‌سازی با استانداردهای سرعت و سئو فنی",
      "فرم تماس و اتصال مستقیم به واتساپ",
      "آموزش مدیریت محتوا برای تیم شما",
      "پشتیبانی اولیه پس از تحویل",
    ],
    href: "/services/طراحی-سایت",
  },
  {
    name: "پکیج تولید محتوا",
    suitable: "متن صفحات، مقاله سئوشده و محتوای اینستاگرام که به اقدام ختم شود",
    items: [
      "متن صفحات اصلی سایت",
      "مقالات بلاگ سئوشده",
      "کپشن و سناریوی اینستاگرام",
      "راهنمای لحن برند",
      "نگارش یا نگارش همراه با انتشار",
    ],
    href: "/services/تولید-محتوا",
  },
  {
    name: "پکیج سئو",
    suitable: "رتبه پایدار روی کلماتی که مشتری واقعی می‌آورند",
    items: [
      "آدیت فنی و محتوایی",
      "فهرست کلمات کلیدی اولویت‌دار",
      "بهینه‌سازی صفحات اصلی",
      "سئو محلی و گوگل مپ",
      "گزارش ماهانه رتبه و ترافیک",
    ],
    href: "/services/سئو",
  },
  {
    name: "پکیج هوش مصنوعی",
    suitable: "کاهش زمان کارهای تکراری با نظارت انسانی",
    items: [
      "طراحی جریان کار با نقطه کنترل انسانی",
      "پرامپت و قالب آماده متناسب با لحن برند",
      "اتصال به فرآیند محتوا یا پشتیبانی",
      "راه‌اندازی چت‌بات در صورت نیاز",
      "آموزش استفاده به تیم شما",
    ],
    href: "/services/هوش-مصنوعی",
  },
  {
    name: "پکیج اینستاگرام",
    suitable: "مدیریت پیج با هدف لید و فروش، نه فقط افزایش فالوور",
    items: [
      "استراتژی و تقویم محتوا",
      "تولید و انتشار پست و استوری",
      "عکاسی و ویدئوی محصول",
      "پاسخ‌گویی اولیه به دایرکت (در صورت توافق)",
      "گزارش ماهانه عملکرد",
    ],
    href: "/services/اینستاگرام",
  },
  {
    name: "پکیج تبلیغات اینترنتی",
    suitable: "کمپین با هدف مشخص و گزارش هفتگی هزینه به‌ازای نتیجه",
    items: [
      "طراحی و راه‌اندازی کمپین گوگل و اینستاگرام",
      "ساخت صفحه فرود در صورت نیاز",
      "بهینه‌سازی هفتگی",
      "گزارش هزینه به‌ازای نتیجه",
      "تصمیم ادامه یا توقف بر اساس داده",
    ],
    href: "/services/تبلیغات-اینترنتی",
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
            <SectionLabel number="۰۴" title="برآورد" />
            <p className="text-caption text-muted-foreground leading-persian">
              عدد ثابتی اعلام نمی‌کنیم. هر خدمت پکیج جدا دارد؛ برآورد بعد از شناخت کسب‌وکار شما در مشاوره رایگان مشخص می‌شود.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-4"
            >
              پکیج‌ها؛ برآورد با مشاوره
            </motion.h2>
            <p className="text-caption text-muted-foreground leading-persian mb-12 max-w-2xl">
              برای دریافت برآورد اختصاصی از{" "}
              <Link href="/contact" className="font-bold text-accent hover:opacity-80 transition-opacity">
                فرم تماس
              </Link>{" "}
              یا{" "}
              <a href="tel:+982186095954" className="font-bold text-accent hover:opacity-80 transition-opacity" dir="ltr">
                تماس تلفنی
              </a>{" "}
              پیام بدهید.
            </p>

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
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/contact"
                      className="text-sm font-bold text-accent hover:opacity-80 transition-opacity inline-flex items-center gap-1"
                    >
                      مشاوره و برآورد
                      <span className="text-xs">←</span>
                    </Link>
                    <Link
                      href={pkg.href}
                      className="text-caption text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      جزئیات خدمت
                      <span className="text-xs">←</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
