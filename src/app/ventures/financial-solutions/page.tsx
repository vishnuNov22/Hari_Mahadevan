import { Info } from "lucide-react";
import { financialDisclaimer, getVenture } from "@/content/ventures";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VentureHero } from "@/components/ventures/VentureHero";
import { ServiceGroups } from "@/components/ventures/ServiceGroups";
import { ProcessFlow } from "@/components/ventures/ProcessFlow";
import { VentureCta } from "@/components/ventures/VentureCta";
import { ChapterNav } from "@/components/ventures/ChapterNav";

const venture = getVenture("financial-solutions");

export const metadata = buildMetadata({
  title: "Financial Solutions — Life Insurance & Protection Information",
  description:
    "Plain-language information on life insurance, investment-linked insurance, financial protection options and applicable loan services. General information only — not financial advice.",
  path: "/ventures/financial-solutions",
});

const explainers = [
  {
    q: "What is life insurance, in simple terms?",
    a: "A contract where you pay premiums and, if the insured person dies during the policy term, the insurer pays an agreed amount to the people you name. It is mainly about protecting dependants, not about growing money.",
  },
  {
    q: "What is investment-linked insurance?",
    a: "A policy that combines life cover with an investment component. Its value can go up or down with the market, charges apply, and there are usually lock-in periods. Read the product documents carefully and ask the insurer about every charge.",
  },
  {
    q: "How do I know which option suits me?",
    a: "It depends on your income, dependants, existing cover, goals and time horizon. A conversation can help you organise those questions — the final decision, and checking the terms with the institution, stays with you.",
  },
  {
    q: "Can you guarantee a loan or a return?",
    a: "No. Loan approval depends on eligibility and the lending institution’s terms, and returns on any market-linked product are not guaranteed. Anyone who promises otherwise should be questioned.",
  },
];

export default function FinancialPage() {
  return (
    <>
      <VentureHero venture={venture} composition="calm" />

      {/* Disclosure first — visible before any service detail */}
      <section aria-labelledby="fin-disclosure" className="border-y border-teal/20 bg-[#e3ebe7]">
        <Container className="flex gap-4 py-8">
          <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-teal" />
          <div>
            <h2 id="fin-disclosure" className="text-[0.95rem] font-semibold">
              Important — please read
            </h2>
            <p className="mt-2 max-w-4xl text-[0.95rem] leading-relaxed text-ink/80">{financialDisclaimer}</p>
          </div>
        </Container>
      </section>

      <section id="services" aria-labelledby="fin-services" className="scroll-mt-24 bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="fin-services"
            index="01"
            eyebrow="What we can talk about"
            title="Information, explained clearly."
            intro="No jargon, no pressure, and no promises about returns or approvals."
          />
          <div className="mt-16">
            <ServiceGroups groups={venture.serviceGroups} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="fin-explainers" className="bg-[#eef2ef] py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="fin-explainers" index="02" eyebrow="Plain language" title="Common questions." />
          </div>
          <div className="border-b border-teal/20 lg:col-span-8">
            {explainers.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.04}>
                <details className="group border-t border-teal/20 py-6 open:pb-8">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-[1.3rem] leading-snug tracking-tight sm:text-[1.5rem] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-teal/30 text-teal transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="fin-process" className="bg-paper py-20 sm:py-28">
        <Container>
          <SectionHeading id="fin-process" index="03" eyebrow="Process" title={venture.processTitle} />
          <div className="mt-16">
            <ProcessFlow steps={venture.process} />
          </div>
        </Container>
      </section>

      <VentureCta venture={venture} />
      <ChapterNav current={venture.slug} />
    </>
  );
}
