import type { ProcessStep } from "@/content/ventures";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessFlow({ steps, dark = false }: { steps: ProcessStep[]; dark?: boolean }) {
  return (
    <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 0.07} className="relative">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-full border font-display text-lg italic",
                dark ? "border-brass-soft/60 text-brass-soft" : "border-teal/40 text-teal",
              )}
            >
              {i + 1}
            </span>
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className={cn("hidden h-px flex-1 lg:block", dark ? "bg-line-dark" : "bg-line")} />
            ) : null}
          </div>
          <h3 className="mt-6 text-[1.15rem] font-semibold tracking-tight">{step.title}</h3>
          <p className={cn("mt-2 text-[0.98rem] leading-relaxed", dark ? "text-muted-dark" : "text-muted")}>{step.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}
