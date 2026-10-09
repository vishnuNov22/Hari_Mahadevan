import Image from "next/image";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "About",
  description:
    "About Hari Mahadevan — an entrepreneur working across digital marketing, event management, real estate and financial services. Vision, mission and the way he works.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      {/* Editorial opener */}
      <section aria-labelledby="about-title" className="bg-paper pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-36">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-teal">
              <span aria-hidden="true" className="h-px w-10 bg-teal/50" />
              About Hari
            </p>
            <h1 id="about-title" className="display-lg mt-8">
              An entrepreneur who <span className="italic text-teal">connects</span> ideas, people and opportunity.
            </h1>
            <p className="mt-6 text-[0.95rem] text-muted">{site.roles.join(" · ")}</p>

            <div className="rule mt-12 max-w-2xl" />
            <p className="mt-10 max-w-[62ch] font-display text-[1.35rem] leading-[1.6] tracking-tight sm:text-[1.55rem]">
              <span className="float-left mr-3 mt-1 font-display text-[4.4rem] leading-[0.8] text-brass">I</span>
              {about.bio.slice(1)}
            </p>
          </div>

          <div className="lg:col-span-5">
            <figure className="relative mx-auto max-w-[440px] lg:sticky lg:top-28">
              <div className="relative aspect-[714/1280] max-h-[78vh] w-full overflow-hidden bg-stone">
                <Image
                  src={site.portrait.full}
                  alt={site.portrait.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 440px, 90vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-4 flex justify-between text-[0.8rem] text-muted">
                <span className="eyebrow">{site.name}</span>
                <span>Founder</span>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* Vision / mission — dark interlude */}
      <section aria-labelledby="vision-title" className="on-dark grain bg-ink py-20 text-ivory sm:py-28 lg:py-32">
        <Container>
          <h2 id="vision-title" className="sr-only">
            Vision and mission
          </h2>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <p className="eyebrow text-brass-soft">Vision</p>
              <p className="mt-6 font-display text-[1.7rem] leading-snug tracking-tight sm:text-[2.2rem]">
                {about.vision}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:mt-24">
              <p className="eyebrow text-brass-soft">Mission</p>
              <p className="mt-6 font-display text-[1.7rem] leading-snug tracking-tight sm:text-[2.2rem]">
                {about.mission}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Approach sequence */}
      <section aria-labelledby="approach-title" className="bg-ivory py-20 sm:py-28 lg:py-36">
        <Container>
          <SectionHeading id="approach-title" index="01" eyebrow="How I approach work" title="Four steps, the same every time." />
          <ol className="mt-16 border-t border-line">
            {about.approach.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                className="grid gap-4 border-b border-line py-8 sm:grid-cols-[6rem_1fr_1.2fr] sm:items-baseline sm:gap-10 sm:py-10"
              >
                <span className="font-display text-4xl italic text-brass">0{i + 1}</span>
                <h3 className="font-display text-[1.7rem] leading-tight tracking-tight">{step.title}</h3>
                <p className="text-[1.02rem] leading-relaxed text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="bg-paper py-20 sm:py-28 lg:py-36">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="principles-title" index="02" eyebrow="Operating principles" title="Why people work with me." />
          </div>
          <ul className="grid gap-px self-start border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {about.whyWorkWithMe.map((item, i) => (
              <li key={item.title} className={i === 0 ? "bg-ivory p-8 sm:col-span-2" : "bg-paper p-8"}>
                <p className="eyebrow text-teal">{item.title}</p>
                <p className="mt-4 text-[1.1rem] leading-relaxed">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Ventures routing */}
      <section aria-labelledby="about-ventures" className="bg-stone py-20 sm:py-28">
        <Container>
          <h2 id="about-ventures" className="display-md max-w-3xl">
            Where this work shows up.
          </h2>
          <ul className="mt-12 border-t border-ink/15">
            {ventures.map((v) => (
              <li key={v.slug} className="border-b border-ink/15">
                <Link href={ventureHref(v.slug)} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[5rem_1fr_1fr_auto]">
                  <span className="eyebrow text-muted">{v.number}</span>
                  <span className="font-display text-[1.5rem] leading-tight tracking-tight transition-colors group-hover:text-teal sm:text-[1.9rem]">
                    {v.label}
                  </span>
                  <span className="hidden text-[0.95rem] text-muted sm:block">{v.descriptor}</span>
                  <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <ButtonLink href="/contact">Start a conversation</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
