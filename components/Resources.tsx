import Link from "next/link";
import SectionLabel from "./SectionLabel";
import { listPublishedPosts } from "@/lib/blog";

/** Static teaser items — shown when no real published posts exist. */
const FALLBACK_RESOURCES = [
  {
    slug: null as string | null,
    title: "چرا تبلیغات اینستاگرام گاهی نتیجه نمی‌دهد؟",
    desc: "سه اشتباه رایج در تنظیم مخاطب و بودجه که بیشتر کسب‌وکارها مرتکب می‌شوند.",
  },
  {
    slug: null as string | null,
    title: "چک‌لیست سئوی فنی برای سایت‌های ایرانی",
    desc: "مواردی که قبل از هر کمپین محتوا باید در سایت درست باشد تا گوگل سایت را جدی بگیرد.",
  },
  {
    slug: null as string | null,
    title: "چطور محتوای فروشنده بنویسیم بدون اینکه تبلیغ به نظر برسد؟",
    desc: "روشی ساده برای نوشتن متنی که هم مشکل مشتری را بگوید هم راه‌حل شما را نشان دهد.",
  },
];

export default async function Resources() {
  // Public list already excludes smoke markers; never hide this section when empty.
  const published = (await listPublishedPosts()).slice(0, 3);
  const items =
    published.length > 0
      ? published.map((p) => ({
          slug: p.slug,
          title: p.title,
          desc: p.excerpt || p.category,
        }))
      : FALLBACK_RESOURCES;

  return (
    <section
      id="resources"
      className="scroll-mt-20 border-t border-border bg-background px-5 py-24 sm:px-8 md:px-12 lg:px-16 xl:px-24 w-full"
    >
      <div className="mx-auto w-full">
        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          <div>
            <SectionLabel number="۰۸" title="منابع" />
            <p className="text-caption text-muted-foreground leading-persian">
              مطالب کاربردی برای کسانی که خودشان هم می‌خواهند یاد بگیرند.
            </p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-persian-tight mb-10">
              چند مطلب مفید
            </h2>

            <div className="space-y-0">
              {items.map((item) => (
                <div
                  key={item.slug || item.title}
                  className="block py-6 border-b border-border first:border-t group"
                >
                  <Link
                    href={item.slug ? `/blog/${item.slug}` : "/blog"}
                    className="block"
                  >
                    <h3 className="text-lg font-bold mb-1.5 group-hover:text-accent transition-colors leading-persian-tight">
                      {item.title}
                    </h3>
                    <p className="text-caption text-muted-foreground leading-persian">
                      {item.desc}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
