"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";
import { SplitText } from "@/components/motion/SplitText";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroSceneLazy } from "@/components/experience/HeroSceneLazy";
import type { HeroEngine } from "@/components/experience/heroEngine";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0→1 across [a,b] */
const ramp = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
/** fade in over [a,b], hold, fade out over [c,e] */
const window4 = (x: number, a: number, b: number, c: number, e: number) => Math.min(ramp(x, a, b), 1 - ramp(x, c, e));

export const ventureDot: Record<string, string> = {
  digital: "bg-v-digital",
  events: "bg-v-events",
  "real-estate": "bg-v-property",
  "financial-solutions": "bg-v-financial",
};

/**
 * Scroll-driven 3D scrollytelling — the pinned opening scene.
 *
 * One timeline, scrubbed by scroll (the same model as GSAP ScrollTrigger with
 * `pin` + `scrub`): progress 0→1 across ~3.4 viewports drives
 *   • the WebGL camera along a Catmull-Rom spline (wide → centred → orbit → fly-through)
 *   • object transforms (lattice opens, rotates, then expands around the camera)
 *   • HTML beats with their own parallax depths (name / "Four worlds" / "One mindset")
 *   • a cross-fade into the next section.
 * Narrow screens and reduced motion get the first beat only, not pinned.
 */
export function HeroStory() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const engine = useRef<HeroEngine | null>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const onReady = useCallback((e: HeroEngine) => {
    engine.current = e;
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const s = section.current;
    const st = stage.current;
    if (!s || !st) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = s.getBoundingClientRect();
      const p = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
      engine.current?.setProgress(p);
      // timeline beats (CSS reads these)
      st.style.setProperty("--p", p.toFixed(4));
      const b1 = 1 - ramp(p, 0.12, 0.28);
      st.style.setProperty("--b1", b1.toFixed(3));
      st.style.setProperty("--b1-pe", b1 < 0.1 ? "none" : "auto");
      st.style.setProperty("--b2", window4(p, 0.27, 0.35, 0.5, 0.56).toFixed(3));
      st.style.setProperty("--b3", window4(p, 0.64, 0.7, 0.84, 0.9).toFixed(3));
      st.style.setProperty("--out", ramp(p, 0.9, 1).toFixed(3));
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
    <section
      ref={section}
      id="hero"
      aria-labelledby="hero-title"
      className="on-dark relative bg-brick-3 text-ivory lg:motion-safe:h-[340vh]"
    >
      <div
        ref={stage}
        className="story-stage relative isolate h-auto min-h-[calc(100svh-72px)] overflow-clip lg:motion-safe:sticky lg:motion-safe:top-[72px] lg:motion-safe:h-[calc(100svh-72px)]"
      >
        {/* terracotta studio backdrop: wall + floor + soft key light */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_90%_70%_at_60%_105%,#a94e42_0%,#872e32_45%,#5c1a20_100%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-20 h-[38%] bg-gradient-to-b from-transparent to-[#9f473d]/60" />
        <div aria-hidden="true" className="grain absolute inset-0 -z-10" />

        {/* 3D lattice */}
        <div
          aria-hidden="true"
          className={
            pinned
              ? "pointer-events-none absolute inset-0 -z-10"
              : "pointer-events-none absolute -right-[18%] top-[2%] -z-10 aspect-square w-[78vw] max-w-[560px] opacity-75 sm:-right-[8%] sm:w-[60vw]"
          }
        >
          <div
            className={
              pinned
                ? "orb-fallback absolute right-[8%] top-[18%] aspect-square w-[min(38vw,520px)]"
                : "orb-fallback absolute inset-[22%]"
            }
          />
          <HeroSceneLazy key={pinned ? "story" : "orbit"} mode={pinned ? "story" : "orbit"} className="absolute inset-0" onReady={onReady} />
        </div>

        {/* ------------------- beat 1: identity ------------------- */}
        <div className="story-b1 relative mx-auto flex h-full min-h-[calc(100svh-72px)] max-w-[1320px] flex-col px-5 pb-8 pt-10 sm:px-8 sm:pt-14 lg:px-12">
          <div className="flex items-center justify-between text-[0.78rem] text-ivory/70">
            <p className="eyebrow kt-track" style={d(200)}>
              Founder · Four ventures
            </p>
            <p className="eyebrow kt-track hidden sm:block" style={d(400)}>
              Scroll to explore
            </p>
          </div>

          <h1 id="hero-title" className="mt-10 sm:mt-14">
            <span className="sr-only">
              {site.name} — {site.descriptor}
            </span>
            <span aria-hidden="true" className="block">
              <SplitText
                text="Hari"
                by="char"
                delay={150}
                className="kt-3d kt-weight block font-display text-[clamp(4.6rem,16vw,14.5rem)] font-bold leading-[0.82] tracking-[-0.06em]"
              />
              <SplitText
                text="Mahadevan"
                by="char"
                delay={330}
                step={32}
                className="kt-3d block font-display text-[clamp(3.2rem,11vw,10rem)] font-light leading-[0.95] tracking-[-0.05em] text-teal-bright"
              />
            </span>
          </h1>

          <div className="mt-auto grid gap-8 pt-10 lg:grid-cols-12 lg:items-end">
            <div className="flex items-end gap-5 lg:col-span-7">
              <div className="st-in w-[min(34vw,150px)] shrink-0 sm:w-[160px]" style={d(700)}>
                <ClipReveal radius={18} className="aspect-[4/5] rounded-[18px] bg-brick-3 ring-1 ring-ivory/20">
                  <Image
                    src={site.portrait.hero}
                    alt={site.portrait.heroAlt}
                    fill
                    priority
                    sizes="160px"
                    className="object-cover object-[60%_20%]"
                  />
                </ClipReveal>
              </div>
              <div>
                <p className="st-in text-[0.9rem] text-ivory/70" style={d(850)}>
                  {site.roles.join(" · ")}
                </p>
                <p className="st-in mt-3 max-w-lg font-display text-[clamp(1.35rem,2vw,1.8rem)] font-medium leading-[1.2] tracking-[-0.02em]" style={d(950)}>
                  Ideas into opportunities. <span className="text-teal-bright">Creativity into experiences.</span> Relationships into long-term value.
                </p>
              </div>
            </div>
            <div className="st-in flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end" style={d(1100)}>
              <Magnetic>
                <Link
                  href="#chapters"
                  className="group inline-flex min-h-13 items-center gap-2 rounded-full bg-teal-bright px-7 py-3.5 text-[0.98rem] font-semibold text-ink transition-colors hover:bg-ivory"
                >
                  Explore the four worlds
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex min-h-13 items-center rounded-full border border-ivory/30 bg-brick-3/40 px-7 py-3.5 text-[0.98rem] font-semibold text-ivory backdrop-blur-md transition-colors hover:border-ivory hover:bg-brick-3/70"
                >
                  Start a conversation
                </Link>
              </Magnetic>
            </div>
          </div>

          <nav aria-label="Ventures" className="mt-8 border-t border-line-dark">
            <ul className="grid grid-cols-2 lg:grid-cols-4">
              {ventures.map((v, i) => (
                <li key={v.slug} className="st-in" style={d(1250 + i * 80)}>
                  <Link href={ventureHref(v.slug)} className="group flex min-h-16 items-center gap-3 py-3 pr-4">
                    <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${ventureDot[v.slug]} transition-transform group-hover:scale-150`} />
                    <span className="text-[0.78rem] tabular-nums text-ivory/55">{v.number}</span>
                    <span className="text-[0.95rem] text-ivory/85 transition-colors group-hover:text-ivory">
                      {v.chapter === "Property" ? "Real Estate" : v.chapter === "Financial" ? "Financial Solutions" : v.chapter}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ------------------- beat 2 & 3 (desktop story only) ------------------- */}
        <div aria-hidden={!pinned} className="pointer-events-none absolute inset-0 hidden lg:motion-safe:block">
          <div className="story-b2 absolute left-12 top-1/2 max-w-[44rem] -translate-y-1/2">
            <p className="eyebrow text-teal-bright">Chapter 00</p>
            <p className="mt-6 font-display text-[clamp(4rem,8vw,8.5rem)] font-bold leading-[0.88] tracking-[-0.05em]">Four worlds.</p>
            <p className="mt-6 max-w-md text-[1.1rem] leading-relaxed text-ivory/80">
              Digital marketing, events, real estate and financial services — four very different needs.
            </p>
          </div>
          <div className="story-b3 absolute right-12 top-1/2 max-w-[46rem] -translate-y-1/2 text-right">
            <p className="font-display text-[clamp(3.6rem,7vw,7.5rem)] font-light leading-[0.9] tracking-[-0.05em] text-teal-bright">
              One entrepreneurial
            </p>
            <p className="font-display text-[clamp(3.6rem,7vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.05em]">mindset.</p>
            <p className="ml-auto mt-6 max-w-sm text-[1.1rem] leading-relaxed text-ivory/80">Clear communication, quality work, and relationships that last.</p>
          </div>
          {/* progress rail */}
          <div className="absolute bottom-8 right-12 flex items-center gap-3 text-[0.75rem] tabular-nums text-ivory/60" style={{ opacity: "calc(1 - var(--b1, 1))" }}>
            <span>00</span>
            <span className="relative block h-px w-32 bg-ivory/20">
              <span className="absolute inset-y-0 left-0 block bg-teal-bright" style={{ width: "calc(var(--p, 0) * 100%)" }} />
            </span>
            <span>04</span>
          </div>
          {/* hand-off to the next section */}
          <div className="absolute inset-0 bg-ink" style={{ opacity: "var(--out, 0)" }} />
        </div>
      </div>
    </section>
  );
}
