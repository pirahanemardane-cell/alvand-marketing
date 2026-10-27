export type BlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sections: BlogSection[];
};

/** پست‌های ثابت حذف شدند؛ مقالات از پنل ادمین / Supabase می‌آیند */
export const posts: BlogPost[] = [];

export function getReadingTimeMinutes(post: BlogPost): number {
  const text = post.sections.flatMap((s) => [s.title, ...s.paragraphs]).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toPersianDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const decoded = decodeURIComponent(slug);
  return posts.find((p) => p.slug === slug || p.slug === decoded);
}

export function getAllPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}
