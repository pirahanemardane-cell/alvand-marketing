"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ServiceChildCard = {
  slug: string;
  title: string;
  shortDesc: string;
  href: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

type Props = {
  parentTitle: string;
  items: ServiceChildCard[];
};

export default function ServiceChildrenCarousel({
  parentTitle,
  items,
}: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const labelId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    // RTL scrollLeft may be 0…max, 0…-max, or max…0 depending on engine.
    const atStart = Math.abs(left) < 4;
    const atEnd = Math.abs(Math.abs(left) - maxScroll) < 4 || maxScroll < 4;
    const scrollingNegative = left < 0;
    if (maxScroll < 4) {
      setCanPrev(false);
      setCanNext(false);
    } else if (scrollingNegative) {
      setCanPrev(!atStart);
      setCanNext(Math.abs(left) < maxScroll - 4);
    } else {
      // Chromium RTL often keeps scrollLeft positive from the “start” side.
      setCanPrev(!atStart);
      setCanNext(left < maxScroll - 4);
    }

    const cards = Array.from(
      el.querySelectorAll<HTMLElement>("[data-carousel-card]")
    );
    if (cards.length === 0) return;
    const trackRect = el.getBoundingClientRect();
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - (trackRect.left + trackRect.width / 2));
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  }, [items.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollToIndex = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-carousel-card]")[
      index
    ];
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  };

  const goPrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const goNext = () =>
    scrollToIndex(Math.min(items.length - 1, activeIndex + 1));

  if (items.length === 0) return null;

  return (
    <section
      className="mb-14 w-full"
      aria-labelledby={labelId}
      aria-roledescription="carousel"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2
            id={labelId}
            className="text-xl font-bold leading-persian-tight"
          >
            خدمات {parentTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground leading-persian">
            {`همه ${items.length} خدمت این دسته — برای جزئیات روی کارت بزنید`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext && activeIndex >= items.length - 1}
            aria-label="اسلاید بعدی"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goPrev}
            disabled={!canPrev && activeIndex <= 0}
            aria-label="اسلاید قبلی"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        dir="rtl"
        aria-label={`کاروسل خدمات ${parentTitle}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goNext();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goPrev();
          } else if (e.key === "Home") {
            e.preventDefault();
            scrollToIndex(0);
          } else if (e.key === "End") {
            e.preventDefault();
            scrollToIndex(items.length - 1);
          }
        }}
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-3 -mx-1 px-1 outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-xl [scrollbar-width:thin]"
      >
        {items.map((item, index) => (
          <li
            key={item.slug}
            data-carousel-card
            className="snap-start shrink-0 w-[min(85vw,19.5rem)]"
            aria-roledescription="slide"
            aria-label={`${index + 1} از ${items.length}`}
          >
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/40">
              {item.image ? (
                <div className="relative aspect-[16/10] w-full bg-muted">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    title={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(max-width: 640px) 85vw, 312px"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="text-base font-bold leading-persian-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-persian line-clamp-3 flex-1">
                  {item.shortDesc}
                </p>
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  مشاهده جزئیات
                  <span aria-hidden>←</span>
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div
        className="mt-3 flex justify-center gap-1.5"
        role="tablist"
        aria-label="موقعیت اسلاید"
      >
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`رفتن به اسلاید ${index + 1}`}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex
                ? "w-5 bg-accent"
                : "w-2 bg-border hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
