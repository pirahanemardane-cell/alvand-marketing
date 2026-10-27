"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

const steps = [
  {
    num: "۱",
    title: "جلسه آشنایی",
    desc: "۳۰ تا ۴۵ دقیقه صحبت می‌کنیم تا بفهمیم کسب‌وکارتان کجاست، چه هدفی دارید و چه بودجه‌ای در نظر گرفته‌اید. این جلسه رایگان است.",
  },
  {
    num: "۲",
    title: "پیشنهاد شفاف",
    desc: "ظرف ۳ تا ۵ روز کاری، یک پیشنهاد کتبی می‌فرستیم: چه کاری انجام می‌شود، چقدر طول می‌کشد، و هزینه دقیق هر بخش چقدر است.",
  },
  {
    num: "۳",
    title: "شروع و هماهنگی",
    desc: "بعد از توافق، دسترسی‌های لازم را می‌گیریم (سایت، تبلیغات، اینستاگرام) و یک نفر از تیم به‌عنوان مسئول پروژه مشخص می‌شود.",
  },
  {
    num: "۴",
    title: "اجرا و گزارش ماهانه",
    desc: "کار را جلو می‌بریم و هر ماه یک گزارش ساده و قابل‌فهم می‌دهیم: چه کرده‌ایم، چه نتیجه‌ای گرفته‌اید، و قدم بعدی چیست.",
  },
  {
    num: "۵",
    title: "بهینه‌سازی مستمر",
    desc: "بر اساس داده‌ها، مسیر را اصلاح می‌کنیم. اگر چیزی جواب نداد، عوضش می‌کنیم — بدون اینکه شما مجبور باشید دنبال ما بدوید.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۲" title="فرآیند" />
            <p className="text-caption text-muted-foreground leading-persian">
              از اولین تماس تا نتیجه، مسیر مشخص و قابل پیش‌بینی است.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-12"
            >
              چطور با هم کار می‌کنیم؟
            </motion.h2>

            <div className="space-y-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="grid grid-cols-[48px_1fr] gap-5 py-6 border-b border-border first:border-t"
                >
                  <span className="text-2xl font-bold text-accent pt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold mb-2 leading-persian-tight">
                      {step.title}
                    </h3>
                    <p className="text-caption text-muted-foreground leading-persian">
                      {step.desc}
                    </p>
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
