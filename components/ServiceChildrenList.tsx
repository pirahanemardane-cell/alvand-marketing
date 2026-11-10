import Image from "next/image";
import Link from "next/link";

export type ServiceChildCard = {
  slug: string;
  title: string;
  shortDesc: string;
  href: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

type Props = {
  parentTitle: string;
  items: ServiceChildCard[];
};

export default function ServiceChildrenList({ parentTitle, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="mb-14 w-full" aria-labelledby="plp-children-heading">
      <div className="mb-6">
        <h2
          id="plp-children-heading"
          className="text-xl md:text-2xl font-bold leading-persian-tight"
        >
          خدمات {parentTitle}
        </h2>
        <p className="mt-2 text-base text-muted-foreground leading-persian">
          {`همه ${items.length} خدمت این دسته را ببینید و جزئیات هر کدام را باز کنید.`}
        </p>
      </div>

      <ul className="list-none divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 transition-colors hover:bg-accent/5 focus-visible:bg-accent/5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
            >
              {item.image ? (
                <div className="relative h-28 w-full sm:h-20 sm:w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    title={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(max-width: 640px) 100vw, 128px"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className="hidden sm:block h-20 w-32 shrink-0 rounded-xl border border-dashed border-border bg-muted/40"
                  aria-hidden
                />
              )}

              <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="text-base md:text-lg font-bold leading-persian-tight text-foreground group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-persian line-clamp-2">
                  {item.shortDesc}
                </p>
              </div>

              <span className="inline-flex items-center justify-center gap-2 self-start sm:self-center shrink-0 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent group-hover:text-accent-foreground">
                مشاهده جزئیات
                <span aria-hidden>←</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
