import { services, servicesOverview } from "@/lib/services";
import { DEFAULT_SITE_URL } from "@/lib/seo/site";

export type SeoPageDefaults = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  schemaTypes: string[];
  schemaSummary: string;
};

const STATIC: Record<string, SeoPageDefaults> = {
  home: {
    title: "الوند مارکتینگ",
    metaTitle: "الوند مارکتینگ | آژانس دیجیتال مارکتینگ",
    metaDescription:
      "الوند مارکتینگ — مثل کوه پشتتیم. آژانس دیجیتال مارکتینگ با استراتژی‌های پایدار و نتایج واقعی.",
    canonicalPath: "/",
    schemaTypes: ["Organization", "WebSite"],
    schemaSummary: "Organization + WebSite روی صفحه اصلی",
  },
  services: {
    title: servicesOverview.title,
    metaTitle: servicesOverview.seoTitle,
    metaDescription: servicesOverview.seoDescription,
    canonicalPath: "/services",
    schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList", "Organization"],
    schemaSummary: "CollectionPage + ItemList + BreadcrumbList + Organization",
  },
  blog: {
    title: "بلاگ",
    metaTitle: "بلاگ | الوند مارکتینگ",
    metaDescription:
      "مقالات کاربردی درباره سئو، تبلیغات، طراحی سایت و بازاریابی دیجیتال.",
    canonicalPath: "/blog",
    schemaTypes: ["CollectionPage", "BreadcrumbList"],
    schemaSummary: "CollectionPage + BreadcrumbList برای فهرست بلاگ",
  },
  contact: {
    title: "تماس با ما",
    metaTitle: "تماس با ما | الوند مارکتینگ",
    metaDescription:
      "برای مشاوره رایگان با الوند مارکتینگ تماس بگیرید. واتساپ، تلفن و فرم آنلاین.",
    canonicalPath: "/contact",
    schemaTypes: ["ContactPage", "BreadcrumbList", "Organization"],
    schemaSummary: "ContactPage + BreadcrumbList + Organization",
  },
  about: {
    title: "درباره ما",
    metaTitle: "درباره ما | الوند مارکتینگ",
    metaDescription:
      "آشنایی با الوند مارکتینگ: تیم، رویکرد اندازه‌پذیر و هفت سال فعالیت در دیجیتال مارکتینگ ایران.",
    canonicalPath: "/about",
    schemaTypes: ["AboutPage", "BreadcrumbList", "Organization"],
    schemaSummary: "AboutPage + BreadcrumbList + Organization",
  },
};

export function defaultsForPageKey(pageKey: string): SeoPageDefaults | null {
  if (STATIC[pageKey]) return STATIC[pageKey];
  if (pageKey.startsWith("service:")) {
    const slug = pageKey.slice("service:".length);
    const service = services.find((s) => s.slug === slug);
    if (!service) return null;
    return {
      title: service.title,
      metaTitle: service.seoTitle,
      metaDescription: service.seoDescription,
      canonicalPath: `/services/${service.slug}`,
      schemaTypes: ["Service", "WebPage", "BreadcrumbList", "Organization"],
      schemaSummary: "Service + WebPage + BreadcrumbList + Organization (بدون Offer/قیمت)",
    };
  }
  return null;
}

export function absoluteCanonical(path: string, siteUrl = DEFAULT_SITE_URL): string {
  const base = siteUrl.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
