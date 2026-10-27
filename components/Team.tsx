"use client";

import { motion } from "framer-motion";
import { Target, FileText, Megaphone, Palette } from "lucide-react";
import SectionLabel from "./SectionLabel";

const members = [
  {
    name: "تیم استراتژی",
    role: "مسیر رشد و اولویت‌ها",
    desc: "قبل از هر اجرایی، مشخص می‌کنیم چه کاری بیشترین اثر را برای هدف شما دارد.",
    icon: Target,
  },
  {
    name: "تیم محتوا و سئو",
    role: "متن، ساختار، رتبه",
    desc: "محتوایی می‌نویسند که هم گوگل بفهمد هم مشتری واقعی بخواند و اقدام کند.",
    icon: FileText,
  },
  {
    name: "تیم تبلیغات",
    role: "بودجه و نتیجه",
    desc: "کمپین‌ها را طوری می‌چینند که هر تومان قابل پیگیری باشد و هدر نرود.",
    icon: Megaphone,
  },
  {
    name: "تیم طراحی و سایت",
    role: "تجربه کاربری و سرعت",
    desc: "سایت و صفحات فرود را طوری می‌سازند که کاربر گیج نشود و مسیر خرید روشن باشد.",
    icon: Palette,
  },
];

export default function Team() {
  return (
    <section
      id="team"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۶" title="تیم" />
            <p className="text-caption text-muted-foreground leading-persian">
              آدم‌هایی که پشت شعار «مثل کوه پشتتیم» ایستاده‌اند.
            </p>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-4"
            >
              چه کسانی روی پروژه شما کار می‌کنند؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground leading-persian mb-12"
            >
              برای هر پروژه یک نفر مسئول مشخص می‌شود تا شما مجبور نباشید با چند نفر جداگانه هماهنگ کنید. پشت صحنه، این چهار حوزه با هم کار می‌کنند.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-5">
              {members.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-bold text-lg mb-0.5">{m.name}</h3>
                    <p className="text-caption text-accent mb-3">{m.role}</p>
                    <p className="text-caption text-muted-foreground leading-persian">
                      {m.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
