"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { ventures, ventureHref } from "@/content/ventures";
import { VentureVisual } from "@/components/ventures/VentureVisual";
import { HeroSceneLazy } from "@/components/experience/HeroSceneLazy";
import { cn } from "@/lib/cn";

const accent: Record<string, string> = {
  digital: "text-v-digital",
  events: "text-v-events",
  "real-estate": "text-v-property",
  "financial-solutions": "text-v-financial",
};
const bar: Record<string, string> = {
  digital: "bg-v-digital",
  events: "bg-v-events",
  "real-estate": "bg-v-property",
  "financial-solutions": "bg-v-financial",
};

function ChapterBody({ index }: { index: number }) {
  const v = ventures[index]!;
  return (
    <>
      <p className={cn("eyebrow", accent[v.slug])}>
        Chapter {v.number} — {v.chapter === "Property" ? "Real Estate" : v.chapter}
      </p>
      <h3 className="mt-5 font-display text-[clamp(2.2rem,4.2vw,4rem)] leading-[1.02] tracking-[-0.02em] text-ivory">{v.headline}</h3>
      <p className="mt-3 font-sans text-[1rem] font-medium text-ivory/70">{v.label}</p>
      <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-muted-dark">{v.summary}</p>
      <ul className="mt-6 flex max-w-md flex-wrap gap-2">
        {v.serviceGroups
          .flatMap((g) => g.services)
          .slice(0, 5)
          .map((s) => (
            <li key={s} className="rounded-full border border-line-dark px-3 py-1.5 text-[0.82rem] text-ivory/80">
              {s}
            </li>
          ))}
      </ul>
      <Link href={ventureHref(v.slug)} className="group mt-8 inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-ivory">
        Enter the chapter
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </>
  );
}

/**
 * Scrollytelling: the four ventures as four visual chapters.
 *
 * Desktop with motion allowed → ONE pinned sequence (≈ 4 viewports of scroll).
 * Scroll progress scrubs the active chapter, clip-path wipes each venture panel
 * in, zooms its art, fills the progress rail and re-tints the 3D form.
 *
 * Narrow screens / reduced motion → a plain, non-pinned stack of the same content.
 */
export function FourChapters() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      setProgress(p);
      setActive(Math.min(ventures.length - 1, Math.floor(p * ventures.length * 0.999)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pinned]);

  const local = progress * ventures.length - active; // 0..1 within the active chapter

  return (
    <section id="chapters" ref={ref} aria-labelledby="chapters-title" className="on-dark relative scroll-mt-[72px] bg-ink text-ivory lg:motion-safe:h-[420vh]">
      <h2 id="chapters-title" className="sr-only">
        The four ventures
      </h2>

      {/* ---------- pinned stage (desktop, motion allowed) ---------- */}
      <div
        className="chapters-pin sticky top-[72px] hidden h-[calc(100svh-72px)] overflow-hidden lg:motion-safe:block"
        style={{ "--local": local.toFixed(3) } as CSSProperties}
      >
        <div className="mx-auto grid h-full max-w-[1320px] grid-cols-12 items-center gap-10 px-12">
          {/* progress rail */}
          <ol aria-label="Chapter progress" className="col-span-1 flex flex-col gap-4 self-center">
            {ventures.map((v, i) => (
              <li key={v.slug} className="flex items-center gap-3">
                <span className="relative block h-12 w-[2px] overflow-hidden rounded bg-ivory/12">
                  <span
                    className={cn("absolute inset-x-0 top-0 block", bar[v.slug])}
                    style={{ height: `${Math.min(1, Math.max(0, progress * ventures.length - i)) * 100}%` }}
                  />
                </span>
                <span className={cn("text-[0.75rem] tabular-nums transition-colors", i === active ? "text-ivory" : "text-muted-dark")}>{v.number}</span>
              </li>
            ))}
          </ol>

          {/* chapter copy */}
          <div className="relative col-span-5 h-[440px]">
            {ventures.map((v, i) => (
              <div key={v.slug} className={cn("ch-text", i === active && "is-active")} aria-hidden={i !== active} inert={i !== active ? true : undefined}>
                <ChapterBody index={i} />
              </div>
            ))}
          </div>

          {/* visual panels */}
          <div className="relative col-span-6 h-[min(72vh,640px)]">
            {ventures.map((v, i) => (
              <div key={v.slug} className={cn("ch-panel overflow-hidden", i < active && "is-past", i === active && "is-active")} aria-hidden="true">
                <div className="ch-art h-full w-full">
                  <VentureVisual venture={v} />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-6 pt-20">
                  <span className="font-display text-[1.6rem] italic text-ivory">{v.label}</span>
                  <span className="text-[0.8rem] tabular-nums text-ivory/70">{v.number} / 04</span>
                </div>
              </div>
            ))}
            {/* the same 3D form, re-tinted per chapter */}
            <div className="pointer-events-none absolute -left-24 -top-20 z-10 size-64">
              <div className="orb-fallback absolute inset-[26%] opacity-60" />
              {pinned ? <HeroSceneLazy hue={progress} trackPointer={false} className="absolute inset-0" /> : null}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- simplified stack (mobile, tablet, reduced motion) ---------- */}
      <div className="mx-auto grid max-w-[1320px] gap-20 px-5 py-20 sm:px-8 lg:motion-safe:hidden lg:px-12">
        {ventures.map((v, i) => (
          <article key={v.slug} className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]" aria-hidden="true">
              <VentureVisual venture={v} />
            </div>
            <div>
              <ChapterBody index={i} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
