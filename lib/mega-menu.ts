import {
  getServiceBySlug,
  getTopLevelServices,
  type Service,
} from "@/lib/services";

/** Max featured child links under each parent in the mega-menu. */
export const MEGA_MENU_FEATURED_CHILD_LIMIT = 4;

/**
 * Curated featured child slugs per top-level parent (order = display order).
 * Only these appear under the parent heading — not the full nested inventory.
 * Instagram / LinkedIn stay top-level columns (their own PLPs) and are also
 * featured under شبکه‌های اجتماعی for discovery.
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
  "شبکه‌های-اجتماعی": ["اینستاگرام", "لینکدین"],
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
  "اینستاگرام",
  "لینکدین",
  "هوش-مصنوعی",
  "ایمیل-مارکتینگ",
  "آنالیتیکس",
  "پشتیبانی-سایت",
  "اپلیکیشن-و-وب-اپ",
  "ای‌پی‌آی-و-یکپارچه‌سازی",
  "مشاوره-دیجیتال-مارکتینگ",
  "برندینگ",
];

export function getMegaMenuFeaturedChildren(parentSlug: string): Service[] {
  const slugs = (MEGA_MENU_FEATURED_CHILDREN[parentSlug] || []).slice(
    0,
    MEGA_MENU_FEATURED_CHILD_LIMIT
  );
  const out: Service[] = [];
  for (const slug of slugs) {
    const svc = getServiceBySlug(slug);
    if (svc) out.push(svc);
  }
  return out;
}

/** Columns for desktop mega-menu + mobile accordion parents. */
export function getMegaMenuColumns(): MegaMenuColumn[] {
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
  // Any unexpected new top-level services append at end
  for (const s of bySlug.values()) ordered.push(s);

  return ordered.map((parent) => ({
    parent,
    featuredChildren: getMegaMenuFeaturedChildren(parent.slug),
  }));
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
