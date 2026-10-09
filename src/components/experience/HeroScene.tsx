"use client";

import { useEffect, useRef, useState } from "react";
import { createHeroEngine, type HeroEngine, type HeroEngineOptions } from "./heroEngine";
import { cn } from "@/lib/cn";

type HeroSceneProps = {
  className?: string;
  mode?: HeroEngineOptions["mode"];
  floor?: boolean;
  /** 0..1 venture tint for the rim light */
  hue?: number;
  trackPointer?: boolean;
  /** receives the engine so a parent can scrub it from scroll without re-rendering */
  onReady?: (engine: HeroEngine) => void;
};

/**
 * Client-only WebGL canvas, loaded lazily (HeroSceneLazy) so text and CTAs never
 * wait for it. If WebGL is missing, fails to compile, or the context is lost,
 * the canvas stays hidden and the static CSS fallback behind it remains.
 */
export default function HeroScene({ className, mode = "story", floor = true, hue = 0, trackPointer = true, onReady }: HeroSceneProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const engine = useRef<HeroEngine | null>(null);
  const [ready, setReady] = useState(false);
  const readyCb = useRef(onReady);
  readyCb.current = onReady;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    try {
      engine.current = createHeroEngine(canvas, () => setReady(false), { mode, floor });
      readyCb.current?.(engine.current);
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
  }, [mode, floor, trackPointer]);

  useEffect(() => {
    engine.current?.setHue(hue);
  }, [hue]);

  return <canvas ref={ref} aria-hidden="true" className={cn("hero-canvas block h-full w-full", ready && "is-ready", className)} />;
}
