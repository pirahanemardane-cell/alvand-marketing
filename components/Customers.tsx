"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

const testimonials = [
  {
    quote:
      "قبل از همکاری، تبلیغاتمان فقط هزینه بود. بعد از سه ماه، هر تومان تبلیغ را می‌توانستیم ببینیم کجا رفته و چه نتیجه‌ای داده. گزارش‌ها شفاف و قابل فهم بود.",
    name: "مدیر فروش یک فروشگاه آنلاین پوشاک",
  },
  {
    quote:
      "سایت قبلی‌مان زیبا بود اما مشتری پیدا نمی‌کرد. بعد از بازطراحی و سئو، تماس‌های ورودی تقریباً دو برابر شد. تیم الوند صبور بود و تا وقتی نتیجه نگرفتیم، دست از کار نکشید.",
    name: "صاحب کسب‌وکار خدمات آموزشی",
  },
  {
    quote:
      "محتوای اینستاگراممان قبلاً فقط لایک می‌گرفت. الان از همان محتوا مشتری هم می‌آید. فرق کار حرفه‌ای با کار روزمره را اینجا فهمیدم.",
    name: "برند محصولات خانگی",
  },
];

export default function Customers() {
  return (
    <section
      id="customers"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۱۱" title="مشتریان" />
            <p className="text-caption text-muted-foreground leading-persian">
              حرف کسانی که با ما کار کرده‌اند.
            </p>
          </div>

          <div className="space-y-8">
            {testimonials.map((item, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-r-2 border-accent pr-6"
              >
                <p className="text-lg md:text-xl leading-persian mb-4">
                  «{item.quote}»
                </p>
                <footer className="text-caption text-muted-foreground">
                  — {item.name}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
