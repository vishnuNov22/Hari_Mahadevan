"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** seconds, kept for API compatibility */
  delay?: number;
  as?: "div" | "li";
};

/**
 * Fade-and-rise on first entry into view (IntersectionObserver + CSS transition).
 * No JS → the <noscript> rule shows it; reduced motion → shown without movement.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag ref={ref} data-reveal="" className={className} style={{ "--rv-d": `${Math.round(delay * 1000)}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
