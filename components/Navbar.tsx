"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { mediaUrl } from "@/lib/media";
import { isNavItemActive } from "@/lib/nav-active";
import { useHomeSectionHash } from "@/lib/use-home-section-hash";
import { useTheme } from "./ThemeProvider";

const logoSrc = mediaUrl("ALVAND-bg.webp");
import AuthButton from "./AuthButton";
import { services, serviceHref } from "@/lib/services";
import { getServiceIcon } from "@/lib/category-icons";
import {
  getMegaMenuColumns,
  isServicePathActive,
} from "@/lib/mega-menu";

const desktopLinkBase =
  "inline-flex items-center gap-1.5 text-sm transition-colors duration-200 whitespace-nowrap px-2 py-1.5 rounded-md";
const desktopLinkIdle =
  "text-muted-foreground hover:text-foreground hover:bg-accent/5";
const desktopLinkActive =
  "text-accent font-bold bg-accent/10 hover:text-accent hover:bg-accent/15";

const mobileLinkBase =
  "flex items-center gap-3 text-lg font-medium py-3 px-3 rounded-xl transition-colors border-r-2";
const mobileLinkIdle =
  "text-foreground border-transparent hover:bg-accent/10 hover:text-accent";
const mobileLinkActive =
  "text-accent bg-accent/10 border-accent font-bold";

const navItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/services", label: "خدمات", icon: LayoutGrid, mega: true },
  { href: "/#process", label: "فرآیند", icon: ListOrdered },
  { href: "/#cases", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/#pricing", label: "برآورد", icon: Wallet },
  { href: "/#about", label: "درباره ما", icon: Info },
  { href: "/#faq", label: "سؤالات", icon: HelpCircle },
  { href: "/blog", label: "بلاگ", icon: Newspaper },
  { href: "/contact", label: "تماس", icon: Phone },
];

const searchInputClass =
  "w-full rounded-xl border border-border bg-background pr-10 pl-3 py-2.5 text-base outline-none focus:border-accent transition-colors placeholder:text-muted-foreground";

type BlogSearchItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaMoreBelow, setMegaMoreBelow] = useState(false);
  const [mobileMoreBelow, setMobileMoreBelow] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileExpandedSlug, setMobileExpandedSlug] = useState<string | null>(
    null
  );
  const megaScrollRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const megaColumns = getMegaMenuColumns();

  const syncScrollAffordance = useCallback(
    (
      el: HTMLElement | null,
      setMore: (v: boolean) => void
    ) => {
      if (!el) {
        setMore(false);
        return;
      }
      setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
    },
    []
  );
  const [blogPosts, setBlogPosts] = useState<BlogSearchItem[]>([]);
  const { mode, setMode, theme } = useTheme();
  const router = useRouter();
  const rawPathname = usePathname() || "/";
  let pathname = rawPathname;
  try {
    pathname = decodeURIComponent(rawPathname);
  } catch {
    pathname = rawPathname;
  }
  const { hash, activateSection, activateHome } = useHomeSectionHash(pathname);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setMobileExpandedSlug(null);
  };

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  useEffect(() => {
    if (!megaOpen) {
      setMegaMoreBelow(false);
      return;
    }
    const el = megaScrollRef.current;
    if (!el) return;
    const update = () => syncScrollAffordance(el, setMegaMoreBelow);
    update();
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [megaOpen, syncScrollAffordance]);

  useEffect(() => {
    if (!menuOpen) {
      setMobileMoreBelow(false);
      return;
    }
    const el = mobileDrawerRef.current;
    if (!el) return;
    const update = () => syncScrollAffordance(el, setMobileMoreBelow);
    update();
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [menuOpen, mobileServicesOpen, mobileExpandedSlug, syncScrollAffordance]);

  const onNavItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.includes("#")) {
      const sectionId = href.split("#")[1];
      if (sectionId) {
        e.preventDefault();
        activateSection(sectionId);
      }
    } else if (href === "/") {
      e.preventDefault();
      activateHome();
    }
    closeMenu();
  };

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

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog")
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && Array.isArray(json.posts)) {
          setBlogPosts(json.posts);
        }
      })
      .catch(() => {
        /* ignore — search still works for services */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  type SearchHit = {
    kind: "service" | "blog";
    title: string;
    href: string;
    hint?: string;
  };

  const searchHits: SearchHit[] = (() => {
    const q = query.trim();
    if (!q) return [];
    const svc = services
      .filter((s) => s.title.includes(q) || s.shortDesc.includes(q))
      .map((s) => ({
        kind: "service" as const,
        title: s.title,
        href: serviceHref(s.slug),
        hint: "خدمت",
      }));
    const blg = blogPosts
      .filter(
        (p) =>
          p.title.includes(q) ||
          p.excerpt.includes(q) ||
          p.category.includes(q)
      )
      .map((p) => ({
        kind: "blog" as const,
        title: p.title,
        href: `/blog/${p.slug}`,
        hint: "بلاگ",
      }));
    return [...svc, ...blg].slice(0, 8);
  })();

  function goHit(href: string) {
    setQuery("");
    setMegaOpen(false);
    closeMenu();
    router.push(href);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchHits.length === 1) {
      goHit(searchHits[0].href);
    } else if (query.trim()) {
      closeMenu();
      const onlyBlog = searchHits.length > 0 && searchHits.every((h) => h.kind === "blog");
      if (onlyBlog) {
        router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push(`/services?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  const searchDropdown =
    query.trim() && searchHits.length > 0 ? (
      <div className="absolute top-full mt-2 right-0 left-0 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50">
        {searchHits.map((h) => (
          <button
            key={h.href}
            type="button"
            onClick={() => goHit(h.href)}
            className="w-full text-right px-4 py-2.5 text-sm hover:bg-accent/10 transition-colors border-b border-border last:border-0"
          >
            <span className="text-muted-foreground text-xs ml-2">{h.hint}</span>
            {h.title}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <nav
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
              className="xl:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-border transition-colors duration-300 hover:bg-accent/10"
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
              onClick={closeMenu}
              className="hidden xl:block shrink-0"
              aria-label="الوند مارکتینگ"
            >
              <img
                src={logoSrc}
                alt="الوند مارکتینگ"
                className="h-9 w-auto object-contain rounded-md"
              />
            </Link>
          </div>

          {/* منوی مرکزی — فقط دسکتاپ، بدون هم‌پوشانی */}
          <div className="hidden xl:flex items-center justify-center min-w-0">
            <ul className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 list-none min-w-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(item.href, pathname, hash);
                const linkCls = `${desktopLinkBase} ${
                  active ? desktopLinkActive : desktopLinkIdle
                }`;

                if (item.mega) {
                  return (
                    <li
                      key={item.href}
                      className="relative z-[70]"
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                      onFocusCapture={() => setMegaOpen(true)}
                      onBlurCapture={(e) => {
                        if (
                          !e.currentTarget.contains(
                            e.relatedTarget as Node | null
                          )
                        ) {
                          setMegaOpen(false);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={linkCls}
                        aria-current={active ? "page" : undefined}
                        aria-expanded={megaOpen}
                        aria-haspopup="true"
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            active ? "opacity-100" : "opacity-70"
                          }`}
                        />
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
                            initial={{ opacity: 0, y: 8, x: "-50%" }}
                            animate={{ opacity: 1, y: 0, x: "-50%" }}
                            exit={{ opacity: 0, y: 8, x: "-50%" }}
                            transition={{ duration: 0.15 }}
                            className="fixed left-1/2 top-[3.75rem] z-[70] w-[min(72rem,calc(100vw-2rem))] pt-2"
                            role="menu"
                            aria-label="منوی خدمات"
                          >
                            <div className="w-full max-h-[calc(100vh-5.5rem)] flex flex-col rounded-2xl border border-border bg-background shadow-2xl ring-1 ring-border/50 overflow-hidden">
                              <div className="relative min-h-0 flex-1 flex flex-col">
                              <div
                                ref={megaScrollRef}
                                className="min-h-0 flex-1 overflow-y-auto overscroll-contain grid grid-cols-3 2xl:grid-cols-4 gap-0.5 p-2.5"
                              >
                                {megaColumns.map(({ parent, featuredChildren }) => {
                                  const SIcon = getServiceIcon(parent.slug);
                                  const href = serviceHref(parent.slug);
                                  const svcActive = isServicePathActive(
                                    pathname,
                                    href,
                                    { includeDescendants: true }
                                  );
                                  return (
                                    <div
                                      key={parent.slug}
                                      className="min-w-0 rounded-lg p-1.5 hover:bg-accent/5 transition-colors"
                                    >
                                      <Link
                                        href={href}
                                        role="menuitem"
                                        onClick={() => setMegaOpen(false)}
                                        aria-current={
                                          svcActive ? "page" : undefined
                                        }
                                        className={`flex items-center gap-1.5 px-1.5 py-1 rounded-md text-base font-bold transition-colors ${
                                          svcActive
                                            ? "text-accent bg-accent/10"
                                            : "text-foreground hover:text-accent"
                                        }`}
                                      >
                                        <span className="text-accent">
                                          <SIcon className="h-4 w-4 shrink-0" />
                                        </span>
                                        <span className="truncate">
                                          {parent.title}
                                        </span>
                                      </Link>
                                      {featuredChildren.length > 0 && (
                                        <ul className="mt-1 space-y-0.5 list-none pr-0.5">
                                          {featuredChildren.map((child) => {
                                            const childHref = serviceHref(
                                              child.slug
                                            );
                                            const childActive =
                                              isServicePathActive(
                                                pathname,
                                                childHref
                                              );
                                            return (
                                              <li key={child.slug}>
                                                <Link
                                                  href={childHref}
                                                  role="menuitem"
                                                  onClick={() =>
                                                    setMegaOpen(false)
                                                  }
                                                  aria-current={
                                                    childActive
                                                      ? "page"
                                                      : undefined
                                                  }
                                                  className={`block px-1.5 py-1 rounded-md text-sm leading-relaxed transition-colors ${
                                                    childActive
                                                      ? "text-accent font-bold bg-accent/10"
                                                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                                                  }`}
                                                >
                                                  {child.title}
                                                </Link>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                      <Link
                                        href={href}
                                        role="menuitem"
                                        onClick={() => setMegaOpen(false)}
                                        className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-1 text-sm font-bold text-accent hover:opacity-80 transition-opacity"
                                      >
                                        مشاهده همه
                                        <span className="text-xs">←</span>
                                      </Link>
                                    </div>
                                  );
                                })}
                              </div>
                              <div
                                className={`pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-200 ${
                                  megaMoreBelow
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                                aria-hidden={!megaMoreBelow}
                              >
                                <div className="h-10 bg-gradient-to-t from-background via-background/80 to-transparent" />
                                <div className="flex flex-col items-center gap-0.5 bg-background/95 px-3 pb-2 pt-0.5 backdrop-blur-[2px]">
                                  <ChevronDown className="h-4 w-4 text-accent animate-bounce" />
                                  <p className="text-xs text-muted-foreground leading-persian">
                                    برای دیدن همه خدمات اسکرول کنید
                                  </p>
                                </div>
                              </div>
                              </div>
                              <div className="shrink-0 border-t border-border bg-muted/40 px-4 py-2.5">
                                <Link
                                  href="/services"
                                  onClick={() => setMegaOpen(false)}
                                  aria-current={
                                    pathname === "/services"
                                      ? "page"
                                      : undefined
                                  }
                                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90 transition-opacity"
                                >
                                  <LayoutGrid className="h-4 w-4" />
                                  مشاهده همه خدمات
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={linkCls}
                      aria-current={active ? "page" : undefined}
                      onClick={(e) => onNavItemClick(e, item.href)}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          active ? "opacity-100" : "opacity-70"
                        }`}
                      />
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
              className="hidden xl:block relative w-[120px] xl:w-[140px] shrink-0"
            >
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className={searchInputClass + " py-1.5"}
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
                className={`relative rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium ${
                  mode === "morning"
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "morning" && (
                  <span className="absolute inset-0 rounded-full bg-accent" aria-hidden />
                )}
                <span className="relative z-10">صبح</span>
              </button>
              <button
                onClick={() => setMode("night")}
                className={`relative rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium ${
                  mode === "night"
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "night" && (
                  <span className="absolute inset-0 rounded-full bg-accent" aria-hidden />
                )}
                <span className="relative z-10">شب</span>
              </button>
            </div>

            <div className="hidden xl:block shrink-0">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* دراور موبایل */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm xl:hidden"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-[min(100%,320px)] max-w-[100vw] bg-background border-l border-border shadow-2xl xl:hidden flex flex-col overflow-hidden"
            >
              <div
                ref={mobileDrawerRef}
                className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain pt-4 pb-8 px-5"
              >
              <div className="flex justify-start mb-5">
                <Link href="/" onClick={closeMenu} aria-label="الوند مارکتینگ">
                  <img
                    src={logoSrc}
                    alt="الوند مارکتینگ"
                    className="h-9 w-auto object-contain rounded-md"
                  />
                </Link>
              </div>
              <form onSubmit={onSearchSubmit} className="mb-6 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در خدمات و بلاگ..."
                  className={searchInputClass}
                />
                {searchDropdown}
              </form>

              <nav className="flex flex-col gap-0.5">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  const active = isNavItemActive(item.href, pathname, hash);
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
                            href="/services"
                            onClick={closeMenu}
                            aria-current={active ? "page" : undefined}
                            className={`flex-1 ${mobileLinkBase} ${
                              active ? mobileLinkActive : mobileLinkIdle
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${
                                active ? "opacity-100" : "opacity-70"
                              }`}
                            />
                            خدمات
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setMobileServicesOpen(!mobileServicesOpen)
                            }
                            className="p-3 rounded-xl hover:bg-accent/10"
                            aria-label="زیرمنوی خدمات"
                            aria-expanded={mobileServicesOpen}
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
                              className="overflow-hidden pr-2 pb-2 list-none"
                            >
                              {megaColumns.map(
                                ({ parent, featuredChildren }) => {
                                  const SIcon = getServiceIcon(parent.slug);
                                  const href = serviceHref(parent.slug);
                                  const svcActive = isServicePathActive(
                                    pathname,
                                    href,
                                    { includeDescendants: true }
                                  );
                                  const expanded =
                                    mobileExpandedSlug === parent.slug;
                                  return (
                                    <li
                                      key={parent.slug}
                                      className="border-b border-border/60 last:border-0"
                                    >
                                      <div className="flex items-center gap-1">
                                        <Link
                                          href={href}
                                          onClick={closeMenu}
                                          aria-current={
                                            svcActive ? "page" : undefined
                                          }
                                          className={`flex-1 flex items-center gap-2 py-2.5 px-3 text-base transition-colors rounded-lg ${
                                            svcActive
                                              ? "text-accent font-bold bg-accent/10"
                                              : "text-muted-foreground hover:text-accent"
                                          }`}
                                        >
                                          <SIcon className="h-4 w-4 text-accent shrink-0" />
                                          <span className="truncate">
                                            {parent.title}
                                          </span>
                                        </Link>
                                        <button
                                          type="button"
                                          className="p-2.5 rounded-lg hover:bg-accent/10"
                                          aria-label={`جزئیات منوی ${parent.title}`}
                                          aria-expanded={expanded}
                                          onClick={() =>
                                            setMobileExpandedSlug(
                                              expanded ? null : parent.slug
                                            )
                                          }
                                        >
                                          <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                              expanded ? "rotate-180" : ""
                                            }`}
                                          />
                                        </button>
                                      </div>
                                      <AnimatePresence>
                                        {expanded && (
                                          <motion.ul
                                            initial={{
                                              height: 0,
                                              opacity: 0,
                                            }}
                                            animate={{
                                              height: "auto",
                                              opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pr-6 pb-2 list-none"
                                          >
                                            {featuredChildren.map((child) => {
                                              const childHref = serviceHref(
                                                child.slug
                                              );
                                              const childActive =
                                                isServicePathActive(
                                                  pathname,
                                                  childHref
                                                );
                                              return (
                                                <li key={child.slug}>
                                                  <Link
                                                    href={childHref}
                                                    onClick={closeMenu}
                                                    aria-current={
                                                      childActive
                                                        ? "page"
                                                        : undefined
                                                    }
                                                    className={`block py-2 px-3 text-sm transition-colors rounded-md ${
                                                      childActive
                                                        ? "text-accent font-bold bg-accent/10"
                                                        : "text-muted-foreground hover:text-accent"
                                                    }`}
                                                  >
                                                    {child.title}
                                                  </Link>
                                                </li>
                                              );
                                            })}
                                            <li>
                                              <Link
                                                href={href}
                                                onClick={closeMenu}
                                                className="inline-flex items-center gap-1 py-2 px-3 text-sm font-bold text-accent"
                                              >
                                                مشاهده همه
                                                <span className="text-xs">
                                                  ←
                                                </span>
                                              </Link>
                                            </li>
                                          </motion.ul>
                                        )}
                                      </AnimatePresence>
                                    </li>
                                  );
                                }
                              )}
                              <li className="pt-3 px-3 pb-1">
                                <Link
                                  href="/services"
                                  onClick={closeMenu}
                                  aria-current={
                                    pathname === "/services"
                                      ? "page"
                                      : undefined
                                  }
                                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-accent-foreground"
                                >
                                  <LayoutGrid className="h-4 w-4" />
                                  مشاهده همه خدمات
                                </Link>
                              </li>
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
                        onClick={(e) => onNavItemClick(e, item.href)}
                        aria-current={active ? "page" : undefined}
                        className={`${mobileLinkBase} ${
                          active ? mobileLinkActive : mobileLinkIdle
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            active ? "opacity-100" : "opacity-70"
                          }`}
                        />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-border space-y-3">
                <AuthButton compact onNavigate={closeMenu} />
                <Link
                  href="/contact"
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
              </div>
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 transition-opacity duration-200 ${
                  mobileMoreBelow ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!mobileMoreBelow}
              >
                <div className="h-10 bg-gradient-to-t from-background via-background/85 to-transparent" />
                <div className="flex flex-col items-center gap-0.5 bg-background/95 px-3 pb-3 pt-0.5 backdrop-blur-[2px]">
                  <ChevronDown className="h-4 w-4 text-accent animate-bounce" />
                  <p className="text-xs text-muted-foreground leading-persian">
                    برای دیدن همه خدمات اسکرول کنید
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
