import { projects, showcaseCategories } from "@/content/work";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ventures/ProjectCard";
import { VentureVisual } from "@/components/ventures/VentureVisual";
import { getVenture } from "@/content/ventures";

export function WorkPreview() {
  const hasWork = projects.length > 0;

  return (
    <section aria-labelledby="work-title" className="bg-stone py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="work-title"
            index="03"
            eyebrow="Selected work"
            title={hasWork ? "Recent work across the ventures." : "The showcase is coming together."}
            intro={
              hasWork
                ? undefined
                : "Real projects, galleries and stories will be published here once they are ready and approved — nothing invented in the meantime."
            }
          />
          <ButtonLink href="/work" variant="secondary" className="self-start lg:self-end">
            {hasWork ? "See all work" : "About the showcase"}
          </ButtonLink>
        </div>

        {hasWork ? (
          <ul className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {showcaseCategories.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 0.06}>
                <div className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-[22px] p-6 text-ivory">
                  <div aria-hidden="true" className="absolute inset-0 -z-0 transition-transform duration-700 group-hover:scale-105">
                    <VentureVisual venture={getVenture(c.slug)} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
                  <span className="eyebrow relative w-fit rounded-full border border-ivory/25 bg-ink/40 px-3 py-1.5 text-ivory/80 backdrop-blur-sm">
                    In preparation
                  </span>
                  <div className="relative">
                    <p className="font-display text-[1.7rem] leading-tight tracking-tight">{c.label}</p>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-ivory/75">{c.expects}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
