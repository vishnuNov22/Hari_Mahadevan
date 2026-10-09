"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { getVenture } from "@/content/ventures";
import { unsplashSized } from "@/components/ventures/VentureVisual";

/** One image per step, chosen for meaning: listening → planning → production → lasting relationships. */
const stepImages = [
  { src: site.portrait.hero, alt: "Hari Mahadevan, smiling", pos: "60% 20%" },
  { src: unsplashSized(getVenture("digital").photo.src, 900), alt: getVenture("digital").photo.alt, pos: "50% 55%" },
  { src: unsplashSized(getVenture("events").photo.src, 900), alt: getVenture("events").photo.alt, pos: "50% 45%" },
  { src: unsplashSized(getVenture("financial-solutions").photo.src, 900), alt: getVenture("financial-solutions").photo.alt, pos: "50% 50%" },
];

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
              className="group relative isolate flex shrink-0 flex-col justify-between overflow-hidden rounded-[28px] border border-line-dark bg-gradient-to-br from-ink-3 to-ink-2 p-8 transition-[box-shadow] duration-500 hover:shadow-[0_0_60px_rgba(169,214,223,0.2)] min-h-[380px] sm:p-10 lg:motion-safe:h-[62vh] lg:motion-safe:w-[30vw]"
            >
              <div aria-hidden="true" className="absolute inset-0 -z-0">
                <Image
                  src={stepImages[i]!.src}
                  alt=""
                  fill
                  unoptimized={stepImages[i]!.src.startsWith("http")}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover opacity-55 [filter:saturate(0.8)_contrast(1.05)] transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: stepImages[i]!.pos }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
              </div>
              <p className="relative text-[0.8rem] tabular-nums text-teal-bright">Step 0{i + 1}</p>
              <div className="relative mt-16">
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
