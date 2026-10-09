import type { CSSProperties, ElementType } from "react";
import { cn } from "@/lib/cn";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  by?: "word" | "char";
  /** ms before the first unit starts */
  delay?: number;
  /** ms between units */
  step?: number;
  className?: string;
  unitClassName?: string;
  id?: string;
};

/**
 * Kinetic split-text reveal, server-rendered and CSS-driven.
 * Each word/character rises out of its own mask with a stagger.
 * The real text stays in the DOM (readable, selectable, indexable); the
 * animation is transform-only, so there is no layout shift, and it is
 * disabled under prefers-reduced-motion.
 */
export function SplitText({ text, as: Tag = "span", by = "word", delay = 0, step, className, unitClassName, id }: SplitTextProps) {
  const words = text.split(" ");
  let i = 0;
  const style = { "--kt-base": `${delay}ms`, "--kt-step": `${step ?? (by === "char" ? 35 : 70)}ms` } as CSSProperties;

  return (
    <Tag id={id} className={className} style={style}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="whitespace-nowrap">
          {by === "char" ? (
            word.split("").map((ch, c) => (
              <span key={c} className="kt-mask">
                <span className={cn("kt-unit", unitClassName)} style={{ "--i": i++ } as CSSProperties}>
                  {ch}
                </span>
              </span>
            ))
          ) : (
            <span className="kt-mask">
              <span className={cn("kt-unit", unitClassName)} style={{ "--i": i++ } as CSSProperties}>
                {word}
              </span>
            </span>
          )}
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
