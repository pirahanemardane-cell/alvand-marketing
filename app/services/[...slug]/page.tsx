import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import { ServiceContentBlocks } from "@/components/ServiceContentBlocks";
import {
  services,
  getServiceBySlug,
  getAllServiceSlugs,
  serviceHref,
} from "@/lib/services";
import { getServiceIcon } from "@/lib/category-icons";
import { metadataForPageKey } from "@/lib/seo/pages";

type Props = { params: Promise<{ slug: string[] }> };

function joinSlug(segments: string[]): string {
  return segments.map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  }).join("/");
}

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = joinSlug(segments);
  const service = getServiceBySlug(slug);
  const path = serviceHref(slug);
  const fromDb = await metadataForPageKey(`service:${slug}`, { path });
  return {
    ...fromDb,
    title: fromDb.title || service?.seoTitle || slug,
    description:
      fromDb.description || service?.seoDescription || undefined,
    openGraph: {
      ...fromDb.openGraph,
      title:
        (fromDb.openGraph &&
          "title" in fromDb.openGraph &&
          fromDb.openGraph.title) ||
        service?.seoTitle ||
        fromDb.title ||
        slug,
      description:
        (fromDb.openGraph &&
          "description" in fromDb.openGraph &&
          fromDb.openGraph.description) ||
        service?.seoDescription ||
        fromDb.description ||
        undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug: segments } = await params;
  const slug = joinSlug(segments);
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const Icon = getServiceIcon(service.slug);

  const breadcrumb = [
    { label: "خدمات دیجیتال مارکتینگ", href: "/services" },
  ];
  if (service.slug.includes("/")) {
    const parentSlug = service.slug.split("/")[0];
    const parent = getServiceBySlug(parentSlug);
    if (parent) {
      breadcrumb.push({ label: parent.title, href: serviceHref(parent.slug) });
    }
  }
  breadcrumb.push({ label: service.title, href: serviceHref(service.slug) });

  return (
    <main>
      <Navbar />
      <article className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb
            items={breadcrumb.map((b, i) =>
              i === breadcrumb.length - 1
                ? { label: b.label }
                : { label: b.label, href: b.href }
            )}
          />

          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-accent">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight">
              {service.title}
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-persian-tight mb-6 text-foreground/90">
            {service.heroHeading}
          </h2>
          <div className="mb-12 space-y-3">
            {service.intro.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="text-lg text-muted-foreground leading-persian"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full mb-14">
            <section>
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">
                {service.forWhoHeading}
              </h2>
              <ul className="space-y-3">
                {service.forWho.map((item) => (
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

            <section>
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">
                {service.deliverablesHeading}
              </h2>
              <ul className="space-y-3">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-caption text-muted-foreground leading-persian"
                  >
                    <span className="text-accent shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <ServiceContentBlocks blocks={service.beforeProcess} />

          {service.process.length > 0 && (
            <section className="mb-12 w-full">
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">
                {service.processHeading}
              </h2>
              <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {service.process.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-xl border border-border p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-caption text-muted-foreground leading-persian">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <ServiceContentBlocks blocks={service.afterProcess} />

          {service.faq.length > 0 && (
            <section className="mb-14 w-full">
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">
                سؤالات متداول
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                {service.faq.map((item) => (
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
          )}

          <div className="rounded-2xl border border-border bg-card p-8 text-center mb-16 w-full">
            <h2 className="text-xl font-bold mb-2">
              آماده‌اید درباره {service.title} صحبت کنیم؟
            </h2>
            <p className="text-caption text-muted-foreground leading-persian mb-6">
              جلسه اول رایگان است. وضعیت شما را می‌شنویم و مسیر پیشنهادی را
              می‌گوییم.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-bold text-sm px-7 py-3.5"
            >
              درخواست مشاوره
              <span>←</span>
            </Link>
          </div>

          {others.length > 0 && (
            <section className="w-full">
              <h2 className="text-lg font-bold mb-5">سایر خدمات دیجیتال مارکتینگ</h2>
              <div className="grid sm:grid-cols-3 gap-4 w-full">
                {others.map((s) => (
                  <Link
                    key={s.slug}
                    href={serviceHref(s.slug)}
                    className="rounded-xl border border-border p-4 hover:border-accent/50 transition-colors"
                  >
                    <p className="font-bold">{s.title}</p>
                    <p className="text-caption text-muted-foreground mt-1 line-clamp-2">
                      {s.shortDesc}
                    </p>
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
