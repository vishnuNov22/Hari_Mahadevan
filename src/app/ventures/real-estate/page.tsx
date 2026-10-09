import { Building2, Home, KeyRound, Store } from "lucide-react";
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

const venture = getVenture("real-estate");

export const metadata = buildMetadata({
  title: "Real Estate — ADS Real Estate",
  description:
    "Residential and commercial property sales, land and house listings, rental assistance, property marketing and buyer/seller support from ADS Real Estate.",
  path: "/ventures/real-estate",
});

const categories = [
  { icon: KeyRound, title: "For sale", body: "Houses, land and commercial spaces offered for purchase." },
  { icon: Home, title: "For rent", body: "Help finding — or letting — homes and spaces to rent." },
  { icon: Building2, title: "Residential", body: "Homes for families, individuals and investors." },
  { icon: Store, title: "Commercial", body: "Shops, offices and spaces for businesses." },
];

export default function RealEstatePage() {
  return (
    <>
      <VentureHero
        venture={venture}
        composition="panorama"
        aside={
          <dl className="grid grid-cols-2 gap-px border border-line bg-line text-[0.9rem]">
            {["Sale", "Rent", "Residential", "Commercial"].map((k) => (
              <div key={k} className="bg-paper p-4">
                <dt className="eyebrow text-muted">Category</dt>
                <dd className="mt-1 font-display text-[1.25rem]">{k}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section aria-labelledby="re-categories" className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading id="re-categories" index="01" eyebrow="Categories" title="Sale, rent, residential, commercial." />
          <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={i * 0.05} className="bg-paper p-8">
                <Icon aria-hidden="true" className="size-6 text-teal" strokeWidth={1.5} />
                <h3 className="mt-8 font-display text-[1.6rem] tracking-tight">{title}</h3>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="services" aria-labelledby="re-services" className="scroll-mt-24 bg-stone py-20 sm:py-28 lg:py-32">
        <Container>
          <SectionHeading id="re-services" index="02" eyebrow="Services" title="Support on both sides of the move." />
          <div className="mt-16">
            <ServiceGroups groups={venture.serviceGroups} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="re-listings" className="bg-paper py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="re-listings" index="03" eyebrow="Listings" title="Current properties" />
          </div>
          <Reveal className="lg:col-span-7">
            <div className="border border-dashed border-ink/25 p-8 sm:p-10">
              <p className="lede">Property listings will be published here once owners approve them, with real photographs and accurate details.</p>
              <p className="mt-4 text-[0.97rem] leading-relaxed text-muted">
                Until then, tell us what you are looking for — type, location and budget — or what you would like to list, and we will reply directly.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="re-process" className="on-dark grain bg-ink py-20 text-ivory sm:py-28">
        <Container>
          <SectionHeading id="re-process" index="04" eyebrow="Process" title={venture.processTitle} dark />
          <div className="mt-16">
            <ProcessFlow steps={venture.process} dark />
          </div>
        </Container>
      </section>

      <VentureCta venture={venture} />
      <ChapterNav current={venture.slug} />
    </>
  );
}
