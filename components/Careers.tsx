"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

export default function Careers() {
  return (
    <section
      id="careers"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۷" title="همکاری" />
            <p className="text-caption text-muted-foreground leading-persian">
              اگر کار درست و شفاف را دوست دارید، جای شما اینجاست.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-6"
            >
              به تیم الوند بپیوندید
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground leading-persian mb-8"
            >
              ما به دنبال کسانی هستیم که جزئیات را می‌بینند، قول بی‌پایه نمی‌دهند و وقتی مشکلی پیش می‌آید، خودشان دنبال راه‌حل می‌روند.
              <br className="hidden sm:block" />
              اگر تجربه‌ای در سئو، تولید محتوا، طراحی یا تبلیغات دارید و می‌خواهید روی پروژه‌های واقعی کار کنید، رزومه‌تان را بفرستید.
            </motion.p>
            <motion.a
              href="mailto:jobs@alvandmarketing.ir"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-6 py-2.5 rounded-full border border-border text-sm hover:bg-white/5 transition-colors"
            >
              ارسال رزومه
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
