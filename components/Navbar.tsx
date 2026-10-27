"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  LayoutGrid,
  ListOrdered,
  FolderKanban,
  Wallet,
  Info,
  HelpCircle,
  Phone,
  Newspaper,
  ChevronDown,
  Monitor,
  PenLine,
  Sparkles,
  Instagram,
  Megaphone,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import AuthButton from "./AuthButton";
import { services } from "@/lib/services";

const serviceIcons: Record<string, React.ReactNode> = {
  "طراحی-سایت": <Monitor className="h-4 w-4 shrink-0" />,
  "تولید-محتوا": <PenLine className="h-4 w-4 shrink-0" />,
  سئو: <Search className="h-4 w-4 shrink-0" />,
  "هوش-مصنوعی": <Sparkles className="h-4 w-4 shrink-0" />,
  اینستاگرام: <Instagram className="h-4 w-4 shrink-0" />,
  "تبلیغات-اینترنتی": <Megaphone className="h-4 w-4 shrink-0" />,
};

const navItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/خدمات", label: "خدمات", icon: LayoutGrid, mega: true },
  { href: "/#process", label: "فرآیند", icon: ListOrdered },
  { href: "/#cases", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/#pricing", label: "هزینه", icon: Wallet },
  { href: "/#about", label: "درباره ما", icon: Info },
  { href: "/بلاگ", label: "بلاگ", icon: Newspaper },
  { href: "/#faq", label: "سؤالات", icon: HelpCircle },
  { href: "/تماس", label: "تماس", icon: Phone },
];

const searchInputClass =
  "w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted-foreground";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { mode, setMode, theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
  };

  const filtered = query.trim()
    ? services.filter(
        (s) =>
          s.title.includes(query.trim()) ||
          s.shortDesc.includes(query.trim())
      )
    : [];

  function goToService(slug: string) {
    setQuery("");
    setMegaOpen(false);
    closeMenu();
    router.push(`/خدمات/${slug}`);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (filtered.length === 1) {
      goToService(filtered[0].slug);
    } else if (query.trim()) {
      closeMenu();
      router.push(`/خدمات?q=${encodeURIComponent(query.trim())}`);
    }
  }

  const searchDropdown =
    query.trim() && filtered.length > 0 ? (
      <div className="absolute top-full mt-2 right-0 left-0 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50">
        {filtered.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => goToService(s.slug)}
            className="w-full text-right px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors border-b border-border last:border-0"
          >
            {s.title}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 right-0 left-0 z-40 w-full max-w-[100vw] min-w-0 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-background/90 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 md:px-6 lg:px-8 w-full min-w-0">
          {/* لوگو */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-border transition-colors duration-300 hover:bg-accent/10"
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-foreground my-1 transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
            <Link
              href="/"
              className="text-sm md:text-base font-bold transition-colors duration-500 truncate max-w-[120px] sm:max-w-[160px] lg:max-w-none"
              onClick={closeMenu}
            >
              الوند مارکتینگ
            </Link>
          </div>

          {/* منوی مرکزی — فقط دسکتاپ، بدون هم‌پوشانی */}
          <div className="hidden lg:flex items-center justify-center min-w-0">
            <ul className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 list-none min-w-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const linkCls =
                  "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap px-2 py-1.5 rounded-md hover:bg-accent/5";

                if (item.mega) {
                  return (
                    <li
                      key={item.href}
                      className="relative z-[70]"
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                    >
                      <Link href={item.href} className={linkCls}>
                        <Icon className="h-4 w-4 opacity-70 shrink-0" />
                        {item.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                            megaOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Link>
                      <AnimatePresence>
                        {megaOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 pt-2 z-[70]"
                          >
                            <div className="w-72 rounded-2xl border border-border bg-background shadow-2xl p-2 ring-1 ring-border/50">
                              <Link
                                href="/خدمات"
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-accent/10 transition-colors"
                                onClick={() => setMegaOpen(false)}
                              >
                                <LayoutGrid className="h-4 w-4 text-accent" />
                                همه خدمات
                              </Link>
                              <div className="h-px bg-border my-1" />
                              {services.map((s) => (
                                <Link
                                  key={s.slug}
                                  href={`/خدمات/${s.slug}`}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                                >
                                  <span className="text-accent">
                                    {serviceIcons[s.slug] ?? (
                                      <LayoutGrid className="h-4 w-4" />
                                    )}
                                  </span>
                                  {s.title}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={linkCls}>
                      <Icon className="h-4 w-4 opacity-70 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* چپ: جستجو + تم + CTA */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <form
              onSubmit={onSearchSubmit}
              className="hidden lg:block relative w-[120px] xl:w-[140px] shrink-0"
            >
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className={searchInputClass + " py-1.5 text-xs"}
              />
              {searchDropdown}
            </form>

            <div
              className={`inline-flex items-center gap-0.5 rounded-full border border-border p-0.5 transition-colors duration-500 shrink-0 ${
                theme === "light" ? "bg-black/5" : "bg-white/5"
              }`}
            >
              <button
                onClick={() => setMode("morning")}
                className={`relative rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-colors duration-300 ${
                  mode === "morning"
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "morning" && (
                  <motion.div
                    layoutId="nav-toggle-bg"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">صبح</span>
              </button>
              <button
                onClick={() => setMode("night")}
                className={`relative rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-colors duration-300 ${
                  mode === "night"
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "night" && (
                  <motion.div
                    layoutId="nav-toggle-bg"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">شب</span>
              </button>
            </div>

            <Link
              href="/تماس"
              className="hidden xl:inline-flex text-sm font-bold text-muted-foreground hover:text-foreground transition-colors duration-200 items-center gap-1 shrink-0"
            >
              مشاوره رایگان
              <span className="text-xs">←</span>
            </Link>
            <div className="hidden lg:block shrink-0">
              <AuthButton />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* دراور موبایل */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-[min(100%,320px)] max-w-[100vw] bg-background border-l border-border shadow-2xl lg:hidden flex flex-col pt-20 pb-8 px-6 overflow-y-auto overscroll-contain"
            >
              <form onSubmit={onSearchSubmit} className="mb-6 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در خدمات..."
                  className={searchInputClass}
                />
                {searchDropdown}
              </form>

              <nav className="flex flex-col gap-0.5">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  if (item.mega) {
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i, duration: 0.25 }}
                      >
                        <div className="flex items-center">
                          <Link
                            href="/خدمات"
                            onClick={closeMenu}
                            className="flex-1 flex items-center gap-3 text-lg font-medium py-3 px-3 rounded-xl text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                          >
                            <Icon className="h-5 w-5 opacity-70" />
                            خدمات
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileServicesOpen(!mobileServicesOpen)
                            }
                            className="p-3 rounded-xl hover:bg-accent/10"
                            aria-label="زیرمنوی خدمات"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                mobileServicesOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pr-4 pb-2 list-none"
                            >
                              {services.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    href={`/خدمات/${s.slug}`}
                                    onClick={closeMenu}
                                    className="flex items-center gap-2 py-2 px-3 text-sm text-muted-foreground hover:text-accent transition-colors"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                    {s.title}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-lg font-medium py-3 px-3 rounded-xl text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        <Icon className="h-5 w-5 opacity-70" />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-border space-y-3">
                <AuthButton compact onNavigate={closeMenu} />
                <Link
                  href="/تماس"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-accent text-accent-foreground font-bold text-sm"
                >
                  مشاوره رایگان
                  <span>←</span>
                </Link>
                <div className="flex items-center justify-center gap-4 mt-5 text-sm text-muted-foreground">
                  <a
                    href="https://t.me/alvandmarketing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    تلگرام
                  </a>
                  <span>·</span>
                  <a
                    href="https://wa.me/989921863063"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    واتساپ
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
