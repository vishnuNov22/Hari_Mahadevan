"use client";

import { useEffect, useRef, useState } from "react";
import { createHeroEngine, type HeroEngine } from "./heroEngine";
import { cn } from "@/lib/cn";

type HeroSceneProps = {
  className?: string;
  /** 0..1 — drives the venture tint (scroll progress through the chapters) */
  hue?: number;
  /** follow the pointer across the whole window (hero) or not (chapter stage) */
  trackPointer?: boolean;
};

/**
 * Client-only WebGL canvas for the hero motif. Loaded lazily (see HeroSceneLazy)
 * so the headline and CTAs never wait for it. If WebGL is missing, fails to
 * compile, or the context is lost, the canvas stays hidden and the static CSS
 * orb behind it remains — nothing else on the page is affected.
 */
export default function HeroScene({ className, hue = 0, trackPointer = true }: HeroSceneProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const engine = useRef<HeroEngine | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    try {
      engine.current = createHeroEngine(canvas, () => setReady(false));
      requestAnimationFrame(() => setReady(true));
    } catch (err) {
      console.warn("[hero] static fallback in use:", err);
      return;
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      engine.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    if (trackPointer) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      engine.current?.destroy();
      engine.current = null;
    };
  }, [trackPointer]);

  useEffect(() => {
    engine.current?.setHue(hue);
  }, [hue]);

  return <canvas ref={ref} aria-hidden="true" className={cn("hero-canvas block h-full w-full", ready && "is-ready", className)} />;
}
