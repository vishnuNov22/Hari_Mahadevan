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

const venture = getVenture("digital");

export const metadata = buildMetadata({
  title: "Digital Marketing — ADS Digitals & Advertisements",
  description:
    "Social media, digital advertising, websites, graphic design, video, motion graphics, SEO, content and brand promotion from ADS Digitals & Advertisements.",
  path: "/ventures/digital",
});

const channels = ["Social", "Search", "Web", "Video", "Display", "Content"];

export default function DigitalPage() {
  return (
    <>
      <VentureHero venture={venture} composition="split" />

      {/* Kinetic channel band */}
      <section aria-label="Channels" className="border-y border-line bg-paper">
        <Container>
          <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-8 font-display text-[1.6rem] tracking-tight sm:text-[2.4rem]">
            {channels.map((c, i) => (
              <li key={c} className={i % 2 ? "italic text-teal" : undefined}>
                {c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="services" aria-labelledby="digital-services" className="scroll-mt-24 bg-paper py-20 sm:py-28 lg:py-32">
        <Container>
          <SectionHeading
            id="digital-services"
            index="01"
            eyebrow="Services"
            title="Strategy, creative and delivery — in one place."
            intro="Grouped the way a campaign actually comes together, so it is clear who does what."
          />
          <div className="mt-16">
            <ServiceGroups groups={venture.serviceGroups} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="digital-process" className="on-dark grain bg-ink py-20 text-ivory sm:py-28 lg:py-32">
        <Container>
          <SectionHeading id="digital-process" index="02" eyebrow="Process" title={venture.processTitle} dark />
          <div className="mt-16">
            <ProcessFlow steps={venture.process} dark />
          </div>
        </Container>
      </section>

      <section aria-labelledby="digital-fit" className="bg-ivory py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="digital-fit" index="03" eyebrow="Who it’s for" title="Small and growing businesses." />
          </div>
          <Reveal className="lg:col-span-7">
            <p className="lede text-muted">
              If you run a small or medium business and need a stronger presence online — a website that works, social channels that stay active,
              design that looks consistent, or video that explains what you do — this is where to start. Bring a rough brief; shaping it is part
              of the work.
            </p>
          </Reveal>
        </Container>
      </section>

      <VentureCta venture={venture} />
      <ChapterNav current={venture.slug} />
    </>
  );
}
