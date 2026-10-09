"use client";

import { useEffect, useRef } from "react";

/**
 * Kinetic capability band. Two rows drift in opposite directions; scrolling
 * adds speed and a skew proportional to scroll velocity, which then eases out.
 * Pauses off-screen. Reduced motion → a still, wrapped list (CSS).
 */
export function VelocityMarquee({ rows }: { rows: string[][] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-track]"));
    const pos = tracks.map(() => 0);
    let lastY = window.scrollY;
    let vel = 0;
    let frame = 0;
    let visible = false;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 16.67;
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      vel += (dy - vel) * 0.12;
      const skew = Math.max(-12, Math.min(12, vel * 0.35));
      tracks.forEach((t, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const half = t.scrollWidth / 2;
        let x = ((pos[i] ?? 0) + dir * (0.6 + Math.abs(vel) * 0.25) * dt) % half;
        if (x > 0) x -= half;
        pos[i] = x;
        t.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${(-skew * dir).toFixed(2)}deg)`;
      });
      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
      if (visible && !frame) {
        last = performance.now();
        lastY = window.scrollY;
        frame = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} className="overflow-hidden py-6" aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} className="whitespace-nowrap motion-reduce:whitespace-normal">
          <div data-track className="inline-flex will-change-transform motion-reduce:flex motion-reduce:flex-wrap">
            {[...row, ...row].map((word, j) => (
              <span
                key={`${word}-${j}`}
                className={
                  "px-6 py-2 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-none tracking-[-0.02em] " +
                  (j % 3 === 1 ? "italic text-teal-bright" : "text-ivory/90") +
                  (j >= row.length ? " motion-reduce:hidden" : "")
                }
              >
                {word}
                <span className="pl-12 text-ivory/25">✦</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
