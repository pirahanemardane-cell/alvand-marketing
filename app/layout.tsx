import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import SentryInit from "@/components/SentryInit";
import { mediaUrl } from "@/lib/media";
import "./globals.css";

export const metadata: Metadata = {
  title: "الوند مارکتینگ | آژانس دیجیتال مارکتینگ",
  description:
    "الوند مارکتینگ — مثل کوه پشتتیم. آژانس دیجیتال مارکتینگ با استراتژی‌های پایدار و نتایج واقعی.",
  icons: {
    // Prefer compact PNGs — the legacy icon0.svg embeds a ~200KB raster and hurts PSI.
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon1.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/IRANYekanXFaNum-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/IRANYekanXFaNum-Heavy.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/IRANYekanXFaNum-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Default theme is night/dark — only preload LCP hero; morning loads on theme toggle. */}
        <link
          rel="preload"
          href={mediaUrl("images/hero-night.webp")}
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>

      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          پرش به محتوای اصلی
        </a>
        <ThemeProvider>
          <SentryInit />
          <div id="main-content">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
