import { about } from "@/content/about";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Trust section: principles only — no invented testimonials, ratings, logos or counts. */
export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="bg-paper py-20 sm:py-28 lg:py-36">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="principles-title"
              index="04"
              eyebrow="Why work with me"
              title="What you can expect, every time."
            />
          </div>
        </div>
        <ol className="lg:col-span-7">
          {about.whyWorkWithMe.map((item, i) => (
            <Reveal as="li" key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-8 last:border-b sm:grid-cols-[5rem_1fr]">
              <span className="font-display text-2xl italic text-brass">0{i + 1}</span>
              <div>
                <h3 className="text-[1.15rem] font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-[1.02rem] leading-relaxed text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
