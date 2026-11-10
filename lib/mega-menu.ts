import {
  getChildServices,
  getDirectChildServices,
  getServiceBySlug,
  getTopLevelServices,
  type Service,
} from "@/lib/services";

/** Max featured child links under each parent in the mega-menu. */
export const MEGA_MENU_FEATURED_CHILD_LIMIT = 4;

/**
 * Curated featured child slugs per top-level parent (order = display order).
 * Only these appear under the parent heading — not the full nested inventory.
 * Instagram / LinkedIn are nested PDPs under شبکه‌های اجتماعی.
 */
export const MEGA_MENU_FEATURED_CHILDREN: Record<string, string[]> = {
  "طراحی-سایت": [
    "طراحی-سایت/وردپرس",
    "طراحی-سایت/لندینگ-پیج",
    "طراحی-سایت/پزشکی",
    "طراحی-سایت/خدماتی",
  ],
  سئو: ["سئو/فروشگاهی", "سئو/پزشکی", "سئو/بین-المللی"],
  "تولید-محتوا": ["تولید-محتوا/ویدیویی"],
  "تبلیغات-اینترنتی": [
    "تبلیغات-اینترنتی/بنری",
    "تبلیغات-اینترنتی/رپورتاژ-آگهی",
    "تبلیغات-اینترنتی/شبکه‌های-اجتماعی",
    "تبلیغات-اینترنتی/پوش-نوتیفیکیشن",
  ],
  "شبکه‌های-اجتماعی": [
    "شبکه‌های-اجتماعی/اینستاگرام",
    "شبکه‌های-اجتماعی/لینکدین",
  ],
  آنالیتیکس: [
    "آنالیتیکس/گوگل-آنالیتیکس",
    "آنالیتیکس/تگ-منیجر",
    "آنالیتیکس/سرچ-کنسول",
  ],
  "پشتیبانی-سایت": [
    "پشتیبانی-سایت/افزایش-سرعت",
    "پشتیبانی-سایت/امنیت",
    "پشتیبانی-سایت/رفع-ارور",
    "پشتیبانی-سایت/فروشگاهی",
  ],
  "اپلیکیشن-و-وب-اپ": [
    "اپلیکیشن-و-وب-اپ/وب-اپلیکیشن",
    "اپلیکیشن-و-وب-اپ/فروشگاهی",
  ],
};

export type MegaMenuColumn = {
  parent: Service;
  featuredChildren: Service[];
};

/** Stable column order: high-demand categories first, then remaining top-level. */
const COLUMN_ORDER: string[] = [
  "طراحی-سایت",
  "سئو",
  "تولید-محتوا",
  "تبلیغات-اینترنتی",
  "شبکه‌های-اجتماعی",
  "هوش-مصنوعی",
  "ایمیل-مارکتینگ",
  "آنالیتیکس",
  "پشتیبانی-سایت",
  "اپلیکیشن-و-وب-اپ",
  "ای‌پی‌آی-و-یکپارچه‌سازی",
  "مشاوره-دیجیتال-مارکتینگ",
  "برندینگ",
];

/**
 * Featured sample PDPs under a PLP (≤4).
 * Prefer curated list; if empty but nested PDPs exist, fall back to first direct children.
 */
export function getMegaMenuFeaturedChildren(parentSlug: string): Service[] {
  const curated = MEGA_MENU_FEATURED_CHILDREN[parentSlug] || [];
  const out: Service[] = [];
  for (const slug of curated.slice(0, MEGA_MENU_FEATURED_CHILD_LIMIT)) {
    const svc = getServiceBySlug(slug);
    if (svc) out.push(svc);
  }
  if (out.length > 0) return out;
  return getDirectChildServices(parentSlug).slice(
    0,
    MEGA_MENU_FEATURED_CHILD_LIMIT
  );
}

function orderedTopLevelServices(): Service[] {
  const tops = getTopLevelServices();
  const bySlug = new Map(tops.map((s) => [s.slug, s]));
  const ordered: Service[] = [];
  for (const slug of COLUMN_ORDER) {
    const s = bySlug.get(slug);
    if (s) {
      ordered.push(s);
      bySlug.delete(slug);
    }
  }
  for (const s of bySlug.values()) ordered.push(s);
  return ordered;
}

/** Columns for desktop mega-menu + mobile accordion parents. */
export function getMegaMenuColumns(): MegaMenuColumn[] {
  return orderedTopLevelServices().map((parent) => ({
    parent,
    featuredChildren: getMegaMenuFeaturedChildren(parent.slug),
  }));
}

export type HubCatalogGroup = {
  parent: Service;
  /** Parent first, then every nested descendant under that slug. */
  items: Service[];
};

/**
 * Hub grouping helper (parent + nested descendants).
 * `/services` lists top-level PLPs only via `getTopLevelServices()`;
 * nested PDPs remain on parent pages and mega-menu samples.
 */
export function getHubCatalogGroups(): HubCatalogGroup[] {
  return orderedTopLevelServices().map((parent) => {
    const nested = getChildServices(parent.slug);
    return {
      parent,
      items: [parent, ...nested],
    };
  });
}

export function isServicePathActive(
  pathname: string,
  href: string,
  opts?: { includeDescendants?: boolean }
): boolean {
  let decodedPath = pathname;
  let decodedHref = href;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    /* keep */
  }
  try {
    decodedHref = decodeURIComponent(href);
  } catch {
    /* keep */
  }
  if (decodedPath === decodedHref || pathname === href) return true;
  if (opts?.includeDescendants) {
    const prefix = decodedHref.endsWith("/") ? decodedHref : `${decodedHref}/`;
    return decodedPath.startsWith(prefix);
  }
  return false;
}
