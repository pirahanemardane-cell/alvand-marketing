"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "./SectionLabel";

const stats = [
  { value: "۴۰۰+", label: "پروژه تحویل‌شده" },
  { value: "۳.۲M", label: "بازدید ماهانه مشتریان" },
  { value: "۹", label: "صنعت مختلف" },
  { value: "۷ سال", label: "فعالیت مستمر" },
];

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <SectionLabel number="۰۵" title="درباره ما" />

        <div className="grid md:grid-cols-2 gap-14 items-center mt-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6 leading-persian-tight"
            >
              چرا الوند را انتخاب می‌کنند؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground leading-persian mb-4 text-justify"
            >
              خیلی از کسب‌وکارها بعد از چند ماه کار با آژانس‌ها ناامید می‌شوند: گزارش‌های پیچیده، وعده‌های بزرگ و نتیجه کم. ما از همان روز اول مشخص می‌کنیم چه چیزی قابل اندازه‌گیری است و هر ماه همان را بررسی می‌کنیم.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground leading-persian mb-8 text-justify"
            >
              تیم ما هفت سال در بازار ایران کار کرده؛ با محدودیت‌های تبلیغات، رفتار خریدار ایرانی و تفاوت‌های هر صنعت آشناست. هدف‌مان این است که شما بعد از چند ماه، خودتان هم ببینید چه تغییری ایجاد شده.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link
                href="/تماس"
                className="inline-block px-6 py-2.5 rounded-full border border-border text-sm hover:bg-white/5 transition-colors"
              >
                صحبت کنیم
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="text-3xl font-semibold mb-1">{stat.value}</div>
                <div className="text-caption text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
