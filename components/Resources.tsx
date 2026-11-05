import Link from "next/link";
import SectionLabel from "./SectionLabel";
import { listPublishedPosts } from "@/lib/blog";

export default async function Resources() {
  // Public list already excludes smoke markers; never hide this section when empty.
  const published = (await listPublishedPosts()).slice(0, 3);
  const hasPosts = published.length > 0;

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
              {hasPosts ? "چند مطلب مفید" : "به‌زودی مطالب جالب…"}
            </h2>

            {hasPosts ? (
              <div className="space-y-0">
                {published.map((item) => (
                  <div
                    key={item.slug}
                    className="block py-6 border-b border-border first:border-t group"
                  >
                    <Link href={`/blog/${item.slug}`} className="block">
                      <h3 className="text-lg font-bold mb-1.5 group-hover:text-accent transition-colors leading-persian-tight">
                        {item.title}
                      </h3>
                      <p className="text-caption text-muted-foreground leading-persian">
                        {item.excerpt || item.category}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-b border-border py-8">
                <p className="text-muted-foreground leading-persian max-w-xl">
                  هنوز چیزی روی میز نیست — داریم ایده‌های بازاریابی را دم
                  می‌کنیم تا داغ و کاربردی برسند. سری بعد که سر زدید، این‌جا
                  پر از مطلب تازه از الوند مارکتینگ می‌شود.
                </p>
                <Link
                  href="/blog"
                  className="inline-block mt-6 text-sm text-accent hover:underline leading-persian"
                >
                  سر زدن به بلاگ
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
