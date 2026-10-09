"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Muted, looping 3D clip. Plays only while on screen (saves battery/CPU),
 * never autoplays for reduced-motion visitors (they see the poster frame),
 * and loads nothing until it is near the viewport.
 */
export function LoopVideo({ src, poster, className, label }: { src: string; poster: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn("block h-full w-full object-cover", className)}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
      <source src={src} type="video/mp4" />
    </video>
  );
}
