import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Cable,
  Gauge,
  Headphones,
  Instagram,
  Linkedin,
  Mail,
  Megaphone,
  MessageCircle,
  Monitor,
  Palette,
  PenLine,
  Search,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";

/**
 * Shared Lucide map for service + blog categories.
 * Keep in sync with Navbar mega-menu visual language.
 */
export const serviceIcons: Record<string, LucideIcon> = {
  "طراحی-سایت": Monitor,
  "طراحی-سایت/وردپرس": Monitor,
  "طراحی-سایت/کدنویسی": Monitor,
  "تولید-محتوا": PenLine,
  سئو: Search,
  "هوش-مصنوعی": Sparkles,
  "شبکه-های-اجتماعی": Share2,
  "شبکه-های-اجتماعی/اینستاگرام": Instagram,
  "شبکه-های-اجتماعی/لینکدین": Linkedin,
  // legacy ZWNJ keys (redirect sources) — keep icon lookup working
  "شبکه‌های-اجتماعی": Share2,
  "شبکه‌های-اجتماعی/اینستاگرام": Instagram,
  "شبکه‌های-اجتماعی/لینکدین": Linkedin,
  "تبلیغات-اینترنتی": Megaphone,
  "تبلیغات-اینترنتی/گوگل-ادز": Megaphone,
  "تبلیغات-اینترنتی/شبکه-های-اجتماعی": Megaphone,
  "تبلیغات-اینترنتی/کلیکی": Megaphone,
  "پشتیبانی-سایت": Headphones,
  "پشتیبانی-سایت/امنیت": Shield,
  "پشتیبانی-سایت/افزایش-سرعت": Gauge,
  "پشتیبانی-سایت/رفع-ارور": Wrench,
  "اپلیکیشن-و-وب-اپ": Smartphone,
  آنالیتیکس: BarChart3,
  "ای-پی-آی-و-یکپارچه-سازی": Cable,
  "ای‌پی‌آی-و-یکپارچه‌سازی": Cable,
  "ایمیل-مارکتینگ": Mail,
  "مشاوره-دیجیتال-مارکتینگ": MessageCircle,
  برندینگ: Palette,
  "هوش-مصنوعی/چت-بات": MessageCircle,
  "هوش-مصنوعی/اتوماسیون-بازاریابی": Sparkles,
  "تولید-محتوا/اینستاگرام": Instagram,
  "تولید-محتوا/هوش-مصنوعی": Sparkles,
  "سئو/تکنیکال": Search,
  "سئو/داخلی": Search,
  "سئو/خارجی": Search,
  "سئو/محلی": Search,
};

const blogCategoryIcons: Record<string, LucideIcon> = {
  بلاگ: BookOpen,
  "طراحی سایت": Monitor,
  "تولید محتوا": PenLine,
  سئو: Search,
  "هوش مصنوعی": Sparkles,
  اینستاگرام: Instagram,
  لینکدین: Linkedin,
  "شبکه‌های اجتماعی": Share2,
  "تبلیغات اینترنتی": Megaphone,
  بازاریابی: Sparkles,
  عمومی: BookOpen,
  "اپلیکیشن، وب‌اپ و API": Smartphone,
  "محتوا، شبکه‌های اجتماعی و هوش مصنوعی": PenLine,
  "دیجیتال مارکتینگ و برندینگ": Sparkles,
  "پشتیبانی، امنیت و سرعت سایت": Headphones,
  "آنالیتیکس و ابزارهای گوگل": BarChart3,
};

export function getServiceIcon(slug: string): LucideIcon {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();
  if (serviceIcons[slug]) return serviceIcons[slug];
  if (serviceIcons[decoded]) return serviceIcons[decoded];
  // Walk nested prefixes: طراحی-سایت/پزشکی → طراحی-سایت
  const parts = decoded.split("/");
  for (let i = parts.length - 1; i >= 1; i--) {
    const prefix = parts.slice(0, i).join("/");
    if (serviceIcons[prefix]) return serviceIcons[prefix];
  }
  return Monitor;
}

export function getBlogCategoryIcon(name: string): LucideIcon {
  const key = (name || "").trim();
  if (blogCategoryIcons[key]) return blogCategoryIcons[key];
  const lower = key.toLowerCase();
  for (const [k, icon] of Object.entries(blogCategoryIcons)) {
    if (k.toLowerCase() === lower) return icon;
  }
  for (const [slug, icon] of Object.entries(serviceIcons)) {
    const titleHint = slug.replace(/-/g, " ");
    if (key.includes(titleHint) || titleHint.includes(key)) return icon;
  }
  return BookOpen;
}
