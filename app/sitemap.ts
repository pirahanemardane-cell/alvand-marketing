import type { MetadataRoute } from "next";
import { listPublishedPosts, blogUrlPath } from "@/lib/blog";
import { getAllServiceSlugs, serviceUrlPath } from "@/lib/services";
import { siteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = siteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = getAllServiceSlugs().map(
    (slug) => ({
      url: `${BASE}/services/${serviceUrlPath(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })
  );

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedPosts();
    postRoutes = posts.map((p) => ({
      url: `${BASE}/blog/${blogUrlPath(p.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    }));
  } catch {
    postRoutes = [];
  }

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
