/**
 * Cloudflare R2 public CDN helpers.
 * Objects live under the `media/` prefix. Requires NEXT_PUBLIC_R2_PUBLIC_BASE_URL.
 */

const PUBLIC_BASE = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || ""
).replace(/\/$/, "");

const MEDIA_PREFIX = "media";

/** Normalize to a path under `media/` (no leading slash). */
export function mediaObjectKey(path: string): string {
  const cleaned = path.replace(/^\/+/, "").replace(/^media\//, "");
  return `${MEDIA_PREFIX}/${cleaned}`;
}

/**
 * Absolute CDN URL for a media object.
 * Pass a site-relative path like `images/hero-night.webp` or `ALVAND-bg.webp`.
 * Falls back to a same-origin `/…` path when the public base URL is unset (local only).
 */
export function mediaUrl(path: string): string {
  const key = mediaObjectKey(path);
  if (!PUBLIC_BASE) {
    return `/${key.replace(/^media\//, "")}`;
  }
  return `${PUBLIC_BASE}/${key}`;
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
