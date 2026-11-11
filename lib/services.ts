import packageServices from "@/lib/content/package-services.json";
import packageOverview from "@/lib/content/package-overview.json";

export type ServiceTable = {
  headers: string[];
  rows: string[][];
};

export type ServiceBlock = {
  heading?: string;
  level?: 2 | 3;
  paragraphs?: string[];
  items?: string[];
  table?: ServiceTable;
};

export type Service = {
  slug: string;
  num: string;
  title: string;
  shortDesc: string;
  heroHeading: string;
  intro: string[];
  seoTitle: string;
  seoDescription: string;
  forWhoHeading: string;
  forWho: string[];
  deliverablesHeading: string;
  deliverables: string[];
  processHeading: string;
  process: string[];
  beforeProcess: ServiceBlock[];
  afterProcess: ServiceBlock[];
  faq: { q: string; a: string }[];
  /** Relative path under lib/content/bodies */
  bodyFile?: string;
  /** Full GFM body — attach via getServiceBySlugWithBody on the server. */
  contentMd?: string;
  canonicalUrl?: string;
  /** @deprecated alias kept for search/filter compatibility */
  fullDesc: string;
};

export type ServicesOverview = {
  title: string;
  heroHeading: string;
  intro: string[];
  criteriaHeading: string;
  criteria: string[];
  outputsHeading: string;
  comparisonHeading: string;
  comparisonTable: ServiceTable;
  guideHeading: string;
  guideTable: ServiceTable;
  budgetOrderHeading: string;
  budgetOrder: string[];
  budgetNote: string;
  tipsHeading: string;
  tips: string[];
  ctaNote: string;
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  bodyFile?: string;
  contentMd?: string;
  canonicalUrl?: string;
};

type PackageServiceMeta = Omit<Service, "fullDesc" | "contentMd"> & {
  bodyFile?: string;
  canonicalUrl?: string;
};

function withFullDesc(service: PackageServiceMeta): Service {
  return {
    ...service,
    bodyFile: service.bodyFile,
    canonicalUrl: service.canonicalUrl,
    fullDesc: (service.intro || []).join(" "),
  };
}

export const servicesOverview: ServicesOverview =
  packageOverview as ServicesOverview;

export const services: Service[] = (
  packageServices as PackageServiceMeta[]
).map(withFullDesc);

export function getServiceBySlug(slug: string): Service | undefined {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();
  return services.find((s) => s.slug === slug || s.slug === decoded);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

export function isTopLevelServiceSlug(slug: string): boolean {
  return !slug.includes("/");
}

export function getTopLevelServices(): Service[] {
  return services.filter((s) => isTopLevelServiceSlug(s.slug));
}

export function getChildServices(parentSlug: string): Service[] {
  const prefix = parentSlug.endsWith("/") ? parentSlug : `${parentSlug}/`;
  return services.filter((s) => s.slug.startsWith(prefix));
}

export function getDirectChildServices(parentSlug: string): Service[] {
  const prefix = parentSlug.endsWith("/") ? parentSlug : `${parentSlug}/`;
  return getChildServices(parentSlug).filter((s) => {
    const rest = s.slug.slice(prefix.length);
    return rest.length > 0 && !rest.includes("/");
  });
}

export function getServiceAncestors(slug: string): Service[] {
  const parts = slug.split("/");
  if (parts.length < 2) return [];
  const out: Service[] = [];
  for (let i = 1; i < parts.length; i++) {
    const ancestorSlug = parts.slice(0, i).join("/");
    const svc = getServiceBySlug(ancestorSlug);
    if (svc) out.push(svc);
  }
  return out;
}

export function serviceHref(slug: string): string {
  const path = slug
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/services/${path}`;
}

export function serviceUrlPath(slug: string): string {
  return slug
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}
