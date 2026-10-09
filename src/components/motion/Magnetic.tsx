"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Subtle pointer attraction for primary buttons — desktop (fine pointer) only.
 * The hit area and focus behaviour of the wrapped control are unchanged.
 */
export function Magnetic({ children, strength = 0.25, max = 8 }: { children: ReactNode; strength?: number; max?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      const dy = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      el.style.setProperty("--mx", `${dx.toFixed(1)}px`);
      el.style.setProperty("--my", `${dy.toFixed(1)}px`);
    };
    const leave = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength, max]);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}
