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
  getTopLevelServices,
} from "@/lib/services";
import { getServiceIcon } from "@/lib/category-icons";
import {
  getHubImages,
  getServiceImages,
  serviceImageSrc,
} from "@/lib/service-images";
import { metadataForPageKey } from "@/lib/seo/pages";
import { servicesHubJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
import {
  ServiceCardImage,
  ServiceHubHeroImage,
  ServiceRelatedGallery,
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

export default async function ServicesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const topLevel = getTopLevelServices();
  const filtered = query
    ? services.filter(
        (s) =>
          s.title.includes(query) ||
          s.shortDesc.includes(query) ||
          s.fullDesc.includes(query) ||
          s.heroHeading.includes(query)
      )
    : topLevel;
  const o = servicesOverview;
  const hubImages = getHubImages();

  return (
    <main>
      <JsonLd data={servicesHubJsonLd(o, topLevel)} />
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
                نتایج جستجو برای «{query}» — {filtered.length} مورد
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
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold mb-6 leading-persian-tight">
              {o.outputsHeading}
            </h2>
          </section>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground rounded-2xl border border-border bg-card p-8 text-center mb-14">
              خدمتی با این عبارت پیدا نشد.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-14">
              {filtered.map((item) => {
                const Icon = getServiceIcon(item.slug);
                const imgs = getServiceImages(item.slug);
                return (
                  <Link
                    key={item.slug}
                    href={serviceHref(item.slug)}
                    className="group block rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors duration-300"
                  >
                    {imgs && <ServiceCardImage image={imgs.featured} />}
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors leading-persian-tight">
                      {item.title}
                    </h3>
                    <p className="text-caption text-muted-foreground leading-persian mb-4">
                      {item.shortDesc}
                    </p>
                    <span className="text-sm font-medium text-accent inline-flex items-center gap-1">
                      {item.title}
                      <span className="text-xs">←</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          <ServiceRelatedGallery images={[...hubImages.related]} />

          <section className="mb-14 w-full">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">
              {o.comparisonHeading}
            </h2>
            <ServiceTableView table={o.comparisonTable} />
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
