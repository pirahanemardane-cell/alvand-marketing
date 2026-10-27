import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import PageBreadcrumb from "@/components/Breadcrumb";
import { services, getServiceBySlug, getAllServiceSlugs } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "خدمت یافت نشد" };
  return {
    title: `${service.title} | الوند مارکتینگ`,
    description: service.shortDesc,
    robots: { index: false, follow: false },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <main>
      <Navbar />
      <article className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-background min-h-screen w-full">
        <div className="w-full">
          <PageBreadcrumb
            items={[
              { label: "خدمات دیجیتال مارکتینگ", href: "/خدمات" },
              { label: service.title },
            ]}
          />

          <h1 className="text-3xl md:text-5xl font-bold leading-persian-tight mb-6">
            {service.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-persian mb-12">
            {service.fullDesc}
          </p>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 w-full mb-14">
            <section>
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">
                برای چه کسانی مناسب است؟
              </h2>
              <ul className="space-y-3">
                {service.forWho.map((item) => (
                  <li key={item} className="flex gap-3 text-caption text-muted-foreground leading-persian">
                    <span className="text-accent shrink-0">●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">
                چه چیزی تحویل می‌گیرید؟
              </h2>
              <ul className="space-y-3">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-caption text-muted-foreground leading-persian">
                    <span className="text-accent shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mb-12 w-full">
            <h2 className="text-xl font-bold mb-4 leading-persian-tight">فرآیند کار</h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {service.process.map((step, i) => (
                <li key={step} className="flex gap-4 rounded-xl border border-border p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-caption text-muted-foreground leading-persian">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {service.faq.length > 0 && (
            <section className="mb-14 w-full">
              <h2 className="text-xl font-bold mb-4 leading-persian-tight">سؤالات متداول این خدمت</h2>
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                {service.faq.map((item) => (
                  <div key={item.q} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-bold mb-2">{item.q}</h3>
                    <p className="text-caption text-muted-foreground leading-persian">{item.a}</p>
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
              جلسه اول رایگان است. وضعیت شما را می‌شنویم و مسیر پیشنهادی را می‌گوییم.
            </p>
            <Link
              href="/تماس"
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
                    href={`/خدمات/${s.slug}`}
                    className="rounded-xl border border-border p-4 hover:border-accent/50 transition-colors"
                  >
                    <p className="font-bold">{s.title}</p>
                    <p className="text-caption text-muted-foreground mt-1 line-clamp-2">{s.shortDesc}</p>
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
