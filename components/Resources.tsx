"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

const resources = [
  {
    title: "چرا تبلیغات اینستاگرام گاهی نتیجه نمی‌دهد؟",
    desc: "سه اشتباه رایج در تنظیم مخاطب و بودجه که بیشتر کسب‌وکارها مرتکب می‌شوند.",
  },
  {
    title: "چک‌لیست سئوی فنی برای سایت‌های ایرانی",
    desc: "مواردی که قبل از هر کمپین محتوا باید در سایت درست باشد تا گوگل سایت را جدی بگیرد.",
  },
  {
    title: "چطور محتوای فروشنده بنویسیم بدون اینکه تبلیغ به نظر برسد؟",
    desc: "روشی ساده برای نوشتن متنی که هم مشکل مشتری را بگوید هم راه‌حل شما را نشان دهد.",
  },
];

export default function Resources() {
  return (
    <section
      id="resources"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۸" title="منابع" />
            <p className="text-caption text-muted-foreground leading-persian">
              مطالب کاربردی برای کسانی که خودشان هم می‌خواهند یاد بگیرند.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-10"
            >
              چند مطلب مفید
            </motion.h2>

            <div className="space-y-0">
              {resources.map((item, i) => (
                <motion.a
                  key={i}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="block py-6 border-b border-border first:border-t group"
                >
                  <h3 className="text-lg font-bold mb-1.5 group-hover:text-accent transition-colors leading-persian-tight">
                    {item.title}
                  </h3>
                  <p className="text-caption text-muted-foreground leading-persian">
                    {item.desc}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
