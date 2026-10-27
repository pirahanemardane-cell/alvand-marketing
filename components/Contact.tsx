"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // فعلاً فقط UI — بعداً به سوپابیس یا API وصل می‌شود
    setSent(true);
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۱۳" title="تماس" />
            <p className="text-caption text-muted-foreground leading-persian">
              جلسه اول رایگان است. معمولاً تا ۲۴ ساعت پاسخ می‌دهیم.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-4"
            >
              از کجا شروع کنیم؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground leading-persian mb-10"
            >
              فرم را پر کنید یا مستقیم در واتساپ پیام بدهید. هر کدام برایتان
              راحت‌تر است.
            </motion.p>

            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                {sent ? (
                  <div className="rounded-2xl border border-border bg-card p-8 text-center">
                    <p className="font-bold text-lg mb-2">پیام شما ثبت شد</p>
                    <p className="text-caption text-muted-foreground leading-persian">
                      تا ۲۴ ساعت با شما تماس می‌گیریم. اگر عجله دارید، از
                      واتساپ پیام بدهید.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-caption mb-1.5">نام</label>
                      <input
                        required
                        name="name"
                        type="text"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="نام و نام خانوادگی"
                      />
                    </div>
                    <div>
                      <label className="block text-caption mb-1.5">
                        شماره تماس
                      </label>
                      <input
                        required
                        name="phone"
                        type="tel"
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="۰۹۱۲xxxxxxx"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-caption mb-1.5">
                        چه کمکی می‌خواهید؟
                      </label>
                      <textarea
                        required
                        name="message"
                        rows={4}
                        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
                        placeholder="مثلاً: می‌خواهم سئوی سایتم را شروع کنم / تبلیغات اینستاگرام نتیجه‌ای ندارد / ..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground hover:opacity-90 transition-opacity"
                    >
                      ارسال درخواست مشاوره
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-5">
                <a
                  href="https://wa.me/989921863063"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="font-bold text-sm">واتساپ</p>
                    <p className="text-caption text-muted-foreground">
                      سریع‌ترین راه برای شروع گفتگو
                    </p>
                  </div>
                </a>
                <a
                  href="https://t.me/alvandmarketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors"
                >
                  <span className="text-2xl">✈️</span>
                  <div>
                    <p className="font-bold text-sm">تلگرام</p>
                    <p className="text-caption text-muted-foreground" dir="ltr">
                      @alvandmarketing
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:info@alvandmarketing.ir"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors"
                >
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-bold text-sm">ایمیل</p>
                    <p className="text-caption text-muted-foreground" dir="ltr">
                      info@alvandmarketing.ir
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+989921863063"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors"
                >
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-bold text-sm">موبایل</p>
                    <p className="text-caption text-muted-foreground">
                      ۰۹۹۲۱۸۶۳۰۶۳
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+982186095954"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-accent transition-colors"
                >
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-bold text-sm">تلفن ثابت</p>
                    <p className="text-caption text-muted-foreground">
                      ۰۲۱-۸۶۰۹۵۹۵۴
                    </p>
                  </div>
                </a>
                <p className="text-caption text-muted-foreground leading-persian pt-2">
                  تهران · پاسخ‌گویی در روزهای کاری، معمولاً تا ۲۴ ساعت
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
