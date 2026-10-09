import type { ServiceGroup } from "@/content/ventures";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

type ServiceGroupsProps = {
  groups: ServiceGroup[];
  dark?: boolean;
  layout?: "columns" | "rows";
};

export function ServiceGroups({ groups, dark = false, layout = "columns" }: ServiceGroupsProps) {
  if (layout === "rows") {
    return (
      <div className={cn("border-t", dark ? "border-line-dark" : "border-line")}>
        {groups.map((g, i) => (
          <Reveal
            key={g.title}
            className={cn("grid gap-6 border-b py-10 lg:grid-cols-12 lg:gap-10", dark ? "border-line-dark" : "border-line")}
          >
            <div className="lg:col-span-5">
              <p className={cn("eyebrow", dark ? "text-brass-soft" : "text-teal")}>0{i + 1}</p>
              <h3 className="mt-3 font-display text-[2rem] leading-tight tracking-tight">{g.title}</h3>
              <p className={cn("mt-3 max-w-md text-[1rem] leading-relaxed", dark ? "text-muted-dark" : "text-muted")}>{g.description}</p>
            </div>
            <ul className="flex flex-wrap content-start gap-2 lg:col-span-7 lg:justify-end">
              {g.services.map((s) => (
                <li
                  key={s}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[0.95rem]",
                    dark ? "border-line-dark text-ivory/90" : "border-ink/15 bg-paper",
                  )}
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-px border", dark ? "border-line-dark bg-line-dark" : "border-line bg-line", groups.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
      {groups.map((g, i) => (
        <Reveal key={g.title} delay={i * 0.06} className={cn("flex flex-col p-8 sm:p-10", dark ? "bg-ink" : "bg-paper")}>
          <p className={cn("eyebrow", dark ? "text-brass-soft" : "text-teal")}>
            0{i + 1} — {g.title}
          </p>
          <p className={cn("mt-4 text-[1rem] leading-relaxed", dark ? "text-muted-dark" : "text-muted")}>{g.description}</p>
          <ul className="mt-8 grid gap-3">
            {g.services.map((s) => (
              <li key={s} className="flex items-baseline gap-3 font-display text-[1.35rem] leading-snug tracking-tight">
                <span aria-hidden="true" className={cn("h-px w-4 shrink-0 translate-y-[-0.3em]", dark ? "bg-brass-soft" : "bg-brass")} />
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
