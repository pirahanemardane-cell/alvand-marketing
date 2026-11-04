import { NextRequest, NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/blog";

/** Public list of published posts (for navbar search / client widgets). */
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || undefined;
    const items = await listPublishedPosts(q);
    return NextResponse.json({
      posts: items.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        date: p.date,
      })),
    });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
