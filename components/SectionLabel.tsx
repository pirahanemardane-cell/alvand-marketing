"use client";

import { motion } from "framer-motion";

export default function SectionLabel({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-3 text-caption text-muted-foreground mb-6"
    >
      <span className="w-6 h-px bg-muted-foreground/50" />
      <span>
        {number} — {title}
      </span>
    </motion.div>
  );
}
