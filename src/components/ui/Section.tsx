import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "paper" | "ivory" | "ink" | "stone";

const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  ivory: "bg-ivory text-ink",
  stone: "bg-stone text-ink",
  ink: "on-dark grain bg-ink text-ivory",
};

type SectionProps = {
  tone?: Tone;
  id?: string;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
};

export function Section({ tone = "paper", id, className, labelledBy, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(toneClass[tone], "py-20 sm:py-28 lg:py-36", className)}>
      {children}
    </section>
  );
}
