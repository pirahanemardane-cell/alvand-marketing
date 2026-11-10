"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "./SectionLabel";
import { services, serviceHref, servicesOverview } from "@/lib/services";
import { getServiceIcon } from "@/lib/category-icons";

export default function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10 w-full">
          <div>
            <SectionLabel number="۰۱" title="خدمات دیجیتال مارکتینگ" />
            <p className="text-caption text-muted-foreground leading-persian">
              {servicesOverview.intro[0]}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-accent hover:opacity-80 transition-opacity"
            >
              همه خدمات
              <span className="text-xs">←</span>
            </Link>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl font-bold leading-persian-tight mb-12"
            >
              چه کاری برای شما انجام می‌دهیم؟
            </motion.h2>

            <div className="space-y-0">
              {services.map((item, i) => {
                const Icon = getServiceIcon(item.slug);
                return (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="grid grid-cols-[1fr] gap-2 py-6 border-b border-border first:border-t"
                  >
                    <div>
                      <Link
                        href={serviceHref(item.slug)}
                        className="inline-flex items-center gap-2 mb-2"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-accent shrink-0">
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <h3 className="text-lg font-bold leading-persian-tight hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-caption text-muted-foreground leading-persian mb-2">
                        {item.shortDesc}
                      </p>
                      <Link
                        href={serviceHref(item.slug)}
                        className="text-sm font-medium text-accent hover:opacity-80"
                      >
                        جزئیات ←
                      </Link>
                    </div>
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
