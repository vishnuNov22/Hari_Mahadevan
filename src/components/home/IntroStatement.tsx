import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function IntroStatement() {
  return (
    <section aria-labelledby="intro-title" className="bg-paper py-20 sm:py-28 lg:py-36">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="eyebrow flex items-center gap-4 text-teal">
            <span aria-hidden="true">00</span>
            <span aria-hidden="true" className="h-px w-10 bg-teal/50" />
            <span>A founder’s perspective</span>
          </p>
        </div>
        <Reveal className="lg:col-span-9">
          <h2 id="intro-title" className="sr-only">
            Founder perspective
          </h2>
          <p className="display-md max-w-5xl">
            “My goal is to turn ideas into opportunities by combining{" "}
            <em className="text-teal">creativity</em>, <em className="text-teal">business strategy</em>, and{" "}
            <em className="text-teal">client-focused solutions</em>.”
          </p>
          <p className="mt-8 flex items-center gap-4 text-[0.95rem] text-muted">
            <span aria-hidden="true" className="h-px w-8 bg-brass" />
            Hari Mahadevan
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
