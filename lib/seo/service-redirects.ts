/**
 * Legacy service slug → canonical slug.
 * Used by next.config redirects, middleware (301), and PDP soft-nav guards.
 * Keys may be single-segment or nested (a/b/c).
 */
export const LEGACY_SERVICE_SLUGS: Record<string, string> = {
  // Latin "api" slug → fully Persian (workbook still suggests latin)
  "api-و-یکپارچه‌سازی": "ای‌پی‌آی-و-یکپارچه‌سازی",
  // Note: /services/اینستاگرام is again a live PLP (مدیریت اینستاگرام).
  // The prior 301 → شبکه‌های-اجتماعی was removed in the PLP/PDP batch import.
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
