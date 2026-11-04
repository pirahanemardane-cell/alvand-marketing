import Link from "next/link";
import SectionLabel from "./SectionLabel";
import { listPublishedPosts } from "@/lib/blog";

export default async function Resources() {
  const posts = (await listPublishedPosts()).slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

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
              {posts.map((item) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
