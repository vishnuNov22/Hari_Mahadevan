"use client";

import { useEffect } from "react";

/**
 * Writes the section's own scroll offset (px) and progress (0..1) to CSS
 * variables --sy / --sp / --vp on the element with `targetId`, rAF-throttled and only
 * while the element is on screen. Pure CSS then drives typography parallax.
 * Disabled for reduced motion.
 */
export function ScrollVars({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let onScreen = true;
    const write = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const sy = Math.max(0, -r.top);
      el.style.setProperty("--sy", sy.toFixed(1));
      el.style.setProperty("--sp", Math.min(1, sy / Math.max(1, r.height)).toFixed(4));
      // --vp: 0 when the section's top enters the viewport bottom, 1 when its bottom leaves the top
      const vh = window.innerHeight;
      el.style.setProperty("--vp", Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))).toFixed(4));
    };
    const onScroll = () => {
      if (onScreen && !frame) frame = requestAnimationFrame(write);
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = Boolean(e?.isIntersecting);
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    write();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [targetId]);
  return null;
}
