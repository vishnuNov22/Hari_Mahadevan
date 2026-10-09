import Link from "next/link";
import { site } from "@/content/site";

export function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group inline-flex items-center gap-3 rounded-sm"
      aria-label={`${site.name} — home`}
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-full border border-brass-soft/60 font-display text-[0.95rem] italic text-brass-soft transition-colors duration-300 group-hover:bg-brass-soft group-hover:text-ink"
      >
        HM
      </span>
      <span className="font-display text-[1.2rem] leading-none tracking-tight">
        {site.name}
      </span>
    </Link>
  );
}
