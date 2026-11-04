import { createAnonClient } from "@/lib/supabase/public";

export type BlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sections: BlogSection[];
  body?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  robots_index?: boolean;
  robots_follow?: boolean;
};

type DbPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  published_at: string | null;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
  robots_index: boolean | null;
  robots_follow: boolean | null;
  blog_categories?: { name: string } | { name: string }[] | null;
};

/** @deprecated Prefer listPublishedPosts(); kept for client search fallback. */
export const posts: BlogPost[] = [];

function categoryName(row: DbPost): string {
  const c = row.blog_categories;
  if (!c) return "بلاگ";
  if (Array.isArray(c)) return c[0]?.name || "بلاگ";
  return c.name || "بلاگ";
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Turn plain body text into simple sections for the article UI. */
export function bodyToSections(body: string | null | undefined): BlogSection[] {
  const text = (body || "").trim();
  if (!text) return [];

  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return [];

  // Detect markdown-ish ## headings
  const sections: BlogSection[] = [];
  let current: BlogSection | null = null;

  for (const block of blocks) {
    const heading = block.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      if (current) sections.push(current);
      current = {
        id: `s-${sections.length + 1}`,
        title: heading[1].trim(),
        paragraphs: [],
      };
      continue;
    }
    if (!current) {
      current = {
        id: "s-1",
        title: "مقدمه",
        paragraphs: [],
      };
    }
    current.paragraphs.push(block.replace(/\n/g, " "));
  }
  if (current) sections.push(current);

  // If only one untitled dump, drop generic "مقدمه" title in TOC by using body paragraphs only
  if (
    sections.length === 1 &&
    sections[0].title === "مقدمه" &&
    !text.startsWith("#")
  ) {
    return [
      {
        id: "content",
        title: "متن مقاله",
        paragraphs: sections[0].paragraphs,
      },
    ];
  }

  return sections;
}

function mapRow(row: DbPost): BlogPost {
  const sections = bodyToSections(row.body);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    date: formatDate(row.published_at || row.created_at),
    category: categoryName(row),
    sections,
    body: row.body,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    robots_index: row.robots_index ?? true,
    robots_follow: row.robots_follow ?? true,
  };
}

const SELECT =
  "id, slug, title, excerpt, body, published_at, created_at, meta_title, meta_description, robots_index, robots_follow, blog_categories(name)";

export async function listPublishedPosts(query?: string): Promise<BlogPost[]> {
  const sb = createAnonClient();
  if (!sb) return [];

  let q = sb
    .from("blog_posts")
    .select(SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const { data, error } = await q;
  if (error || !data) return [];

  let rows = (data as unknown as DbPost[]).map(mapRow);
  const s = query?.trim();
  if (s) {
    rows = rows.filter(
      (p) =>
        p.title.includes(s) ||
        p.excerpt.includes(s) ||
        p.category.includes(s) ||
        (p.body || "").includes(s)
    );
  }
  return rows;
}

export async function getPublishedPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const sb = createAnonClient();
  if (!sb) return undefined;

  const decoded = decodeURIComponent(slug);
  for (const candidate of Array.from(new Set([decoded, slug]))) {
    const { data, error } = await sb
      .from("blog_posts")
      .select(SELECT)
      .eq("status", "published")
      .eq("slug", candidate)
      .maybeSingle();
    if (!error && data) return mapRow(data as unknown as DbPost);
  }
  return undefined;
}

export async function listPublishedSlugs(): Promise<string[]> {
  const posts = await listPublishedPosts();
  return posts.map((p) => p.slug);
}

export function getReadingTimeMinutes(post: BlogPost): number {
  const fromSections = post.sections
    .flatMap((s) => [s.title, ...s.paragraphs])
    .join(" ");
  const text = (fromSections || post.body || post.excerpt || "").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toPersianDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** Sync helpers kept for legacy call sites — prefer async DB fetchers. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const decoded = decodeURIComponent(slug);
  return posts.find((p) => p.slug === slug || p.slug === decoded);
}

export function getAllPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}
