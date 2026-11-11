import type { Service, ServicesOverview } from "@/lib/services";
import { serviceHref } from "@/lib/services";
import type { BlogPost } from "@/lib/blog";
import { blogHref } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo/site";
import { authorPersonNode, organizationNode, SITE_ORG } from "@/lib/seo/organization";

export { absoluteUrl };

export function organizationJsonLd() {
  return organizationNode();
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

function faqPageNode(
  pageUrl: string,
  faq: { q: string; a: string }[]
) {
  if (!faq.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** Hub `/services` — CollectionPage + ItemList + BreadcrumbList + Organization */
export function servicesHubJsonLd(
  overview: ServicesOverview,
  serviceList: Service[]
) {
  const pageUrl = absoluteUrl("/services");
  const faq = faqPageNode(pageUrl, overview.faq || []);
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
        isPartOf: { "@id": "https://alvandmarketing.ir/#website" },
        about: { "@id": "https://alvandmarketing.ir/#organization" },
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
        "@id": "https://alvandmarketing.ir/#website",
        url: absoluteUrl("/"),
        name: "الوند مارکتینگ",
        inLanguage: "fa-IR",
        publisher: { "@id": "https://alvandmarketing.ir/#organization" },
      },
      ...(faq ? [faq] : []),
    ],
  };
}

/** Blog article — BlogPosting + Person author + WebPage + BreadcrumbList. */
export function blogArticleJsonLd(
  post: BlogPost,
  crumbs: { name: string; path: string }[],
  imageUrl?: string
) {
  const pageUrl = absoluteUrl(blogHref(post.slug));
  const authorId = `https://alvandmarketing.ir/#author-${SITE_ORG.authorId}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      authorPersonNode(),
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
        isPartOf: { "@id": "https://alvandmarketing.ir/#website" },
        inLanguage: "fa-IR",
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        ...(imageUrl
          ? { primaryImageOfPage: { "@type": "ImageObject", url: imageUrl } }
          : {}),
      },
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        headline: post.title,
        description: post.meta_description || post.excerpt,
        url: pageUrl,
        inLanguage: "fa-IR",
        datePublished: post.date || undefined,
        author: { "@id": authorId },
        publisher: { "@id": "https://alvandmarketing.ir/#organization" },
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      {
        ...breadcrumbJsonLd(crumbs),
        "@id": `${pageUrl}#breadcrumb`,
      },
      {
        "@type": "WebSite",
        "@id": "https://alvandmarketing.ir/#website",
        url: absoluteUrl("/"),
        name: "الوند مارکتینگ",
        inLanguage: "fa-IR",
        publisher: { "@id": "https://alvandmarketing.ir/#organization" },
      },
    ],
  };
}

/** Service PDP — Service + WebPage + FAQPage + BreadcrumbList (no Offer/price). */
export function servicePdpJsonLd(
  service: Service,
  crumbs: { name: string; path: string }[],
  imageUrl?: string
) {
  const pageUrl = absoluteUrl(serviceHref(service.slug));
  const faq = faqPageNode(pageUrl, service.faq || []);
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
        isPartOf: { "@id": "https://alvandmarketing.ir/#website" },
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
        provider: { "@id": "https://alvandmarketing.ir/#organization" },
        areaServed: {
          "@type": "Country",
          name: "Iran",
        },
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      {
        ...breadcrumbJsonLd(crumbs),
        "@id": `${pageUrl}#breadcrumb`,
      },
      {
        "@type": "WebSite",
        "@id": "https://alvandmarketing.ir/#website",
        url: absoluteUrl("/"),
        name: "الوند مارکتینگ",
        inLanguage: "fa-IR",
        publisher: { "@id": "https://alvandmarketing.ir/#organization" },
      },
      ...(faq ? [faq] : []),
    ],
  };
}
