"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "./Wordmark";
import { MobileNavigation } from "./MobileNavigation";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="on-dark sticky top-0 z-40 border-b border-line-dark bg-ink text-ivory">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav
              .filter((item) => item.href !== "/contact")
              .map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center px-4 text-[0.92rem] transition-colors duration-200",
                        active ? "text-ivory" : "text-muted-dark hover:text-ivory",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-4 bottom-2 h-px origin-left bg-brass-soft transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            aria-current={isActive(pathname, "/contact") ? "page" : undefined}
            className="hidden min-h-11 items-center rounded-full bg-ivory px-5 text-[0.9rem] font-semibold text-ink transition-colors duration-200 hover:bg-brass-soft sm:inline-flex"
          >
            Start a conversation
          </Link>
          <MobileNavigation pathname={pathname} />
        </div>
      </Container>
    </header>
  );
}
