"use client";

/** Renders the visitor's current year so the copyright never goes stale between builds. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
