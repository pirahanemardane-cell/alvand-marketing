import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import BlogComments from "@/components/BlogComments";
import BlogBody, { blogTocFromBody } from "@/components/BlogBody";
import JsonLd from "@/components/JsonLd";
import {
  getPublishedPostBySlug,
  getPostBySlugAnyStatus,
  listPublishedPosts,
  listPublishedSlugs,
  getReadingTimeMinutes,
  toPersianDigits,
  blogHref,
  type BlogPost,
} from "@/lib/blog";
import { getBlogCategoryIcon } from "@/lib/category-icons";
import { getBlogImages, blogImageSrc } from "@/lib/blog-images";
import { requireAdminUser } from "@/lib/supabase/admin";
import { publicRobots } from "@/lib/seo/site";
import { blogArticleJsonLd } from "@/lib/seo/jsonld";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ preview?: string }>;
};

function joinSlug(segments: string[]): string {
  return segments
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .join("/");
}

export async function generateStaticParams() {
  const slugs = await listPublishedSlugs();
  return slugs.map((slug) => ({
    slug: slug.split("/"),
  }));
}

async function resolvePost(
  slug: string,
  preview?: string
): Promise<{ post: BlogPost; isPreview: boolean } | null> {
  const published = await getPublishedPostBySlug(slug);
  if (published) return { post: published, isPreview: false };

  if (preview === "1") {
    const admin = await requireAdminUser();
    if (!admin) return null;
    const draft = await getPostBySlugAnyStatus(slug);
    if (draft) return { post: draft, isPreview: true };
  }
  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug: segments } = await params;
  const { preview } = await searchParams;
  const slug = joinSlug(segments);
  const resolved = await resolvePost(slug, preview);
  if (!resolved) return { title: "مقاله یافت نشد", robots: { index: false } };
  const { post, isPreview } = resolved;
  const title = post.meta_title || `${post.title} | بلاگ الوند مارکتینگ`;
  const description = post.meta_description || post.excerpt;
  const imgs = getBlogImages(post.slug);
  const ogImage = post.og_image_url || (imgs ? blogImageSrc(imgs.featured) : undefined);
  return {
    title: isPreview ? `[پیش‌نمایش] ${title}` : title,
    description,
    robots: (() => {
      const index = isPreview ? false : post.robots_index !== false;
      const follow = isPreview ? false : post.robots_follow !== false;
      if (index && follow) return publicRobots;
      return {
        index,
        follow,
        googleBot: { index, follow },
      };
    })(),
    openGraph: {
      title: post.og_title || title,
      description: post.og_description || description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    alternates: {
      canonical: post.canonical_url || blogHref(post.slug),
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug: segments } = await params;
  const { preview } = await searchParams;
  const slug = joinSlug(segments);
  const resolved = await resolvePost(slug, preview);
  if (!resolved) notFound();
  const { post, isPreview } = resolved;

  const all = await listPublishedPosts();
  const others = all
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);
  const fallbackOthers =
    others.length > 0
      ? others
      : all.filter((p) => p.slug !== post.slug).slice(0, 2);
  const minutes = getReadingTimeMinutes(post);
  const toc = blogTocFromBody(post.body || "");
  const hasToc = toc.length > 1;
  const CatIcon = getBlogCategoryIcon(post.category);
  const images = getBlogImages(post.slug);
  const crumbs = [
    { name: "خانه", path: "/" },
    { name: "بلاگ", path: "/blog" },
    { name: post.title, path: blogHref(post.slug) },
  ];

  return (
    <main className="w-full">
      {!isPreview && (
        <JsonLd
          data={blogArticleJsonLd(
            post,
            crumbs,
            images ? blogImageSrc(images.featured) : post.og_image_url || undefined
          )}
        />
      )}
      <Navbar />
      <article className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          {isPreview && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
            >
              پیش‌نمایش ادمین — این مطلب هنوز منتشر نشده و برای موتورهای جستجو
              noindex است.{" "}
              <Link href={`/admin/blog`} className="font-bold text-accent underline">
                بازگشت به پنل بلاگ
              </Link>
            </div>
          )}

          <PageBreadcrumb
            items={[
              { label: "بلاگ", href: "/blog" },
              { label: post.category },
              { label: post.title },
            ]}
          />

          <span className="inline-flex items-center gap-1.5 text-sm text-accent font-medium">
            <CatIcon className="h-4 w-4" strokeWidth={1.75} />
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold leading-persian-tight mt-2 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground mb-8">
            {post.date && <time>{post.date}</time>}
            <span className="text-border" aria-hidden>
              |
            </span>
            <span>{toPersianDigits(minutes)} دقیقه مطالعه</span>
          </div>

          {hasToc && (
            <nav
              aria-label="فهرست مطالب"
              className="mb-12 rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <h2 className="text-base font-bold mb-3 text-foreground">
                فهرست مطالب
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="hover:text-accent transition-colors text-justify"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {post.body ? (
            <BlogBody body={post.body} images={images} />
          ) : (
            <p className="text-muted-foreground leading-persian">
              محتوای این مقاله هنوز تکمیل نشده است.
            </p>
          )}

          {!isPreview && <BlogComments postSlug={post.slug} />}

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/contact"
              className="text-accent font-bold text-sm hover:opacity-80"
            >
              برای مشاوره رایگان تماس بگیرید ←
            </Link>
          </div>

          {fallbackOthers.length > 0 && (
            <section className="mt-14">
              <h2 className="text-lg font-bold mb-4">مقالات مرتبط</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {fallbackOthers.map((p) => (
                  <Link
                    key={p.slug}
                    href={blogHref(p.slug)}
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
