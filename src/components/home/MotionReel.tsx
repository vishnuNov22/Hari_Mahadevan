import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ventures, ventureHref } from "@/content/ventures";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LoopVideo } from "@/components/motion/LoopVideo";

/**
 * Motion studies — four 3D animated loops of the site's lattice sculpture,
 * each tinted and shaped for one venture. Pre-rendered (H.264, ~650 KB each),
 * so they cost far less than four live WebGL scenes.
 */
export function MotionReel() {
  return (
    <section aria-labelledby="reel-title" className="on-dark grain relative overflow-clip bg-ink py-20 text-ivory sm:py-28 lg:py-32">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-teal-bright">Motion studies</p>
            <h2 id="reel-title" className="display-lg mt-6">
              One form. <span className="text-teal-bright">Four temperaments.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[1rem] leading-relaxed text-muted-dark">
            The lattice from the opening scene, re-shaped and re-lit for each venture — rendered in 3D for this site.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ventures.map((v, i) => (
            <Reveal as="li" key={v.slug} delay={i * 0.08}>
              <Link href={ventureHref(v.slug)} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] ring-1 ring-ivory/10 transition-transform duration-500 group-hover:-translate-y-1.5">
                  <LoopVideo src={v.clip.src} poster={v.clip.poster} className="transition-transform duration-700 group-hover:scale-105" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <div>
                      <p className="text-[0.75rem] tabular-nums text-ivory/60">{v.number}</p>
                      <p className="mt-1 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.02em]">{v.label}</p>
                    </div>
                    <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-ivory/30 transition-colors group-hover:border-teal-bright group-hover:bg-teal-bright group-hover:text-ink">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
