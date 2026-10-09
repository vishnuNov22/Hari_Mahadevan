import type { CSSProperties } from "react";
import { ventures } from "@/content/ventures";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VentureCard } from "@/components/ventures/VentureCard";
import { ClosingCta } from "@/components/home/ClosingCta";

export const metadata = buildMetadata({
  title: "Ventures",
  description:
    "ADS Digitals & Advertisements, ADS Events, ADS Real Estate and Financial Solutions — the four ventures led by Hari Mahadevan.",
  path: "/ventures",
});

export default function VenturesPage() {
  return (
    <>
      <section aria-labelledby="ventures-title" className="on-dark grain bg-ink text-ivory">
        <Container className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Ventures", href: "/ventures" }]} dark />
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 id="ventures-title" className="display-xl anim-rise lg:col-span-8">
              Four <span className="italic text-brass-soft">worlds.</span>
            </h1>
            <p className="lede anim-rise text-muted-dark lg:col-span-4" style={{ "--delay": "120ms" } as CSSProperties}>
              Digital marketing, events, property and financial services — different needs, one entrepreneurial mindset behind them.
            </p>
          </div>
        </Container>

        {/* Index table */}
        <Container>
          <ol className="border-t border-line-dark">
            {ventures.map((v) => (
              <li key={v.slug} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line-dark py-6 sm:grid-cols-[5rem_1.2fr_1fr]">
                <span className="eyebrow pt-1 text-brass-soft">{v.number}</span>
                <a href={`#${v.slug}`} className="font-display text-[1.5rem] leading-tight tracking-tight hover:text-brass-soft sm:text-[1.9rem]">
                  {v.label}
                </a>
                <p className="col-start-2 text-[0.95rem] text-muted-dark sm:col-start-3">{v.descriptor}</p>
              </li>
            ))}
          </ol>
          <div className="h-16 sm:h-24" />
        </Container>
      </section>

      <section aria-label="Venture chapters" className="bg-ivory py-20 sm:py-28">
        <Container>
          <ul className="grid gap-24">
            {ventures.map((v, i) => (
              <Reveal as="li" key={v.slug}>
                <div id={v.slug} className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
                  <div className={i % 2 ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                    <VentureCard venture={v} headingLevel="h2" aspect="landscape" />
                  </div>
                  <div className={i % 2 ? "lg:order-1 lg:col-span-5" : "lg:col-span-5"}>
                    <p className="eyebrow text-teal">{v.eyebrow}</p>
                    <p className="mt-5 font-display text-[1.6rem] leading-snug tracking-tight">{v.headline}</p>
                    <ul className="mt-6 grid gap-2 text-[0.98rem] text-muted">
                      {v.serviceGroups.map((g) => (
                        <li key={g.title} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-brass" />
                          <span>
                            <strong className="font-semibold text-ink">{g.title}:</strong> {g.services.join(", ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <ClosingCta />
    </>
  );
}
