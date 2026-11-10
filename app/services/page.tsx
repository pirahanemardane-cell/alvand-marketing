import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import { ServiceTableView } from "@/components/ServiceContentBlocks";
import {
  services,
  servicesOverview,
  serviceHref,
  type Service,
} from "@/lib/services";
import { getServiceIcon } from "@/lib/category-icons";
import {
  getHubImages,
  getServiceImages,
  serviceImageSrc,
} from "@/lib/service-images";
import { getHubCatalogGroups } from "@/lib/mega-menu";
import { metadataForPageKey } from "@/lib/seo/pages";
import { servicesHubJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
import {
  ServiceCardImage,
  ServiceHubHeroImage,
  ServiceInlineImage,
} from "@/components/ServiceImages";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await metadataForPageKey("services", {
    path: "/services",
    fallbackTitle: servicesOverview.seoTitle,
    fallbackDescription: servicesOverview.seoDescription,
  });
  const hub = getHubImages();
  const og = serviceImageSrc(hub.featured);
  meta.openGraph = {
    ...meta.openGraph,
    images: [
      {
        url: og,
        width: hub.featured.width,
        height: hub.featured.height,
        alt: hub.featured.alt,
      },
    ],
  };
  meta.twitter = { ...meta.twitter, images: [og] };
  return meta;
}

type Props = { searchParams: Promise<{ q?: string }> };

function ServiceCatalogCard({ item }: { item: Service }) {
  const Icon = getServiceIcon(item.slug);
  const imgs = getServiceImages(item.slug);
  const href = serviceHref(item.slug);
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 hover:border-accent/50 transition-colors duration-300">
      <Link href={href} className="block min-w-0">
        {imgs && <ServiceCardImage image={imgs.featured} />}
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors leading-persian-tight">
          {item.title}
        </h3>
        <p className="text-caption text-muted-foreground leading-persian mb-4 line-clamp-3">
          {item.shortDesc}
        </p>
      </Link>
      <div className="mt-auto pt-2">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:opacity-80"
        >
          {item.title}
          <span className="text-xs">←</span>
        </Link>
      </div>
    </article>
  );
}

export default async function ServicesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const groups = getHubCatalogGroups();
  const allCatalog = groups.flatMap((g) => g.items);
  const filtered = query
    ? services.filter(
        (s) =>
          s.title.includes(query) ||
          s.shortDesc.includes(query) ||
          s.fullDesc.includes(query) ||
          s.heroHeading.includes(query)
      )
    : null;
  const o = servicesOverview;
  const hubImages = getHubImages();

  return (
    <main>
      <JsonLd data={servicesHubJsonLd(o, allCatalog)} />
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb items={[{ label: o.title }]} />

          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-4">
              {o.title}
            </h1>
            <h2 className="text-xl md:text-2xl font-bold leading-persian-tight mb-6 text-foreground/90">
              {o.heroHeading}
            </h2>
            <div className="space-y-3 max-w-4xl">
              {o.intro.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="text-muted-foreground leading-persian"
                >
                  {p}
                </p>
              ))}
            </div>
            {query && (
              <p className="mt-4 text-sm text-muted-foreground">
                نتایج جستجو برای «{query}» — {filtered?.length ?? 0} مورد
              </p>
            )}
          </div>

          <ServiceHubHeroImage images={hubImages} />

          <section className="mb-14">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">
              {o.criteriaHeading}
            </h2>
            <ul className="space-y-3 max-w-4xl">
              {o.criteria.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-caption text-muted-foreground leading-persian"
                >
                  <span className="text-accent shrink-0">●</span>
                  {item}
                </li>
              ))}
            </ul>
            {hubImages.related[0] && (
              <ServiceInlineImage image={hubImages.related[0]} />
            )}
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold mb-2 leading-persian-tight">
              {o.outputsHeading}
            </h2>
            <p className="text-caption text-muted-foreground leading-persian mb-8 max-w-3xl">
              همه خدمات الوند مارکتینگ به‌صورت دسته‌بندی‌شده. روی عنوان هر خدمت
              بزنید تا جزئیات همان صفحه را ببینید.
            </p>
          </section>

          {filtered ? (
            filtered.length === 0 ? (
              <p className="text-muted-foreground rounded-2xl border border-border bg-card p-8 text-center mb-14">
                خدمتی با این عبارت پیدا نشد.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-14">
                {filtered.map((item) => (
                  <ServiceCatalogCard key={item.slug} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="space-y-16 mb-16 w-full">
              {groups.map(({ parent, items }) => {
                const ParentIcon = getServiceIcon(parent.slug);
                return (
                  <section
                    key={parent.slug}
                    id={`cat-${parent.slug.replace(/\//g, "-")}`}
                    className="w-full scroll-mt-28"
                  >
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-accent">
                          <ParentIcon className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold leading-persian-tight">
                            <Link
                              href={serviceHref(parent.slug)}
                              className="hover:text-accent transition-colors"
                            >
                              {parent.title}
                            </Link>
                          </h3>
                          <p className="text-caption text-muted-foreground leading-persian mt-1 line-clamp-2 max-w-2xl">
                            {parent.shortDesc}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={serviceHref(parent.slug)}
                        className="inline-flex items-center gap-1 text-sm font-bold text-accent hover:opacity-80 shrink-0"
                      >
                        {parent.title}
                        <span className="text-xs">←</span>
                      </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                      {items.map((item) => (
                        <ServiceCatalogCard key={item.slug} item={item} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <section className="mb-14 w-full">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">
              {o.comparisonHeading}
            </h2>
            <ServiceTableView table={o.comparisonTable} />
            {hubImages.related[1] && (
              <ServiceInlineImage image={hubImages.related[1]} />
            )}
          </section>

          <section className="mb-14 w-full">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">
              {o.guideHeading}
            </h2>
            <ServiceTableView table={o.guideTable} />
          </section>

          <section className="mb-14 w-full">
            <h3 className="text-lg font-bold mb-4 leading-persian-tight">
              {o.budgetOrderHeading}
            </h3>
            <ol className="space-y-3 max-w-4xl mb-4">
              {o.budgetOrder.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-3 text-caption text-muted-foreground leading-persian"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-sm font-bold">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="text-caption text-muted-foreground leading-persian max-w-4xl">
              {o.budgetNote}
            </p>
          </section>

          <section className="mb-14 w-full">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">
              {o.tipsHeading}
            </h2>
            <ul className="space-y-3 max-w-4xl">
              {o.tips.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-caption text-muted-foreground leading-persian"
                >
                  <span className="text-accent shrink-0">●</span>
                  {item}
                </li>
              ))}
            </ul>
            {hubImages.related[2] && (
              <ServiceInlineImage image={hubImages.related[2]} />
            )}
          </section>

          <section className="mb-14 w-full">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">
              سؤالات متداول
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 w-full">
              {o.faq.map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <h3 className="font-bold mb-2">{item.q}</h3>
                  <p className="text-caption text-muted-foreground leading-persian">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-4 rounded-2xl border border-border bg-card p-8 text-center w-full">
            <h2 className="text-xl font-bold mb-2">نمی‌دانید از کجا شروع کنید؟</h2>
            <p className="text-caption text-muted-foreground leading-persian mb-6 mx-auto">
              {o.ctaNote}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-bold text-sm px-7 py-3.5"
            >
              مشاوره رایگان
              <span>←</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
