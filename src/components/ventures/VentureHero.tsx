import type { CSSProperties, ReactNode } from "react";
import type { Venture } from "@/content/ventures";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VentureVisual } from "./VentureVisual";

type Composition = "split" | "cinematic" | "panorama" | "calm";

type VentureHeroProps = {
  venture: Venture;
  composition: Composition;
  aside?: ReactNode;
};

/**
 * One structural system, four compositions:
 * split (digital) · cinematic (events) · panorama (real estate) · calm (financial).
 */
export function VentureHero({ venture, composition, aside }: VentureHeroProps) {
  const dark = composition === "cinematic";
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Ventures", href: "/ventures" },
    { label: venture.chapter, href: `/ventures/${venture.slug}` },
  ];

  const Copy = (
    <>
      <Breadcrumbs items={crumbs} dark={dark} />
      <p className={cn("eyebrow anim-rise mt-10", dark ? "text-brass-soft" : "text-teal")}>{venture.eyebrow}</p>
      <h1 className="display-lg anim-rise mt-6" style={{ "--delay": "80ms" } as CSSProperties}>
        {venture.headline}
      </h1>
      <p
        className={cn("mt-6 font-display text-[1.3rem] italic anim-rise", dark ? "text-brass-soft" : "text-brass")}
        style={{ "--delay": "140ms" } as CSSProperties}
      >
        {venture.label}
      </p>
      <p
        className={cn("lede anim-rise mt-6 max-w-2xl", dark ? "text-ivory/85" : "text-muted")}
        style={{ "--delay": "200ms" } as CSSProperties}
      >
        {venture.intro}
      </p>
      <div className="anim-rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--delay": "260ms" } as CSSProperties}>
        <ButtonLink href={`/contact?topic=${encodeURIComponent(venture.enquiryTopic)}`} variant={dark ? "light" : "primary"}>
          Enquire about {venture.chapter.toLowerCase()}
        </ButtonLink>
        <ButtonLink href="#services" variant={dark ? "ghost-dark" : "secondary"} icon={false}>
          See services
        </ButtonLink>
      </div>
    </>
  );

  if (composition === "cinematic") {
    return (
      <section className="on-dark grain relative overflow-hidden bg-ink text-ivory">
        <div aria-hidden="true" className="absolute inset-0 opacity-60">
          <div className="anim-settle h-full w-full">
            <VentureVisual venture={venture} />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <Container className="relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">{Copy}</div>
          <p aria-hidden="true" className="display-xl pointer-events-none absolute bottom-6 right-5 text-ivory/[0.06] sm:right-8 lg:right-12">
            {venture.number}
          </p>
        </Container>
      </section>
    );
  }

  if (composition === "panorama") {
    return (
      <section className="bg-paper">
        <Container className="pb-12 pt-10 sm:pt-14">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">{Copy}</div>
            {aside ? <div className="lg:col-span-4 lg:self-end">{aside}</div> : null}
          </div>
        </Container>
        <div className="relative mx-auto aspect-[16/9] max-h-[560px] w-full max-w-[1600px] overflow-hidden sm:aspect-[21/8]">
          <div className="anim-settle h-full w-full">
            <VentureVisual venture={venture} />
          </div>
        </div>
      </section>
    );
  }

  if (composition === "calm") {
    return (
      <section className="bg-[#eef2ef]">
        <Container className="grid gap-12 py-10 sm:py-14 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-20">
          <div className="lg:col-span-7">{Copy}</div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-[420px] overflow-hidden rounded-full border border-teal/20">
              <VentureVisual venture={venture} />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // split
  return (
    <section className="bg-ivory">
      <Container className="grid gap-12 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div className="lg:col-span-7 lg:py-8">{Copy}</div>
        <div className="relative self-start lg:col-span-5">
          <p aria-hidden="true" className="display-xl absolute -left-2 -top-6 z-10 text-teal lg:-left-16 lg:top-auto lg:-bottom-8">
            {venture.number}
          </p>
          <div className="relative aspect-[4/5] overflow-hidden">
            <div className="anim-settle h-full w-full">
              <VentureVisual venture={venture} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
