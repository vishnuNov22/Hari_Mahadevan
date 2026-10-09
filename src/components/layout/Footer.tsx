import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { mainNav, site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <footer className="on-dark grain bg-ink text-ivory">
      <Container className="pt-20 sm:pt-28">
        {/* Final enquiry CTA */}
        <div className="grid gap-10 border-b border-line-dark pb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-brass-soft">Start a conversation</p>
            <p className="display-lg mt-6">
              Let’s Connect. <span className="italic text-brass-soft">Let’s Grow.</span> Let’s Create.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link
              href="/contact"
              className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-ivory px-7 text-[1rem] font-semibold text-ink transition-colors hover:bg-brass-soft"
            >
              Describe your requirement
              <ArrowUpRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-3xl tracking-tight">{site.name}</p>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-dark">
              {site.positioning.join(" ")}
            </p>
          </div>

          <nav aria-label="Ventures" className="lg:col-span-3">
            <p className="eyebrow text-muted-dark">Ventures</p>
            <ul className="mt-5 grid gap-1">
              {ventures.map((v) => (
                <li key={v.slug}>
                  <Link href={ventureHref(v.slug)} className="link-underline inline-flex min-h-10 items-center text-[0.95rem] text-ivory/85 hover:text-ivory">
                    {v.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site" className="lg:col-span-2">
            <p className="eyebrow text-muted-dark">Explore</p>
            <ul className="mt-5 grid gap-1">
              {[{ label: "Home", href: "/" }, ...mainNav].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline inline-flex min-h-10 items-center text-[0.95rem] text-ivory/85 hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="eyebrow text-muted-dark">Contact</p>
            <ul className="mt-5 grid gap-1 text-[0.95rem]">
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex min-h-10 items-center gap-2 break-all text-ivory/85 hover:text-ivory">
                  <Mail aria-hidden="true" className="size-4 shrink-0 text-brass-soft" />
                  Email Hari
                </a>
              </li>
              <li>
                <a href={site.contact.phoneHref} className="inline-flex min-h-10 items-center gap-2 text-ivory/85 hover:text-ivory">
                  <Phone aria-hidden="true" className="size-4 shrink-0 text-brass-soft" />
                  {site.contact.phoneDisplay}
                </a>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-ivory/85 hover:text-ivory">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line-dark py-8 text-[0.82rem] text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {site.name}. All rights reserved.
            <span className="block text-[0.75rem] text-muted-dark/70 sm:inline sm:pl-3">Venture photography: Unsplash (illustrative, not client work).</span>
          </p>
          <p className="flex gap-6">
            <Link href="/privacy" className="link-underline hover:text-ivory">
              Privacy notice
            </Link>
            <a href="#top" className="link-underline hover:text-ivory">
              Back to top
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
