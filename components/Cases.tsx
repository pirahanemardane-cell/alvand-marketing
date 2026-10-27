"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

const cases = [
  {
    industry: "فروشگاه اینترنتی پیراهن مردانه",
    problem:
      "برند پیراهن مردانه نیاز به فروشگاه آنلاین حرفه‌ای داشت تا فروش حضوری را به فضای دیجیتال گسترش دهد.",
    work: "طراحی و پیاده‌سازی فروشگاه اینترنتی با تجربه خرید روان، فیلتر محصول، سبد خرید و پرداخت آنلاین.",
    result: "راه‌اندازی فروش آنلاین و مسیر فروش دیجیتال مستقل از فروشگاه فیزیکی",
    duration: "طراحی سایت",
    image: "/cases/shirt-shop.jpg",
  },
  {
    industry: "تعاونی اتوبوس رانی",
    problem:
      "تعاونی اتوبوس‌رانی به حضور دیجیتال یکپارچه نیاز داشت: معرفی خدمات، جذب مسافر و دیده شدن در جستجو.",
    work: "طراحی سایت، سئو، تولید محتوا و اجرای تبلیغات اینترنتی برای پوشش کامل مسیر جذب مسافر.",
    result: "حضور آنلاین منسجم با امکان پیگیری ترافیک، محتوا و کمپین‌های تبلیغاتی",
    duration: "سایت + سئو + محتوا + تبلیغات",
    image: "/cases/bus-coop.jpg",
  },
  {
    industry: "نسپرسو — سایت شرکتی وردپرس",
    problem:
      "نیاز به وب‌سایت شرکتی مرتب و قابل مدیریت برای معرفی برند و خدمات در بستر وردپرس.",
    work: "طراحی و پیاده‌سازی سایت شرکتی وردپرس با ساختار صفحات، ظاهر حرفه‌ای و پنل مدیریت آسان.",
    result: "سایت شرکتی آماده انتشار با امکان به‌روزرسانی محتوا توسط تیم داخلی",
    duration: "وردپرس شرکتی",
    image: "/cases/coffee.jpg",
  },
  {
    industry: "امور تجاری — سایت شرکتی وردپرس",
    problem:
      "شرکت امور تجاری به وب‌سایت رسمی برای معرفی خدمات و ایجاد اعتماد در مخاطب سازمانی نیاز داشت.",
    work: "طراحی سایت وردپرس شرکتی با تمرکز بر معرفی خدمات، اعتبار برند و مسیر تماس واضح.",
    result: "وب‌سایت شرکتی حرفه‌ای به‌عنوان مرجع رسمی معرفی کسب‌وکار",
    duration: "وردپرس شرکتی",
    image: "/cases/office.jpg",
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
              چند نمونه از پروژه‌های انجام‌شده با شرح مشکل، کار انجام‌شده و نتیجه.
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
