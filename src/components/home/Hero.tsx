import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroSceneLazy } from "@/components/experience/HeroSceneLazy";
import { ScrollVars } from "@/components/motion/ScrollVars";
import { ArrowUpRight } from "lucide-react";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export const ventureDot: Record<string, string> = {
  digital: "bg-v-digital",
  events: "bg-v-events",
  "real-estate": "bg-v-property",
  "financial-solutions": "bg-v-financial",
};

/**
 * Signature hero — "Four worlds. One entrepreneurial mindset."
 * Oversized split-text name, a crisp founder portrait revealed through a
 * clip-path, one restrained real-time 3D motif behind the type, and the four
 * ventures as usable navigation. Everything important is plain HTML and is
 * readable before (and without) any animation or WebGL.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="on-dark grain relative isolate overflow-clip bg-ink text-ivory">
      <ScrollVars targetId="hero" />
      {/* atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_75%_30%,#1b2236_0%,transparent_70%),radial-gradient(ellipse_50%_40%_at_10%_90%,rgba(143,155,255,0.10),transparent_70%)]"
      />

      {/* 3D motif (static orb underneath as the fallback) */}
      <div aria-hidden="true" className="px-down pointer-events-none absolute -right-[18%] top-[-4%] -z-10 aspect-square w-[115vw] sm:-right-[10%] sm:w-[85vw] lg:-right-[6%] lg:top-[-8%] lg:w-[min(68vw,1000px)]">
        <div className="orb-fallback absolute inset-[24%]" />
        <HeroSceneLazy className="absolute inset-0" />
      </div>

      <Container className="relative flex min-h-[calc(100svh-72px)] flex-col pb-8 pt-10 sm:pt-14">
        {/* metadata row */}
        <div className="st-in flex items-center justify-between text-[0.78rem] text-muted-dark" style={d(100)}>
          <p className="eyebrow kt-track" style={d(200)}>Founder · Four ventures</p>
          <p className="eyebrow kt-track hidden sm:block" style={d(400)}>Four worlds. One mindset.</p>
        </div>

        {/* name */}
        <h1 id="hero-title" className="relative mt-10 sm:mt-14 lg:mt-16">
          <span className="sr-only">{site.name} — {site.descriptor}</span>
          <span aria-hidden="true" className="block">
            <span className="px-up block">
              <SplitText
                text="Hari"
                by="char"
                delay={150}
                className="kt-3d kt-weight block font-sans text-[clamp(4.6rem,17vw,15.5rem)] font-semibold leading-[0.82] tracking-[-0.065em]"
              />
            </span>
            <span className="px-side block">
              <SplitText
                text="Mahadevan"
                by="char"
                delay={330}
                step={32}
                className="kt-3d block font-display text-[clamp(4.2rem,15.5vw,14rem)] italic leading-[0.9] tracking-[-0.03em] text-ivory/95 sm:pl-[8vw]"
              />
            </span>
          </span>
        </h1>

        {/* founder portrait — crisp, framed, never stretched */}
        <div className="px-fast z-10 mt-8 w-[min(62vw,250px)] sm:absolute sm:right-8 sm:top-[16%] sm:mt-0 sm:w-[180px] lg:right-[9%] lg:top-[14%] lg:w-[min(14vw,200px)]">
          <div className="st-in" style={d(700)}>
          <ClipReveal radius={22} className="aspect-[4/5] rounded-[22px] bg-ink-3/60 ring-1 ring-ivory/15">
            <Image
              src={site.portrait.hero}
              alt={site.portrait.heroAlt}
              fill
              priority
              sizes="(min-width: 1024px) 290px, (min-width: 640px) 250px, 62vw"
              className="object-cover object-[60%_20%]"
            />
          </ClipReveal>
          <div className="mt-3 flex items-center justify-between text-[0.75rem] text-muted-dark sm:hidden">
            <span className="eyebrow">Founder</span>
            <span>{site.name}</span>
          </div>
          </div>
        </div>

        {/* proposition + CTAs */}
        <div className="mt-10 grid gap-8 sm:mt-auto sm:pt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="st-in text-[0.92rem] text-muted-dark" style={d(850)}>
              {site.roles.join(" · ")}
            </p>
            <p className="st-in mt-4 max-w-xl font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.2] text-ivory" style={d(950)}>
              Ideas into opportunities. <em className="text-teal-bright">Creativity into experiences.</em> Relationships into long-term value.
            </p>
          </div>
          <div className="st-in flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end" style={d(1100)}>
            <Magnetic>
              <Link
                href="#chapters"
                className="group inline-flex min-h-13 items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-[0.98rem] font-semibold text-ink transition-colors hover:bg-teal-bright"
              >
                Explore the four worlds
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center rounded-full border border-ivory/25 bg-ink/50 px-7 py-3.5 text-[0.98rem] font-semibold text-ivory backdrop-blur-md transition-colors hover:border-ivory hover:bg-ink/70"
              >
                Start a conversation
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* venture signals */}
        <nav aria-label="Ventures" className="mt-10 border-t border-line-dark">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {ventures.map((v, i) => (
              <li key={v.slug} className="st-in" style={d(1250 + i * 80)}>
                <Link href={ventureHref(v.slug)} className="group flex min-h-20 items-center gap-3 py-4 pr-4">
                  <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${ventureDot[v.slug]} transition-transform group-hover:scale-150`} />
                  <span className="text-[0.78rem] tabular-nums text-muted-dark">{v.number}</span>
                  <span className="text-[0.95rem] text-ivory/85 transition-colors group-hover:text-ivory">{v.chapter === "Property" ? "Real Estate" : v.chapter === "Financial" ? "Financial Solutions" : v.chapter}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
