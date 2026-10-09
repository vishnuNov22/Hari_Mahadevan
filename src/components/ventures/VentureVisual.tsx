import Image from "next/image";
import type { Venture } from "@/content/ventures";
import { cn } from "@/lib/cn";

const grade: Record<string, string> = {
  digital: "bg-v-digital",
  events: "bg-v-events",
  "real-estate": "bg-v-property",
  "financial-solutions": "bg-v-financial",
};

/**
 * Unsplash's own image CDN does the resizing/format negotiation, so these load
 * directly (no dependency on the host's image optimiser or its quotas).
 */
export function unsplashSized(src: string, w = 1600) {
  if (!src.includes("images.unsplash.com")) return src;
  return `${src}?auto=format&fit=crop&w=${w}&q=78`;
}

/**
 * Venture photograph with a consistent filmic grade:
 * slight desaturation + contrast, a venture-colour soft-light wash,
 * a shadow gradient for type, and a whisper of grain.
 */
export function VentureVisual({
  venture,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  className,
}: {
  venture: Venture;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-ink-3", className)}>
      <Image
        src={unsplashSized(venture.photo.src)}
        alt={venture.photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="object-cover [filter:saturate(0.85)_contrast(1.08)_brightness(0.92)]"
        style={{ objectPosition: venture.photo.focus ?? "50% 50%" }}
      />
      <div aria-hidden="true" className={cn("absolute inset-0 opacity-30 mix-blend-soft-light", grade[venture.slug])} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_40%,rgba(10,14,26,0.55)_100%)]" />
      <div aria-hidden="true" className="grain absolute inset-0" />
    </div>
  );
}
