import type { Metadata } from "next";

/** Production public origin — used for sitemap, robots, and absolute canonicals. */
export const DEFAULT_SITE_URL = "https://alvandmarketing.ir";

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL
  );
}

/** Absolute URL without introducing a double slash after the origin. */
export function absoluteUrl(path: string): string {
  const base = siteUrl().replace(/\/$/, "");
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Auth / panel routes — never offer these to search engines. */
export const privateRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/** Public marketing default. */
export const publicRobots: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
};
