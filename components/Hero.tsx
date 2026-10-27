"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const images = {
  night: "/images/hero-night.webp",
  morning: "/images/hero-morning.webp",
} as const;

export default function Hero() {
  const { mode } = useTheme();

  return (
    <section className="relative isolate flex min-h-[100svh] w-full max-w-[100vw] flex-col overflow-hidden bg-background text-foreground transition-colors duration-600">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 animate-ambient-drift"
            style={{
              backgroundImage: `var(--hero-overlay), url(${images[mode]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-24 pb-16 text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-sm sm:text-base font-thin tracking-wide text-accent text-center text-no-justify"
        >
          الوند مارکتینگ
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-full px-1 text-display break-words text-center text-no-justify font-heavy"
        >
          مثل کوه پشتتیم
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 text-body text-muted-foreground"
        >
          وقتی سایت دارید ولی فروش نمی‌آید، یا تبلیغات خرج می‌شود ولی نتیجه
          نمی‌دهد، ما همان تیمی هستیم که کنار شما می‌ماند و کار را تا رسیدن به
          نتیجه جلو می‌برد.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href="/تماس"
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
          >
            مشاوره رایگان
          </a>
          <a
            href="#process"
            className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 text-sm font-bold transition-colors hover:bg-white/5"
          >
            چطور کار می‌کنیم؟
          </a>
        </motion.div>
      </div>
    </section>
  );
}
