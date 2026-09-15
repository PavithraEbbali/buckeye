"use client";

import { useEffect } from "react";

/* Minimal behaviour layer.

   This replaces the previous GSAP + Lenis + ScrollTrigger stack. What remains
   is the four things the page genuinely needs: a one-shot entrance reveal, the
   header condensing on scroll, the mobile menu toggle, and the back-to-top
   button. No smooth-scroll hijack, no custom cursor, no tilt, no marquee.

   Every effect is skipped under prefers-reduced-motion, and no content is
   gated behind JavaScript — [data-reveal] elements are visible by default and
   only animate once the observer marks them. */

export function SiteScripts() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* --- One-shot entrance reveal -------------------------------------
       A position sweep rather than an IntersectionObserver. Every nav link on
       this page is an in-page anchor, and jumping to one scrolls straight past
       whole sections — an observer never fires for an element that goes from
       "below the fold" to "above the fold" in a single scroll event, leaving
       those sections stuck at opacity 0 for good. Checking position on each
       frame reveals anything at or above the fold, skipped or not. */
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const revealAll = () => {
      pending.forEach((el) => el.classList.add("is-in"));
      pending = [];
    };

    const sweep = () => {
      if (!pending.length) return;
      const limit = window.innerHeight * 0.92;
      const still: HTMLElement[] = [];
      for (const el of pending) {
        // top < limit covers both "entering the fold" and "already scrolled past".
        if (el.getBoundingClientRect().top < limit) el.classList.add("is-in");
        else still.push(el);
      }
      pending = still;
    };

    if (reduced) revealAll();
    else sweep(); // synchronous first pass: rAF never fires in a hidden tab

    /* --- Header condense + back-to-top + reveal sweep ------------------ */
    const header = document.querySelector<HTMLElement>("[data-header]");
    const toTop = document.querySelector<HTMLElement>("[data-totop]");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        header?.classList.toggle("is-stuck", y > 12);
        toTop?.classList.toggle("is-on", y > 900);
        if (!reduced) sweep();
        ticking = false;
      });
    };
    onScroll();
    /* A tab that loads in the background paints nothing and fires no rAF, so
       re-run the pass when it first becomes visible. */
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        if (!reduced) sweep();
        onScroll();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    document.addEventListener("visibilitychange", onVisible);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
      document.removeEventListener("visibilitychange", onVisible);
    });

    /* Safety net: if anything is still hidden shortly after load — images
       settling, fonts shifting layout, a restored scroll position — reveal it
       rather than leave content invisible. */
    const failsafe = window.setTimeout(revealAll, 2500);
    cleanups.push(() => window.clearTimeout(failsafe));

    /* --- Mobile menu --------------------------------------------------- */
    const burger = document.querySelector<HTMLElement>("[data-burger]");
    const menu = document.querySelector<HTMLElement>("[data-menu]");
    if (burger && menu) {
      const close = () => {
        menu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      };
      const toggle = () => {
        const open = menu.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      };
      const onLink = (e: Event) => {
        if ((e.target as HTMLElement).closest("a")) close();
      };
      burger.addEventListener("click", toggle);
      menu.addEventListener("click", onLink);
      cleanups.push(() => {
        burger.removeEventListener("click", toggle);
        menu.removeEventListener("click", onLink);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
