export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-ivory px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>
  );
}
