import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "خدمات دیجیتال مارکتینگ | الوند مارکتینگ",
  description: "طراحی سایت، سئو، تولید محتوا، اینستاگرام، تبلیغات اینترنتی و هوش مصنوعی — خدمات دیجیتال مارکتینگ الوند.",
  robots: { index: false, follow: false },
};

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb items={[{ label: "خدمات دیجیتال مارکتینگ" }]} />

          <div className="mb-14">
            <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-4">
              خدمات دیجیتال مارکتینگ
            </h1>
            <p className="text-muted-foreground leading-persian">
              شش خدمت اصلی. هر کدام برای یک نیاز مشخص. روی هر خدمت کلیک کنید تا
              جزئیات، فرآیند و مخاطب هدف را ببینید.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {services.map((item) => (
              <Link
                key={item.slug}
                href={`/خدمات/${item.slug}`}
                className="group block rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors duration-300"
              >
                <h2 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors leading-persian-tight">
                  {item.title}
                </h2>
                <p className="text-caption text-muted-foreground leading-persian mb-4">
                  {item.shortDesc}
                </p>
                <span className="text-sm font-medium text-accent inline-flex items-center gap-1">
                  جزئیات خدمت
                  <span className="text-xs">←</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center w-full">
            <h2 className="text-xl font-bold mb-2">نمی‌دانید از کجا شروع کنید؟</h2>
            <p className="text-caption text-muted-foreground leading-persian mb-6 mx-auto">
              در یک جلسه کوتاه رایگان، وضعیت فعلی‌تان را می‌شنویم و مسیر منطقی را
              پیشنهاد می‌دهیم.
            </p>
            <Link
              href="/تماس"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-bold text-sm px-7 py-3.5"
            >
              مشاوره رایگان
              <span>←</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
