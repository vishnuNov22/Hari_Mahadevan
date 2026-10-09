import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  id?: string;
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  size?: "lg" | "md";
  className?: string;
  dark?: boolean;
};

/** Numbered chapter label + fine rule + display headline. */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  size = "md",
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <div className={cn("eyebrow flex items-center gap-4", dark ? "text-brass-soft" : "text-teal")}>
        {index ? <span aria-hidden="true">{index}</span> : null}
        {index ? <span aria-hidden="true" className={cn("h-px w-10", dark ? "bg-brass-soft/60" : "bg-teal/50")} /> : null}
        <span>{eyebrow}</span>
      </div>
      <Tag id={id} className={cn("mt-6", size === "lg" ? "display-lg" : "display-md")}>
        {title}
      </Tag>
      {intro ? (
        <div className={cn("lede mt-6 max-w-2xl", dark ? "text-muted-dark" : "text-muted")}>{intro}</div>
      ) : null}
    </div>
  );
}
