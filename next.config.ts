import type { NextConfig } from "next";

/** Percent-encoded sources so rewrites match what the HTTP server receives. */
function enc(segment: string): string {
  return encodeURIComponent(segment);
}

function r2PublicHostname(): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  try {
    return new URL(base).hostname;
  } catch {
    return null;
  }
}

const r2Host = r2PublicHostname();

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  { protocol: "https", hostname: "hirael.com" },
  // Always allow the production R2 custom domain (images served via mediaUrl).
  { protocol: "https", hostname: "cdn.alvandmarketing.ir" },
];

if (r2Host && r2Host !== "cdn.alvandmarketing.ir") {
  remotePatterns.push({ protocol: "https", hostname: r2Host });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // Avoid noisy webpack PackFileCacheStrategy warnings on large assets during CI/prod builds.
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns,
  },
  async headers() {
    const longCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      {
        source: "/fonts/:path*",
        headers: longCache,
      },
      {
        source: "/_next/static/:path*",
        headers: longCache,
      },
      // Icons / PWA assets — safe CWV leftover (no visual change).
      {
        source: "/favicon.png",
        headers: longCache,
      },
      {
        source: "/icon.png",
        headers: longCache,
      },
      {
        source: "/icon1.png",
        headers: longCache,
      },
      {
        source: "/apple-icon.png",
        headers: longCache,
      },
      {
        source: "/web-app-manifest-:size.png",
        headers: longCache,
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
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
      // Legacy Instagram PLP → شبکه‌های اجتماعی (explicit 301 for Google)
      {
        source: `/services/${enc("اینستاگرام")}`,
        destination: `/services/${enc("شبکه‌های-اجتماعی")}`,
        statusCode: 301,
      },
      {
        source: `/${enc("خدمات")}/${enc("اینستاگرام")}`,
        destination: `/services/${enc("شبکه‌های-اجتماعی")}`,
        statusCode: 301,
      },
      // Latin api slug → fully Persian
      {
        source: `/services/${enc("api-و-یکپارچه‌سازی")}`,
        destination: `/services/${enc("ای‌پی‌آی-و-یکپارچه‌سازی")}`,
        statusCode: 301,
      },
      {
        source: `/${enc("خدمات")}/${enc("api-و-یکپارچه‌سازی")}`,
        destination: `/services/${enc("ای‌پی‌آی-و-یکپارچه‌سازی")}`,
        statusCode: 301,
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
        source: `/${enc("خدمات")}/:path*`,
        destination: "/services/:path*",
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
