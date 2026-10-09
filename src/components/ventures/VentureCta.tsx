import type { Venture } from "@/content/ventures";
import { mailtoHref, site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { AnchorButton, ButtonLink } from "@/components/ui/Button";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/cn";

export function VentureCta({ venture, tone = "teal" }: { venture: Venture; tone?: "teal" | "ink" }) {
  return (
    <section
      aria-labelledby={`${venture.slug}-cta`}
      className={cn("py-20 text-ivory sm:py-28", tone === "teal" ? "on-teal bg-teal" : "on-dark grain bg-ink")}
    >
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow text-ivory/70">{venture.label}</p>
          <h2 id={`${venture.slug}-cta`} className="display-md mt-6 max-w-3xl">
            {venture.ctaTitle}
          </h2>
          <p className="lede mt-6 max-w-2xl text-ivory/80">{venture.ctaBody}</p>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
          <ButtonLink href={`/contact?topic=${encodeURIComponent(venture.enquiryTopic)}`} variant="light">
            Send an enquiry
          </ButtonLink>
          <AnchorButton
            href={mailtoHref(`${venture.enquiryTopic} enquiry`)}
            variant="ghost-dark"
            icon={<Mail aria-hidden="true" className="size-4" />}
          >
            Email directly
          </AnchorButton>
          <AnchorButton href={site.contact.phoneHref} variant="ghost-dark" icon={<Phone aria-hidden="true" className="size-4" />}>
            {site.contact.phoneDisplay}
          </AnchorButton>
        </div>
      </Container>
    </section>
  );
}
