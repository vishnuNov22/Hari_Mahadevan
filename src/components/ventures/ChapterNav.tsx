import Link from "next/link";
import { ventures, ventureHref, type VentureSlug } from "@/content/ventures";
import { Container } from "@/components/ui/Container";

/** Previous / next chapter navigation at the end of each venture page. */
export function ChapterNav({ current }: { current: VentureSlug }) {
  const index = ventures.findIndex((v) => v.slug === current);
  const prev = ventures[(index - 1 + ventures.length) % ventures.length];
  const next = ventures[(index + 1) % ventures.length];
  if (!prev || !next) return null;

  return (
    <nav aria-label="Other ventures" className="border-t border-line bg-paper">
      <Container className="grid sm:grid-cols-2">
        <Link href={ventureHref(prev.slug)} className="group flex flex-col gap-2 border-b border-line py-10 sm:border-b-0 sm:border-r sm:pr-10">
          <span className="eyebrow text-muted">← Previous chapter</span>
          <span className="font-display text-[1.6rem] leading-tight tracking-tight transition-colors group-hover:text-teal">
            {prev.label}
          </span>
        </Link>
        <Link href={ventureHref(next.slug)} className="group flex flex-col gap-2 py-10 sm:items-end sm:pl-10 sm:text-right">
          <span className="eyebrow text-muted">Next chapter →</span>
          <span className="font-display text-[1.6rem] leading-tight tracking-tight transition-colors group-hover:text-teal">
            {next.label}
          </span>
        </Link>
      </Container>
    </nav>
  );
}
