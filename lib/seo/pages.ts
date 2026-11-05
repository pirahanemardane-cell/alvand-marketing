import type { Metadata } from "next";
import { createAnonClient } from "@/lib/supabase/public";
import { publicRobots } from "@/lib/seo/site";

export type SeoPageRow = {
  page_key: string;
  title: string | null;
  body_preview: string | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyphrases: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  robots_index: boolean | null;
  robots_follow: boolean | null;
  canonical_url: string | null;
};

const FALLBACKS: Record<
  string,
  { title: string; description: string }
> = {
  home: {
    title: "الوند مارکتینگ | آژانس دیجیتال مارکتینگ",
    description:
      "الوند مارکتینگ — مثل کوه پشتتیم. آژانس دیجیتال مارکتینگ با استراتژی‌های پایدار و نتایج واقعی.",
  },
  services: {
    title:
      "خدمات دیجیتال مارکتینگ؛ سایت، سئو، محتوا و تبلیغات | الوند مارکتینگ",
    description:
      "خدمات دیجیتال مارکتینگ الوند مارکتینگ: طراحی سایت، سئو، تولید محتوا، اینستاگرام، تبلیغات اینترنتی و هوش مصنوعی. خدمت مناسب وضعیت‌تان را در جلسه مشاوره رایگان انتخاب کنید.",
  },
  blog: {
    title: "بلاگ | الوند مارکتینگ",
    description:
      "مقالات کاربردی درباره سئو، تبلیغات، طراحی سایت و بازاریابی دیجیتال.",
  },
  contact: {
    title: "تماس با ما | الوند مارکتینگ",
    description:
      "برای مشاوره رایگان با الوند مارکتینگ تماس بگیرید. واتساپ، تلفن و فرم آنلاین.",
  },
};

export async function getSeoPage(
  pageKey: string
): Promise<SeoPageRow | null> {
  const sb = createAnonClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("seo_pages")
    .select(
      "page_key, title, body_preview, meta_title, meta_description, focus_keyphrases, og_title, og_description, og_image_url, robots_index, robots_follow, canonical_url"
    )
    .eq("page_key", pageKey)
    .maybeSingle();
  if (error || !data) return null;
  return data as SeoPageRow;
}

export async function metadataForPageKey(
  pageKey: string,
  opts?: { path?: string }
): Promise<Metadata> {
  const row = await getSeoPage(pageKey);
  const fb = FALLBACKS[pageKey] || FALLBACKS.home;
  const title = row?.meta_title || row?.title || fb.title;
  const description = row?.meta_description || fb.description;
  // Public default: indexable. Per-page seo_pages.robots_* still override when false.
  const robotsIndex = row ? row.robots_index !== false : true;
  const robotsFollow = row ? row.robots_follow !== false : true;

  const meta: Metadata = {
    title,
    description,
    robots:
      robotsIndex && robotsFollow
        ? publicRobots
        : {
            index: robotsIndex,
            follow: robotsFollow,
            googleBot: { index: robotsIndex, follow: robotsFollow },
          },
  };

  const ogTitle = row?.og_title || title;
  const ogDesc = row?.og_description || description;
  meta.openGraph = {
    title: ogTitle,
    description: ogDesc,
    ...(row?.og_image_url ? { images: [{ url: row.og_image_url }] } : {}),
  };

  if (row?.canonical_url) {
    meta.alternates = { canonical: row.canonical_url };
  } else if (opts?.path) {
    meta.alternates = { canonical: opts.path };
  }

  return meta;
}
