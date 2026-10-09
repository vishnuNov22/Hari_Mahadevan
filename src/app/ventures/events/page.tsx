import { getVenture } from "@/content/ventures";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VentureHero } from "@/components/ventures/VentureHero";
import { ServiceGroups } from "@/components/ventures/ServiceGroups";
import { ProcessFlow } from "@/components/ventures/ProcessFlow";
import { VentureCta } from "@/components/ventures/VentureCta";
import { ChapterNav } from "@/components/ventures/ChapterNav";

const venture = getVenture("events");

export const metadata = buildMetadata({
  title: "Event Management — ADS Events",
  description:
    "Event planning, weddings, photography and videography, stage decoration, catering, entertainment, pre-wedding shoots and private events from ADS Events.",
  path: "/ventures/events",
});

const moments = ["The first look", "The stage, lit", "Family, together", "The last dance", "Light on petals", "A quiet minute"];

export default function EventsPage() {
  return (
    <>
      <VentureHero venture={venture} composition="cinematic" />

      {/* Emotional typographic interlude */}
      <section aria-labelledby="events-moments" className="bg-ivory py-20 sm:py-28">
        <Container>
          <p className="eyebrow text-teal">What a day is made of</p>
          <h2 id="events-moments" className="sr-only">
            Moments
          </h2>
          <ul className="mt-10 grid gap-y-2 font-display text-[2.1rem] leading-[1.15] tracking-tight sm:text-[3.2rem] lg:text-[4.2rem]">
            {moments.map((m, i) => (
              <Reveal as="li" key={m} delay={i * 0.05} className={i % 2 ? "italic text-brass sm:pl-[12%]" : undefined}>
                {m}
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="services" aria-labelledby="events-services" className="on-dark grain scroll-mt-24 bg-ink py-20 text-ivory sm:py-28 lg:py-32">
        <Container>
          <SectionHeading
            id="events-services"
            index="01"
            eyebrow="Services"
            dark
            title="Planning, production and the memories that stay."
            intro="Every part of the celebration, coordinated as one."
          />
          <div className="mt-16">
            <ServiceGroups groups={venture.serviceGroups} dark layout="rows" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="events-process" className="bg-paper py-20 sm:py-28 lg:py-32">
        <Container>
          <SectionHeading id="events-process" index="02" eyebrow="Process" title={venture.processTitle} />
          <div className="mt-16">
            <ProcessFlow steps={venture.process} />
          </div>
        </Container>
      </section>

      <VentureCta venture={venture} tone="ink" />
      <ChapterNav current={venture.slug} />
    </>
  );
}
