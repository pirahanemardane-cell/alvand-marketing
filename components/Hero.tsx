"use client";

import { motion } from "framer-motion";
import InkRidges from "@/components/ui/ink-ridges";
import { useTheme } from "./ThemeProvider";

export default function Hero() {
  const { mode } = useTheme();
  const isMorning = mode === "morning";

  return (
    <InkRidges
      // Explicit day/night paper + ink (no transition-colors): InkRidges moon:auto
      // samples backgroundColor/color; a color transition left luminance on the
      // previous theme and inverted sun/moon relative to the صبح/شب toggle.
      className={
        isMorning
          ? "min-h-[100svh] w-full max-w-[100vw] bg-[#fafafa] text-[#18181b]"
          : "min-h-[100svh] w-full max-w-[100vw] bg-[#0a0a0b] text-[#f4f4f5]"
      }
      label="نقاشی جوهر رشته‌کوه الوند"
      seed={11}
      layers={4}
      mist={0.55}
      horizon={0.58}
      drift={0.04}
      parallax={0.025}
      paintIn={2200}
      sun
      sunColor="#c8372d"
      sunSize={0.065}
      sunPosition={[0.78, 0.72]}
      moon={isMorning ? false : true}
      scrollDepth={0.3}
      grain={0.28}
      clouds={0.3}
      glow={0.4}
      birds={4}
      birdsEvery={16}
    >
      <div className="flex h-full min-h-[100svh] flex-col items-center justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 pt-24 pb-16 text-center w-full">
        {/* Static above-the-fold copy avoids motion-driven LCP render delay. */}
        <p className="mb-4 text-sm sm:text-base font-thin tracking-wide text-accent text-center text-no-justify">
          الوند مارکتینگ
        </p>

        <h1 className="w-full max-w-full px-1 text-display break-words text-center text-no-justify font-heavy">
          مثل کوه پشتتیم
        </h1>

        <p className="mt-8 text-body text-muted-foreground">
          وقتی سایت دارید ولی فروش نمی‌آید، یا تبلیغات خرج می‌شود ولی نتیجه
          نمی‌دهد، ما همان تیمی هستیم که کنار شما می‌ماند و کار را تا رسیدن به
          نتیجه جلو می‌برد.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href="/contact"
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
    </InkRidges>
  );
}
