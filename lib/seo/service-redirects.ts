/**
 * Legacy service slug → canonical slug.
 * Used by next.config redirects, middleware (301), and PDP soft-nav guards.
 */
export const LEGACY_SERVICE_SLUGS: Record<string, string> = {
  // Prior Instagram PLP replaced by شبکه‌های اجتماعی
  اینستاگرام: "شبکه‌های-اجتماعی",
};

export function canonicalServiceSlug(slug: string): string | null {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();
  return LEGACY_SERVICE_SLUGS[decoded] ?? LEGACY_SERVICE_SLUGS[slug] ?? null;
}
