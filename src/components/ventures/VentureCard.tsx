import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Venture } from "@/content/ventures";
import { ventureHref } from "@/content/ventures";
import { cn } from "@/lib/cn";
import { VentureVisual } from "./VentureVisual";

type VentureCardProps = {
  venture: Venture;
  headingLevel?: "h2" | "h3";
  className?: string;
  aspect?: "portrait" | "landscape";
};

/**
 * Whole card is a single link (no nested controls).
 * Hover/focus: art crop shifts, accent line extends, descriptor reveals.
 * Touch / no-hover devices: descriptor is always visible.
 */
export function VentureCard({ venture, headingLevel: H = "h3", className, aspect = "portrait" }: VentureCardProps) {
  return (
    <Link href={ventureHref(venture.slug)} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-stone", aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/11]")}>
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-hover:-translate-y-1 group-focus-visible:scale-[1.045]">
          <VentureVisual venture={venture} />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-5 pt-16 text-ivory transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:opacity-100">
          <p className="text-[0.92rem] leading-snug">{venture.descriptor}</p>
        </div>
        <span className="eyebrow absolute left-5 top-5 rounded-full bg-paper/90 px-3 py-1.5 text-ink">
          {venture.number} — {venture.chapter}
        </span>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <H className="font-display text-[1.75rem] leading-tight tracking-tight sm:text-[2rem]">
            {venture.label}
          </H>
          <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-muted">{venture.summary}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:border-teal group-hover:bg-teal group-hover:text-ivory"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <span aria-hidden="true" className="mt-6 block h-px w-12 bg-teal transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
