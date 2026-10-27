"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

const cases = [
  {
    industry: "فروشگاه آنلاین پوشاک",
    problem: "تبلیغات اینستاگرام هزینه می‌کرد ولی فروش ثابت نبود.",
    work: "بازطراحی قیف فروش، تنظیم مجدد مخاطب تبلیغات و بهینه‌سازی صفحه فرود.",
    result: "افزایش ۸.۵ برابری ترافیک هدفمند و ۲۲٪ بهبود نرخ تبدیل در ۴ ماه",
    duration: "۴ ماه",
    image: "https://hirael.com/media/templates/aurael/morning.jpg",
  },
  {
    industry: "خدمات آموزشی آنلاین",
    problem: "سایت زیبا بود اما در گوگل دیده نمی‌شد و تماس ورودی کم بود.",
    work: "سئوی فنی + تولید محتوای هدفمند روی کلمات کلیدی واقعی بازار ایران.",
    result: "تقریباً دو برابر شدن تماس‌های ورودی و رتبه صفحه اول برای ۳ کلمه اصلی",
    duration: "۶ ماه",
    image: "https://hirael.com/media/templates/aurael/night.jpg",
  },
  {
    industry: "برند محصولات خانگی",
    problem: "پیج اینستاگرام لایک می‌گرفت ولی مشتری نمی‌آورد.",
    work: "تغییر استراتژی محتوا، استوری‌های فروشنده و کمپین ریتارگتینگ.",
    result: "رشد پایدار فالوور واقعی و تبدیل محتوا به فروش قابل اندازه‌گیری",
    duration: "۳ ماه",
    image: "https://hirael.com/media/templates/aurael/morning.jpg",
  },
];

export default function Cases() {
  return (
    <section
      id="cases"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۳" title="پروژه‌ها" />
            <p className="text-caption text-muted-foreground leading-persian">
              چند نمونه واقعی با مشکل، کار انجام‌شده و نتیجه قابل اندازه‌گیری.
            </p>
          </div>

          <div className="space-y-10">
            {cases.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden border border-border bg-card"
              >
                <img
                  src={item.image}
                  alt={item.industry}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {item.industry}
                    </span>
                    <span>·</span>
                    <span>{item.duration}</span>
                  </div>
                  <p className="text-sm leading-persian">
                    <span className="text-muted-foreground">مشکل: </span>
                    {item.problem}
                  </p>
                  <p className="text-sm leading-persian">
                    <span className="text-muted-foreground">کار ما: </span>
                    {item.work}
                  </p>
                  <p className="text-sm font-bold leading-persian text-accent">
                    نتیجه: {item.result}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-bold leading-persian"
            >
              هر پروژه را با یک سؤال شروع می‌کنیم: «موفقیت برای شما دقیقاً یعنی
              چه عددی؟» بعد همان را دنبال می‌کنیم.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
