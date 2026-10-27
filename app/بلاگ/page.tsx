import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "بلاگ | الوند مارکتینگ",
  description: "مقالات کاربردی درباره سئو، تبلیغات، طراحی سایت و بازاریابی دیجیتال.",
  robots: { index: false, follow: false },
};

export default function BlogPage() {
  return (
    <main className="w-full">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb items={[{ label: "بلاگ" }]} />
          <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-4">
            بلاگ
          </h1>
          <p className="text-muted-foreground leading-persian mb-12">
            نوشته‌های کوتاه و کاربردی برای تصمیم‌گیری بهتر در بازاریابی دیجیتال.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/بلاگ/${post.slug}`}
                className="group block rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors"
              >
                <span className="text-xs text-accent font-medium">{post.category}</span>
                <h2 className="text-lg font-bold mt-2 mb-2 group-hover:text-accent transition-colors leading-persian-tight">
                  {post.title}
                </h2>
                <p className="text-caption text-muted-foreground leading-persian mb-4">
                  {post.excerpt}
                </p>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
