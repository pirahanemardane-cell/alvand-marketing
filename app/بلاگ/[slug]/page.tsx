import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import BlogComments from "@/components/BlogComments";
import {
  getPostBySlug,
  getAllPostSlugs,
  posts,
  getReadingTimeMinutes,
  toPersianDigits,
} from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "مقاله یافت نشد" };
  return {
    title: `${post.title} | بلاگ الوند مارکتینگ`,
    description: post.excerpt,
    robots: { index: false, follow: false },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const minutes = getReadingTimeMinutes(post);

  return (
    <main className="w-full">
      <Navbar />
      <article className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb
            items={[
              { label: "بلاگ", href: "/بلاگ" },
              { label: post.title },
            ]}
          />

          <span className="text-sm text-accent font-medium">{post.category}</span>

          <h1 className="text-3xl md:text-4xl font-bold leading-persian-tight mt-2 mb-4">
            {post.title}
          </h1>

          {/* تاریخ + مدت مطالعه */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground mb-8">
            <time>{post.date}</time>
            <span className="text-border" aria-hidden>
              |
            </span>
            <span>{toPersianDigits(minutes)} دقیقه مطالعه</span>
          </div>

          {/* فهرست مطالب */}
          <nav
            aria-label="فهرست مطالب"
            className="mb-12 rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <h2 className="text-base font-bold mb-3 text-foreground">
              فهرست مطالب
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              {post.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="hover:text-accent transition-colors text-justify"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* بدنه مقاله */}
          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-xl md:text-2xl font-bold leading-persian-tight mb-4">
                  {section.title}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-persian text-justify">
                  {section.paragraphs.map((para) => (
                    <p key={para.slice(0, 32)}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <BlogComments postSlug={post.slug} />

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/تماس"
              className="text-accent font-bold text-sm hover:opacity-80"
            >
              برای مشاوره رایگان تماس بگیرید ←
            </Link>
          </div>

          {others.length > 0 && (
            <section className="mt-14">
              <h2 className="text-lg font-bold mb-4">مقالات مرتبط</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {others.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/بلاگ/${p.slug}`}
                    className="rounded-xl border border-border p-4 hover:border-accent/50 transition-colors"
                  >
                    <p className="font-bold text-sm">{p.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
