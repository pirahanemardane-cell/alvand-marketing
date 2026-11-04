/**
 * Practical in-memory rate limiter (per server instance).
 * Fine for single-region / low-traffic agency sites; replace with Redis/Upstash later if needed.
 *
 * Documented limits (defaults):
 * - /api/contact POST: 5 requests / 15 min / IP
 * - /api/comments POST: 8 requests / 15 min / IP (and login required)
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5_000;

export type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
};

export function clientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  return "unknown";
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    if (buckets.size >= MAX_KEYS) {
      // Drop oldest-ish entries when the map grows too large
      const first = buckets.keys().next().value;
      if (first) buckets.delete(first);
    }
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  if (bucket.count > limit) {
    return { ok: false, limit, remaining: 0, retryAfterSec };
  }
  return {
    ok: true,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec,
  };
}

export const CONTACT_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;
export const COMMENT_LIMIT = { limit: 8, windowMs: 15 * 60 * 1000 } as const;
