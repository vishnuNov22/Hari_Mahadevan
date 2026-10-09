"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-paper py-28 sm:py-40">
      <Container>
        <p className="eyebrow text-teal">Something went wrong</p>
        <h1 className="display-lg mt-6 max-w-3xl">This page didn’t load properly.</h1>
        <p className="lede mt-6 max-w-xl text-muted">Please try again. If it keeps happening, you can still reach Hari directly from the contact page.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => reset()}>Try again</Button>
          <ButtonLink href="/contact" variant="secondary">
            Contact page
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
