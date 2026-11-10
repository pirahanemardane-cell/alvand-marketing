import type { Service, ServicesOverview } from "@/lib/services";
import { serviceHref } from "@/lib/services";
import { siteUrl } from "@/lib/seo/site";

export function absoluteUrl(path: string): string {
  const base = siteUrl().replace(/\/$/, "");
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}/#organization`,
    name: "الوند مارکتینگ",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.png"),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Hub `/services` — CollectionPage + ItemList + BreadcrumbList + Organization */
export function servicesHubJsonLd(
  overview: ServicesOverview,
  serviceList: Service[]
) {
  const pageUrl = absoluteUrl("/services");
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: overview.seoTitle,
        description: overview.seoDescription,
        isPartOf: { "@id": `${absoluteUrl("/")}/#website` },
        about: { "@id": `${absoluteUrl("/")}/#organization` },
        inLanguage: "fa-IR",
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: overview.title,
        numberOfItems: serviceList.length,
        itemListElement: serviceList.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: absoluteUrl(serviceHref(s.slug)),
        })),
      },
      {
        ...breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: overview.title, path: "/services" },
        ]),
        "@id": `${pageUrl}#breadcrumb`,
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}/#website`,
        url: absoluteUrl("/"),
        name: "الوند مارکتینگ",
        inLanguage: "fa-IR",
        publisher: { "@id": `${absoluteUrl("/")}/#organization` },
      },
    ],
  };
}

/** Service PDP — Service + WebPage + BreadcrumbList (no Offer/price). */
export function servicePdpJsonLd(
  service: Service,
  crumbs: { name: string; path: string }[],
  imageUrl?: string
) {
  const pageUrl = absoluteUrl(serviceHref(service.slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: service.seoTitle,
        description: service.seoDescription,
        isPartOf: { "@id": `${absoluteUrl("/")}/#website` },
        about: { "@id": `${pageUrl}#service` },
        inLanguage: "fa-IR",
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        ...(imageUrl ? { primaryImageOfPage: { "@type": "ImageObject", url: imageUrl } } : {}),
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: service.title,
        description: service.seoDescription || service.shortDesc,
        url: pageUrl,
        serviceType: service.title,
        provider: { "@id": `${absoluteUrl("/")}/#organization` },
        areaServed: {
          "@type": "Country",
          name: "Iran",
        },
        ...(imageUrl ? { image: imageUrl } : {}),
        // No Offer / price — consultation only
      },
      {
        ...breadcrumbJsonLd(crumbs),
        "@id": `${pageUrl}#breadcrumb`,
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}/#website`,
        url: absoluteUrl("/"),
        name: "الوند مارکتینگ",
        inLanguage: "fa-IR",
        publisher: { "@id": `${absoluteUrl("/")}/#organization` },
      },
    ],
  };
}
