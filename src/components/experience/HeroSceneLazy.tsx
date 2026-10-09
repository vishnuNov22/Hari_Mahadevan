"use client";

import dynamic from "next/dynamic";

/** Code-split: the WebGL bundle loads after the page is interactive and never on the server. */
export const HeroSceneLazy = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });
