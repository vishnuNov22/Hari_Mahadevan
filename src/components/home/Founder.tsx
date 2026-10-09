import Image from "next/image";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ScrollVars } from "@/components/motion/ScrollVars";
import { LiquidImage } from "@/components/motion/LiquidImage";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

/**
 * "The founder" — progressive image reveal.
 * As the section travels through the viewport (--vp 0→1) a circular mask
 * opens into a rounded frame, the giant outline word slides behind at its own
 * depth, and the copy rises at another. Hovering the portrait adds a liquid
 * displacement. All of it is CSS reading one scroll variable.
 */
export function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-title" className="relative overflow-clip bg-paper py-24 sm:py-32 lg:py-40">
      <ScrollVars targetId="founder" />

      {/* depth layer 1: giant outline word */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -z-0 -translate-y-1/2 whitespace-nowrap font-display text-[26vw] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(10,14,26,0.10)] [transform:translate3d(calc((0.5_-_var(--vp,0.5))*30vw),0,0)] motion-reduce:[transform:none]"
      >
        The founder
      </p>

      <Container className="relative grid items-center gap-14 lg:grid-cols-12">
        {/* depth layer 2: portrait in a scroll-opened mask */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-[714/1000] w-full max-w-[440px] overflow-hidden rounded-[28px] bg-stone [clip-path:circle(calc(30%_+_min(1,var(--vp,1)*2.6)*55%)_at_50%_42%)] motion-reduce:[clip-path:none]">
            <LiquidImage className="absolute inset-0">
              <Image
                src={site.portrait.full}
                alt={site.portrait.alt}
                fill
                sizes="(min-width: 1024px) 440px, 90vw"
                className="object-cover object-top [transform:scale(calc(1.18_-_min(1,var(--vp,1)*2.6)*0.18))] motion-reduce:[transform:none]"
              />
            </LiquidImage>
          </div>
        </div>

        {/* depth layer 3: copy */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-teal">
              <span aria-hidden="true" className="h-px w-10 bg-teal/50" />
              The founder
            </p>
            <h2 id="founder-title" className="display-lg mt-6">
              One person. <em className="text-teal">Four ways</em> to help.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede mt-8 max-w-[60ch] text-muted">{about.bio}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-teal">Vision</dt>
                <dd className="mt-3 text-[1rem] leading-relaxed text-ink/80">{about.vision}</dd>
              </div>
              <div>
                <dt className="eyebrow text-teal">Mission</dt>
                <dd className="mt-3 text-[1rem] leading-relaxed text-ink/80">{about.mission}</dd>
              </div>
            </dl>
            <div className="mt-10">
              <ButtonLink href="/about" variant="secondary">
                More about Hari
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
