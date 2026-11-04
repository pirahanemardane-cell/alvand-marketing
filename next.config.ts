import type { NextConfig } from "next";

/** Percent-encoded sources so rewrites match what the HTTP server receives. */
function enc(segment: string): string {
  return encodeURIComponent(segment);
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "hirael.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    // Old Persian bookmark URLs → stable ASCII routes (encoded source
    // required so the matcher sees the same bytes as the request).
    return [
      {
        source: `/${enc("ورود")}`,
        destination: "/login",
        permanent: true,
      },
      {
        source: `/${enc("ثبت-نام")}`,
        destination: "/register",
        permanent: true,
      },
      {
        source: `/${enc("فراموشی-رمز")}`,
        destination: "/forgot-password",
        permanent: true,
      },
      {
        source: `/${enc("تغییر-رمز")}`,
        destination: "/reset-password",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Keep Persian public URLs working for services/blog/contact while
    // pages live under ASCII folders.
    return [
      {
        source: `/${enc("خدمات")}`,
        destination: "/services",
      },
      {
        source: `/${enc("خدمات")}/:slug`,
        destination: "/services/:slug",
      },
      {
        source: `/${enc("بلاگ")}`,
        destination: "/blog",
      },
      {
        source: `/${enc("بلاگ")}/:slug`,
        destination: "/blog/:slug",
      },
      {
        source: `/${enc("تماس")}`,
        destination: "/contact",
      },
    ];
  },
};

export default nextConfig;
