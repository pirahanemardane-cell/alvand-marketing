import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import { listPublishedPosts, blogHref } from "@/lib/blog";
import { getBlogCategoryIcon } from "@/lib/category-icons";
import { getBlogImages, blogImageSrc } from "@/lib/blog-images";
import { metadataForPageKey } from "@/lib/seo/pages";
import Image from "next/image";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPageKey("blog", { path: "/blog" });
}

type Props = { searchParams: Promise<{ q?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const posts = await listPublishedPosts(q);

  return (
    <main className="w-full">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb items={[{ label: "بلاگ" }]} />
          <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-4">
            بلاگ
          </h1>
          <p className="text-muted-foreground leading-persian mb-4">
            نوشته‌های کوتاه و کاربردی برای تصمیم‌گیری بهتر در بازاریابی دیجیتال.
          </p>
          {q?.trim() && (
            <p className="text-sm text-muted-foreground mb-8">
              نتایج جستجو برای «{q.trim()}» — {posts.length} مورد
            </p>
          )}
          {!q?.trim() && <div className="mb-12" />}
          {posts.length === 0 ? (
            <p className="text-muted-foreground rounded-2xl border border-border bg-card p-8 text-center">
              {q?.trim()
                ? "مقاله‌ای با این عبارت پیدا نشد."
                : "هنوز مقاله‌ای منتشر نشده است."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {posts.map((post) => {
                const CatIcon = getBlogCategoryIcon(post.category);
                const imgs = getBlogImages(post.slug);
                const cover =
                  post.og_image_url ||
                  (imgs ? blogImageSrc(imgs.featured) : undefined);
                return (
                  <Link
                    key={post.slug}
                    href={blogHref(post.slug)}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card hover:border-accent/50 transition-colors"
                  >
                    {cover && imgs ? (
                      <div className="relative aspect-[16/9] w-full bg-muted">
                        <Image
                          src={cover}
                          alt={imgs.featured.alt}
                          width={imgs.featured.width}
                          height={imgs.featured.height}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <span className="inline-flex items-center gap-1.5 text-xs text-accent font-medium">
                        <CatIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {post.category}
                      </span>
                      <h2 className="text-lg font-bold mt-2 mb-2 group-hover:text-accent transition-colors leading-persian-tight">
                        {post.title}
                      </h2>
                      <p className="text-caption text-muted-foreground leading-persian mb-4">
                        {post.excerpt}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
