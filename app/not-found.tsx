import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-4">
          صفحه پیدا نشد
        </h1>
        <p className="text-muted-foreground leading-persian mb-8 max-w-xl">
          این آدرس در سایت الوند مارکتینگ وجود ندارد یا منتقل شده است. از صفحه
          اصلی، خدمات یا بلاگ ادامه دهید.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 rounded-full border border-border text-sm hover:bg-white/5 transition-colors"
          >
            صفحه اصلی
          </Link>
          <Link
            href="/services"
            className="inline-block px-6 py-2.5 rounded-full border border-border text-sm hover:bg-white/5 transition-colors"
          >
            خدمات
          </Link>
          <Link
            href="/blog"
            className="inline-block px-6 py-2.5 rounded-full border border-border text-sm hover:bg-white/5 transition-colors"
          >
            بلاگ
          </Link>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 rounded-full border border-border text-sm hover:bg-white/5 transition-colors"
          >
            تماس
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
