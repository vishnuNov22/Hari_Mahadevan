"use client";

import { useId, useRef, type ReactNode } from "react";

/**
 * Liquid displacement on hover: an SVG turbulence field drives
 * feDisplacementMap. The filter is attached only while the pointer is over the
 * image (zero cost otherwise) and its strength eases in/out with rAF.
 * Desktop/fine pointers only; reduced motion → never applied.
 */
export function LiquidImage({ children, className }: { children: ReactNode; className?: string }) {
  const id = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const state = useRef({ target: 0, value: 0, frame: 0, t: 0 });

  const allowed = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = () => {
    const s = state.current;
    s.value += (s.target - s.value) * 0.08;
    s.t += 0.01;
    disp.current?.setAttribute("scale", s.value.toFixed(2));
    turb.current?.setAttribute("baseFrequency", `${(0.008 + Math.sin(s.t) * 0.002).toFixed(4)} ${(0.012 + Math.cos(s.t) * 0.003).toFixed(4)}`);
    if (Math.abs(s.target - s.value) < 0.05 && s.target === 0) {
      s.frame = 0;
      if (wrap.current) wrap.current.style.filter = "";
      return;
    }
    s.frame = requestAnimationFrame(run);
  };

  const enter = () => {
    if (!allowed() || !wrap.current) return;
    wrap.current.style.filter = `url(#${id})`;
    state.current.target = 26;
    if (!state.current.frame) state.current.frame = requestAnimationFrame(run);
  };
  const leave = () => {
    state.current.target = 0;
    if (!state.current.frame) state.current.frame = requestAnimationFrame(run);
  };

  return (
    <div ref={wrap} className={className} onPointerEnter={enter} onPointerLeave={leave}>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {children}
    </div>
  );
}
