"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLabel from "./SectionLabel";

const faqs = [
  {
    q: "حداقل بودجه همکاری چقدر است؟",
    a: "برای همکاری ماهانه معمولاً از حدود ۱۵ میلیون تومان شروع می‌شود (بدون بودجه تبلیغات). پروژه‌های تک‌مرحله‌ای مثل طراحی سایت از مبالغ پایین‌تر هم قابل بررسی است. در جلسه اول محدوده دقیق را مشخص می‌کنیم.",
  },
  {
    q: "قرارداد چند ماهه است؟",
    a: "برای خدمات ماهانه (سئو، محتوا، مدیریت اینستاگرام، تبلیغات) حداقل ۳ ماه پیشنهاد می‌کنیم؛ چون نتیجه واقعی معمولاً بعد از این مدت دیده می‌شود. پروژه‌های مشخص (مثل طراحی سایت) طبق زمان‌بندی همان پروژه بسته می‌شود.",
  },
  {
    q: "اگر نتیجه نداد چه می‌شود؟",
    a: "از اول معیار موفقیت را با هم می‌نویسیم. اگر در مسیر مشخص شد چیزی جواب نمی‌دهد، استراتژی را عوض می‌کنیم. ما قول عدد تضمینی نمی‌دهیم (چون بازار و محصول شما هم نقش دارد)، اما تعهد می‌دهیم شفاف گزارش بدهیم و تا جای ممکن مسیر را اصلاح کنیم.",
  },
  {
    q: "گزارش‌ها چطور و هر چند وقت یک‌بار است؟",
    a: "هر ماه یک گزارش ساده و قابل‌فهم می‌گیرید: چه کارهایی انجام شده، چه اعدادی تغییر کرده، و پیشنهاد ماه بعد چیست. اگر بخواهید، جلسه آنلاین کوتاه هم برگزار می‌کنیم.",
  },
  {
    q: "آیا خودمان هم باید محتوا تولید کنیم؟",
    a: "بستگی به پکیج دارد. در بیشتر همکاری‌ها تولید محتوا را ما انجام می‌دهیم. از شما معمولاً اطلاعات محصول، عکس‌های اولیه و تأیید نهایی را می‌خواهیم. اگر تیم داخلی دارید، می‌توانیم فقط استراتژی و نظارت را بر عهده بگیریم.",
  },
  {
    q: "برای کسب‌وکارهای کوچک هم کار می‌کنید؟",
    a: "بله. اتفاقاً بخش قابل توجهی از مشتریان ما کسب‌وکارهای کوچک و متوسط هستند. مهم این است که هدف مشخص و حداقل بودجه لازم را داشته باشید تا کار معنادار پیش برود.",
  },
  {
    q: "چقدر طول می‌کشد تا نتیجه ببینیم؟",
    a: "تبلیغات معمولاً ظرف چند هفته اثرش مشخص می‌شود. سئو و رشد ارگانیک معمولاً ۳ تا ۶ ماه زمان می‌برد. در جلسه اول زمان‌بندی واقع‌بینانه برای هدف شما را می‌گوییم.",
  },
  {
    q: "چطور شروع کنیم؟",
    a: "از فرم پایین صفحه یا واتساپ پیام بدهید. یک جلسه کوتاه رایگان هماهنگ می‌کنیم. اگر به نتیجه رسیدیم که می‌توانیم کمکتان کنیم، پیشنهاد کتبی می‌فرستیم.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۱۰" title="سؤالات" />
            <p className="text-caption text-muted-foreground leading-persian">
              پاسخ‌هایی که معمولاً قبل از شروع همکاری می‌پرسید.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-10"
            >
              سؤالات پرتکرار
            </motion.h2>

            <div className="space-y-0">
              {faqs.map((item, i) => (
                <div
                  key={i}
                  className="border-b border-border first:border-t"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 py-5 text-right"
                  >
                    <span className="font-bold text-base leading-persian-tight">
                      {item.q}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-lg leading-none mt-0.5">
                      {open === i ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-caption text-muted-foreground leading-persian">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
