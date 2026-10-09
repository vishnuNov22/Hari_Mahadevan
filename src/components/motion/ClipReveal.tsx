"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Geometric clip-path reveal on first view: the mask wipes open from the top
 * while the content inside settles from a slight zoom. Without JS (noscript
 * rule in the root layout) or with reduced motion, content is simply visible.
 */
export function ClipReveal({ children, className, radius = 0 }: { children: ReactNode; className?: string; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("clip-reveal relative", className)} style={{ "--clip-r": `${radius}px` } as CSSProperties}>
      <div className="clip-inner">
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}
