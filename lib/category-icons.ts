import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Cable,
  Headphones,
  Instagram,
  Mail,
  Megaphone,
  MessageCircle,
  Monitor,
  Palette,
  PenLine,
  Search,
  Share2,
  Smartphone,
  Sparkles,
} from "lucide-react";

/**
 * Shared Lucide map for service + blog categories.
 * Keep in sync with Navbar mega-menu visual language.
 */
export const serviceIcons: Record<string, LucideIcon> = {
  "طراحی-سایت": Monitor,
  "طراحی-سایت/وردپرس": Monitor,
  "تولید-محتوا": PenLine,
  سئو: Search,
  "هوش-مصنوعی": Sparkles,
  "شبکه‌های-اجتماعی": Share2,
  اینستاگرام: Instagram,
  "تبلیغات-اینترنتی": Megaphone,
  "پشتیبانی-سایت": Headphones,
  "اپلیکیشن-و-وب-اپ": Smartphone,
  آنالیتیکس: BarChart3,
  "ای‌پی‌آی-و-یکپارچه‌سازی": Cable,
  "ایمیل-مارکتینگ": Mail,
  "مشاوره-دیجیتال-مارکتینگ": MessageCircle,
  برندینگ: Palette,
};

const blogCategoryIcons: Record<string, LucideIcon> = {
  بلاگ: BookOpen,
  "طراحی سایت": Monitor,
  "تولید محتوا": PenLine,
  سئو: Search,
  "هوش مصنوعی": Sparkles,
  اینستاگرام: Instagram,
  "شبکه‌های اجتماعی": Share2,
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
