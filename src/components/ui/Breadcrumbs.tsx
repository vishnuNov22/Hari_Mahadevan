import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { JsonLd } from "./JsonLd";

type Crumb = { label: string; href: string };

export function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${site.url}${c.href === "/" ? "" : c.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={ld} />
      <ol className={cn("flex flex-wrap items-center gap-2 text-[0.82rem]", dark ? "text-muted-dark" : "text-muted")}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? "text-ivory" : "text-ink"}>
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="link-underline hover:text-current">
                  {c.label}
                </Link>
              )}
              {!last ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
