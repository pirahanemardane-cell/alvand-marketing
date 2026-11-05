import { NextRequest, NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/blog";
import { captureException } from "@/lib/observability";

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
  } catch (e) {
    void captureException(e, { route: "/api/blog", method: "GET" });
    return NextResponse.json({ posts: [] });
  }
}
