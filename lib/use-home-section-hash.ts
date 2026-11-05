"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HOME_SECTION_IDS } from "@/lib/nav-active";

const NAV_OFFSET_PX = 96;
const CLICK_LOCK_MS = 900;

function readLocationHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash || "";
}

/**
 * Keeps homepage section active state in sync with URL hash + scroll position.
 * Next.js soft navigations to `/#…` often skip `hashchange`; clicks + scroll-spy cover that.
 */
export function useHomeSectionHash(pathname: string) {
  const [hash, setHash] = useState("");
  const clickLockUntil = useRef(0);
  const hashRef = useRef(hash);
  hashRef.current = hash;

  const syncFromLocation = useCallback(() => {
    setHash(readLocationHash());
  }, []);

  useEffect(() => {
    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [pathname, syncFromLocation]);

  const writeHash = useCallback((next: string) => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname || "/";
    const desired = next
      ? `${path}${next.startsWith("#") ? next : `#${next}`}`
      : path;
    const current = `${path}${window.location.hash || ""}`;
    if (desired !== current) {
      window.history.replaceState(window.history.state, "", desired);
    }
    setHash(next ? (next.startsWith("#") ? next : `#${next}`) : "");
  }, []);

  /** Activate a home section from a nav click (updates URL + smooth scroll). */
  const activateSection = useCallback(
    (sectionId: string) => {
      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
      const next = `#${sectionId}`;
      setHash(next);

      if (pathname === "/") {
        writeHash(next);
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      // From another route: full navigation so the home sections exist.
      window.location.assign(`/#${sectionId}`);
    },
    [pathname, writeHash]
  );

  /** Clear section hash and return to top (خانه). */
  const activateHome = useCallback(() => {
    clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
    writeHash("");
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.assign("/");
  }, [pathname, writeHash]);

  // Scroll-spy on homepage — also clears hash near the top (خانه active).
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let ticking = false;

    const measure = () => {
      ticking = false;
      if (Date.now() < clickLockUntil.current) return;

      // Near the top of the page → خانه (no section hash).
      if (window.scrollY < NAV_OFFSET_PX) {
        if (hashRef.current) writeHash("");
        return;
      }

      let current = "";
      for (const id of HOME_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - NAV_OFFSET_PX <= 0) {
          current = id;
        }
      }

      if (current) {
        const next = `#${current}`;
        if (next !== hashRef.current) writeHash(next);
        return;
      }

      // Scrolled past hero but not into a tracked section yet — no item active.
      // Sentinel stays in React state only (not written to the URL).
      if (window.location.hash) {
        window.history.replaceState(
          window.history.state,
          "",
          window.location.pathname || "/"
        );
      }
      if (hashRef.current !== "#__rest") setHash("#__rest");
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname, writeHash]);

  return { hash, activateSection, activateHome, syncFromLocation };
}
