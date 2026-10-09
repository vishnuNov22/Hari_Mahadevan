import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost-dark" | "light";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold tracking-tight transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-ivory hover:bg-[#0b4a47]",
  secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  "ghost-dark": "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
  light: "bg-ivory text-ink hover:bg-white",
};

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  icon?: boolean;
};

/** Internal navigation styled as a button. */
export function ButtonLink({ variant = "primary", className, children, icon = true, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      <span>{children}</span>
      {icon ? (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      ) : null}
    </Link>
  );
}

type AnchorButtonProps = ComponentProps<"a"> & { variant?: Variant; icon?: ReactNode };

/** mailto:, tel: and external links styled as a button. */
export function AnchorButton({ variant = "primary", className, children, icon, ...props }: AnchorButtonProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {icon}
      <span>{children}</span>
    </a>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
