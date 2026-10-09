import { ventures } from "@/content/ventures";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

/** Typographic composition of the full service range, grouped by chapter. */
export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="on-dark grain bg-ink py-20 text-ivory sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          id="capabilities-title"
          index="02"
          eyebrow="Selected capabilities"
          dark
          title={
            <>
              From a first post to a <span className="italic text-brass-soft">front door</span>.
            </>
          }
          intro="A wide range of work, organised so it is easy to find the part you need."
        />

      </Container>
      <div className="mt-14">
        <VelocityMarquee
          rows={[
            ["Brand promotion", "Weddings", "Websites", "Stage décor", "Motion graphics", "Pre-wedding shoots"],
            ["Property marketing", "Life insurance", "SEO", "Rental assistance", "Video production", "Private events"],
          ]}
        />
      </div>
      <Container>
        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-x-20">
          {ventures.map((v, i) => (
            <Reveal key={v.slug} delay={(i % 2) * 0.08} className="border-t border-line-dark pt-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="eyebrow text-brass-soft">
                  {v.number} · {v.chapter}
                </h3>
                <span className="text-[0.82rem] text-muted-dark">{v.label}</span>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2 font-display text-[1.55rem] leading-snug tracking-tight sm:text-[1.9rem]">
                {v.serviceGroups
                  .flatMap((g) => g.services)
                  .map((service, idx, arr) => (
                    <li key={service} className="text-ivory/90">
                      {service}
                      {idx < arr.length - 1 ? (
                        <span aria-hidden="true" className="pl-3 text-brass-soft/50">
                          /
                        </span>
                      ) : null}
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
