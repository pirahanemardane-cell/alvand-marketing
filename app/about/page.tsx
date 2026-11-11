import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import About from "@/components/About";
import Team from "@/components/Team";
import { metadataForPageKey } from "@/lib/seo/pages";

/** Keep about SEO in sync with admin `seo_pages` without a full redeploy. */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPageKey("about", { path: "/about" });
}

export default function AboutPage() {
  return (
    <main className="w-full">
      <Navbar />
      <section className="pt-28 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background w-full">
        <div className="w-full">
          <PageBreadcrumb items={[{ label: "درباره ما" }]} />
          <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-2">
            درباره الوند مارکتینگ
          </h1>
          <p className="text-muted-foreground leading-persian mb-4 max-w-3xl">
            آژانس دیجیتال مارکتینگ با تمرکز روی نتیجه قابل اندازه‌گیری، شفافیت
            ماهانه و شناخت بازار ایران.
          </p>
        </div>
      </section>
      <About />
      <Team />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
