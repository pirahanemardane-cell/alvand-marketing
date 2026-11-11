import packageRedirects from "@/lib/content/package-redirects.json";

/**
 * Legacy path → canonical path (without origin).
 * Built from content-package redirects (44× 301) plus Persian-root variants.
 */
export type PathRedirect = {
  source: string;
  destination: string;
  statusCode: number;
  reason?: string;
};

const ZWNJ = "\u200c";

function normalizePath(pathname: string): string {
  let p = pathname;
  try {
    p = decodeURIComponent(pathname);
  } catch {
    /* keep */
  }
  p = p.normalize("NFC");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

/** All package redirects (services + blog). */
export const PACKAGE_REDIRECTS: PathRedirect[] = (
  packageRedirects as PathRedirect[]
).map((r) => ({
  ...r,
  source: normalizePath(r.source),
  destination: normalizePath(r.destination),
}));

/**
 * Legacy service slug → canonical slug (no /services prefix).
 * Used by next.config redirects, middleware (301), and PDP soft-nav guards.
 */
export const LEGACY_SERVICE_SLUGS: Record<string, string> = {};

for (const r of PACKAGE_REDIRECTS) {
  if (!r.source.startsWith("/services/")) continue;
  if (!r.destination.startsWith("/services/")) continue;
  const from = r.source.slice("/services/".length);
  const to = r.destination.slice("/services/".length);
  LEGACY_SERVICE_SLUGS[from] = to;
  // Also map ZWNJ-stripped form if different
  const fromHyphen = from.split(ZWNJ).join("");
  if (fromHyphen !== from && !LEGACY_SERVICE_SLUGS[fromHyphen]) {
    // no-op: package already has explicit ZWNJ→hyphen rows
  }
}

export function canonicalServiceSlug(slug: string): string | null {
  const decoded = normalizePath(slug.startsWith("/") ? slug : `/${slug}`).replace(
    /^\//,
    ""
  );
  // slug may be "a/b" without leading services
  return (
    LEGACY_SERVICE_SLUGS[decoded] ??
    LEGACY_SERVICE_SLUGS[slug] ??
    null
  );
}

/** Look up any package redirect by full pathname (/services/... or /blog/...). */
export function lookupPathRedirect(pathname: string): PathRedirect | null {
  const decoded = normalizePath(pathname);
  const hit = PACKAGE_REDIRECTS.find((r) => r.source === decoded);
  if (hit) return hit;

  // Persian root aliases: /خدمات/... → treat as /services/...
  const segments = decoded.split("/").filter(Boolean);
  if (segments[0] === "خدمات") {
    const asServices = normalizePath(`/services/${segments.slice(1).join("/")}`);
    const via = PACKAGE_REDIRECTS.find((r) => r.source === asServices);
    if (via) return via;
  }
  if (segments[0] === "بلاگ") {
    const asBlog = normalizePath(`/blog/${segments.slice(1).join("/")}`);
    const via = PACKAGE_REDIRECTS.find((r) => r.source === asBlog);
    if (via) return via;
  }
  return null;
}
