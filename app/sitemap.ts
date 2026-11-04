import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/blog";
import { getAllServiceSlugs } from "@/lib/services";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://alvandmarketing.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = getAllServiceSlugs().map(
    (slug) => ({
      url: `${BASE}/services/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })
  );

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedPosts();
    postRoutes = posts.map((p) => ({
      url: `${BASE}/blog/${encodeURIComponent(p.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));
  } catch {
    postRoutes = [];
  }

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
