"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mediaUrl } from "@/lib/media";
import { isNavItemActive } from "@/lib/nav-active";
import { serviceHref, servicesOverview } from "@/lib/services";

const logoSrc = mediaUrl("ALVAND-bg.webp");

const footerLinkIdle =
  "text-muted-foreground hover:text-foreground transition-colors";
const footerLinkActive = "text-accent font-bold transition-colors";

/**
 * Curated high-demand footer services (exact order).
 * Labels match destination page titles except SEO-style «سئو و بهینه‌سازی» for سئو.
 */
const footerServices: { label: string; slug: string }[] = [
  { label: "طراحی سایت", slug: "طراحی-سایت" },
  { label: "سئو و بهینه‌سازی", slug: "سئو" },
  { label: "هوش مصنوعی", slug: "هوش-مصنوعی" },
  { label: "تولید محتوا", slug: "تولید-محتوا" },
  { label: "شبکه‌های اجتماعی", slug: "شبکه‌های-اجتماعی" },
];

function FooterLink({
  href,
  children,
  pathname,
  exact,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  exact?: boolean;
}) {
  const active = isNavItemActive(href, pathname, "", { exact });
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={active ? footerLinkActive : footerLinkIdle}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname() || "/";

  return (
    <footer className="border-t border-border bg-background px-5 py-16 sm:px-8 md:px-12">
      <div className="mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="الوند مارکتینگ">
              <img
                src={logoSrc}
                alt="الوند مارکتینگ"
                className="h-9 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-caption text-muted-foreground leading-persian">
              تیم بازاریابی دیجیتال که روی نتیجه تمرکز می‌کند، نه فقط روی
              گزارش. از طراحی سایت تا تبلیغات و محتوا، کنار کسب‌وکار شما
              می‌مانیم.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">خدمات دیجیتال مارکتینگ</h4>
            <ul className="space-y-2.5 text-caption text-muted-foreground">
              {footerServices.map((s) => (
                <li key={s.slug}>
                  <FooterLink href={serviceHref(s.slug)} pathname={pathname}>
                    {s.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">سایت</h4>
            <ul className="space-y-2.5 text-caption text-muted-foreground">
              <li>
                <FooterLink href="/services" pathname={pathname} exact>
                  {servicesOverview.title}
                </FooterLink>
              </li>
              <li>
                <a href="/#process" className={footerLinkIdle}>
                  فرآیند همکاری
                </a>
              </li>
              <li>
                <a href="/#pricing" className={footerLinkIdle}>
                  برآورد و مشاوره
                </a>
              </li>
              <li>
                <a href="/#faq" className={footerLinkIdle}>
                  سؤالات پرتکرار
                </a>
              </li>
              <li>
                <FooterLink href="/blog" pathname={pathname}>
                  بلاگ
                </FooterLink>
              </li>
              <li>
                <FooterLink href="/contact" pathname={pathname}>
                  مشاوره رایگان
                </FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4">تماس</h4>
            <ul className="space-y-2.5 text-caption text-muted-foreground">
              <li>
                <a href="https://wa.me/989921863063" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  واتساپ
                </a>
              </li>
              <li>
                <a href="https://t.me/alvandmarketing" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  تلگرام
                </a>
              </li>
              <li>
                <a href="mailto:info@alvandmarketing.ir" className="hover:text-foreground transition-colors">
                  info@alvandmarketing.ir
                </a>
              </li>
              <li>
                <a href="tel:+989921863063" className="hover:text-foreground transition-colors">
                  ۰۹۹۲۱۸۶۳۰۶۳
                </a>
              </li>
              <li>
                <a href="tel:+982186095954" className="hover:text-foreground transition-colors">
                  ۰۲۱-۸۶۰۹۵۹۵۴
                </a>
              </li>
              <li>تهران</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-8 border-t border-border text-caption text-muted-foreground">
          <span>© ۱۴۰۵ الوند مارکتینگ</span>
          <span>مثل کوه پشتتیم</span>
        </div>
      </div>
    </footer>
  );
}
