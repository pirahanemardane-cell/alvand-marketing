import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Instagram,
  Megaphone,
  Monitor,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";

/**
 * Shared Lucide map for service + blog categories.
 * Keep in sync with Navbar mega-menu visual language.
 */
export const serviceIcons: Record<string, LucideIcon> = {
  "طراحی-سایت": Monitor,
  "تولید-محتوا": PenLine,
  سئو: Search,
  "هوش-مصنوعی": Sparkles,
  اینستاگرام: Instagram,
  "تبلیغات-اینترنتی": Megaphone,
};

const blogCategoryIcons: Record<string, LucideIcon> = {
  بلاگ: BookOpen,
  "طراحی سایت": Monitor,
  "تولید محتوا": PenLine,
  سئو: Search,
  "هوش مصنوعی": Sparkles,
  اینستاگرام: Instagram,
  "تبلیغات اینترنتی": Megaphone,
  بازاریابی: Sparkles,
  عمومی: BookOpen,
};

export function getServiceIcon(slug: string): LucideIcon {
  const decoded = decodeURIComponent(slug);
  return serviceIcons[slug] || serviceIcons[decoded] || Monitor;
}

export function getBlogCategoryIcon(name: string): LucideIcon {
  const key = (name || "").trim();
  if (blogCategoryIcons[key]) return blogCategoryIcons[key];
  const lower = key.toLowerCase();
  for (const [k, icon] of Object.entries(blogCategoryIcons)) {
    if (k.toLowerCase() === lower) return icon;
  }
  // Fallback: match a service title contained in the category name
  for (const [slug, icon] of Object.entries(serviceIcons)) {
    const titleHint = slug.replace(/-/g, " ");
    if (key.includes(titleHint) || titleHint.includes(key)) return icon;
  }
  return BookOpen;
}
