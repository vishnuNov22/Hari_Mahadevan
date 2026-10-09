"use client";

import { useEffect, useRef, useState } from "react";
import { about } from "@/content/about";

/**
 * Horizontal scroll section: "How I work" in four steps.
 * Desktop + motion allowed → pinned; vertical scroll moves the track sideways
 * (scrubbed), each card lifting in depth as it reaches the centre.
 * Otherwise → a normal vertical list.
 */
export function MethodRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      const max = t.scrollWidth - window.innerWidth;
      t.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
      const mid = window.innerWidth / 2;
      t.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
        const cr = c.getBoundingClientRect();
        const k = 1 - Math.min(1, Math.abs(cr.left + cr.width / 2 - mid) / mid);
        c.style.transform = `translate3d(0, ${((1 - k) * 40).toFixed(1)}px, 0) scale(${(0.92 + k * 0.08).toFixed(3)})`;
        c.style.opacity = (0.45 + k * 0.55).toFixed(3);
      });
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(frame);
    };
  }, [pinned]);

  return (
    <section ref={section} aria-labelledby="method-title" className="on-dark grain relative bg-ink text-ivory lg:motion-safe:h-[300vh]">
      <div className="lg:motion-safe:sticky lg:motion-safe:top-[72px] lg:motion-safe:flex lg:motion-safe:h-[calc(100svh-72px)] lg:motion-safe:items-center lg:motion-safe:overflow-hidden">
        <div ref={track} className="flex flex-col gap-6 px-5 py-20 sm:px-8 lg:motion-safe:flex-row lg:motion-safe:gap-8 lg:motion-safe:py-0 lg:motion-safe:pl-[8vw] lg:motion-safe:pr-[12vw] lg:motion-safe:will-change-transform">
          <div className="shrink-0 lg:motion-safe:w-[34vw] lg:motion-safe:pr-8">
            <p className="eyebrow text-teal-bright">How I work</p>
            <h2 id="method-title" className="display-lg mt-6">
              Four steps, <em className="text-teal-bright">the same</em> every time.
            </h2>
            <p className="lede mt-6 max-w-md text-muted-dark">Whichever venture you come to, the way of working doesn’t change.</p>
          </div>
          {about.approach.map((step, i) => (
            <article
              key={step.title}
              data-card
              className="relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[28px] border border-line-dark bg-gradient-to-br from-ink-3 to-ink-2 p-8 transition-[box-shadow] duration-500 hover:shadow-[0_0_60px_rgba(143,155,255,0.18)] sm:p-10 lg:motion-safe:h-[62vh] lg:motion-safe:w-[30vw]"
            >
              <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-10 font-display text-[12rem] italic leading-none text-ivory/[0.05]">
                {i + 1}
              </span>
              <p className="text-[0.8rem] tabular-nums text-teal-bright">Step 0{i + 1}</p>
              <div className="mt-16">
                <h3 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[1.05]">{step.title}</h3>
                <p className="mt-4 max-w-sm text-[1.02rem] leading-relaxed text-muted-dark">{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
