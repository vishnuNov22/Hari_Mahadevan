"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { mainNav, site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";
import { cn } from "@/lib/cn";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // Close when the route changes (e.g. browser back).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll lock, Escape, focus trap.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (!firstItem || !lastItem) return;
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) close(false);
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close() : setOpen(true))}
        className="relative z-[60] grid size-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-ivory"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>

      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="on-dark grain fixed inset-0 z-50 overflow-y-auto bg-ink text-ivory"
      >
        <div className="flex min-h-full flex-col px-5 pb-10 pt-24 sm:px-8">
          <nav aria-label="Mobile">
            <ul className="border-t border-line-dark">
              {mainNav.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href} className="border-b border-line-dark">
                    <Link
                      href={item.href}
                      onClick={() => close(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className={cn("display-md", active && "italic text-brass-soft")}>{item.label}</span>
                      <span aria-hidden="true" className="eyebrow text-muted-dark">
                        0{i + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className="eyebrow mt-10 text-muted-dark">Ventures</p>
          <ul className="mt-4 grid gap-1">
            {ventures.map((v) => (
              <li key={v.slug}>
                <Link
                  href={ventureHref(v.slug)}
                  onClick={() => close(false)}
                  className="inline-flex min-h-11 items-center text-[1rem] text-ivory/85 hover:text-ivory"
                >
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10 text-[0.95rem] text-muted-dark">
            <a className="block py-2 hover:text-ivory" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
            <a className="block py-2 hover:text-ivory" href={site.contact.phoneHref}>
              {site.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
