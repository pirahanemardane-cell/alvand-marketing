/**
 * Cloudflare R2 public CDN helpers.
 * Objects live under the `media/` prefix on cdn.alvandmarketing.ir.
 * NEXT_PUBLIC_R2_PUBLIC_BASE_URL overrides the default host when set.
 * Rendered content images always resolve to that CDN — never the app origin.
 */

const DEFAULT_PUBLIC_BASE = "https://cdn.alvandmarketing.ir";

const PUBLIC_BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE
).replace(/\/$/, "");

/** Marketing site origins whose /images and /diagrams paths are mirrored on the CDN. */
const SITE_IMAGE_HOSTS = new Set([
  "alvandmarketing.ir",
  "www.alvandmarketing.ir",
]);

const CONTENT_IMAGE_PREFIXES = ["images/", "diagrams/"] as const;

const MEDIA_PREFIX = "media";

/** Normalize to a path under `media/` (no leading slash). */
export function mediaObjectKey(path: string): string {
  const cleaned = path.replace(/^\/+/, "").replace(/^media\//, "");
  return `${MEDIA_PREFIX}/${cleaned}`;
}

/** Encode each path segment so Persian / Unicode keys resolve on the CDN. */
function encodeKeySegments(key: string): string {
  return key
    .split("/")
    .map((part) => {
      try {
        return encodeURIComponent(decodeURIComponent(part));
      } catch {
        return encodeURIComponent(part);
      }
    })
    .join("/");
}

/**
 * Absolute CDN URL for a media object.
 * Pass a site-relative path like `images/hero-night.webp` or `ALVAND-bg.webp`.
 */
export function mediaUrl(path: string): string {
  const key = mediaObjectKey(path);
  const encoded = encodeKeySegments(key);
  return `${PUBLIC_BASE}/${encoded}`;
}

function contentImagePath(pathname: string): boolean {
  const rel = pathname.replace(/^\/+/, "");
  return CONTENT_IMAGE_PREFIXES.some(
    (prefix) => rel.startsWith(prefix) || rel.startsWith(`media/${prefix}`)
  );
}

/**
 * URL the browser should request for a rendered image.
 * Content paths (`/images/…`, `/diagrams/…`, and the same paths on the site
 * origin) are rewritten to the Cloudflare CDN. URLs that are already on the
 * CDN are left unchanged. Other hosts are left unchanged — callers must not
 * assume those bytes are on R2.
 */
export function resolveRenderedImageSrc(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (url.hostname === mediaPublicHostname()) return trimmed;
      if (SITE_IMAGE_HOSTS.has(url.hostname) && contentImagePath(url.pathname)) {
        return mediaUrl(url.pathname);
      }
    } catch {
      return trimmed;
    }
    return trimmed;
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (contentImagePath(path)) return mediaUrl(path);
  return trimmed;
}

/** Hostname of the R2 public base (for next/image remotePatterns). */
export function mediaPublicHostname(): string | null {
  if (!PUBLIC_BASE) return null;
  try {
    return new URL(PUBLIC_BASE).hostname;
  } catch {
    return null;
  }
}
