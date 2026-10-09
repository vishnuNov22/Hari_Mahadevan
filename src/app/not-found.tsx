import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="on-dark grain bg-ink py-28 text-ivory sm:py-40">
      <Container>
        <p className="eyebrow text-brass-soft">Error 404</p>
        <h1 className="display-lg mt-6 max-w-3xl">
          This page has moved on — <span className="italic text-brass-soft">but you don’t have to.</span>
        </h1>
        <p className="lede mt-6 max-w-xl text-muted-dark">The link may be out of date. Try one of these instead.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="light">
            Back to home
          </ButtonLink>
          <ButtonLink href="/ventures" variant="ghost-dark">
            Explore the ventures
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
