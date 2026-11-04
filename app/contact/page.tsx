import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "تماس با ما | الوند مارکتینگ",
  description: "برای مشاوره رایگان با الوند مارکتینگ تماس بگیرید. واتساپ، تلفن و فرم آنلاین.",
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb items={[{ label: "تماس با ما" }]} />

          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-4">
              از کجا شروع کنیم؟
            </h1>
            <p className="text-muted-foreground leading-persian">
              جلسه اول رایگان است. معمولاً تا ۲۴ ساعت پاسخ می‌دهیم. فرم را پر
              کنید یا مستقیم در واتساپ و تلگرام پیام بدهید.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 w-full">
            <ContactForm />

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold mb-4">راه‌های مستقیم</h2>
                <ul className="space-y-4 text-caption">
                  <li>
                    <span className="block text-muted-foreground mb-1">واتساپ / موبایل</span>
                    <a href="https://wa.me/989921863063" className="text-lg font-bold hover:text-accent transition-colors" dir="ltr">
                      ۰۹۹۲ ۱۸۶ ۳۰۶۳
                    </a>
                  </li>
                  <li>
                    <span className="block text-muted-foreground mb-1">تلفن ثابت</span>
                    <a href="tel:+982186095954" className="text-lg font-bold hover:text-accent transition-colors" dir="ltr">
                      ۰۲۱ ۸۶۰۹ ۵۹۵۴
                    </a>
                  </li>
                  <li>
                    <span className="block text-muted-foreground mb-1">تلگرام</span>
                    <a href="https://t.me/alvandmarketing" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-accent transition-colors">
                      @alvandmarketing
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-bold mb-2">زمان پاسخ</h3>
                <p className="text-caption text-muted-foreground leading-persian">
                  روزهای کاری معمولاً تا ۲۴ ساعت. اگر عجله دارید، واتساپ
                  سریع‌ترین راه است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
