import type { VentureSlug } from "./ventures";

/**
 * Approved showcase data ONLY.
 * Add a project here once Hari supplies the details and approves publication.
 * Never add invented clients, results or images.
 */
export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  category: VentureSlug;
  summary: string;
  role: string;
  deliverables: string[];
  images: ProjectImage[];
  /** Only real, verifiable outcomes. Leave undefined if none are approved. */
  results?: string[];
  year?: string;
};

export const projects: Project[] = [];

/** Categories shown in the showcase framework while real projects are gathered. */
export const showcaseCategories: { slug: VentureSlug; label: string; expects: string }[] = [
  { slug: "digital", label: "Campaigns & digital", expects: "Brand campaigns, social content, websites, design and video." },
  { slug: "events", label: "Events & weddings", expects: "Celebration galleries, décor and production stories." },
  { slug: "real-estate", label: "Property", expects: "Approved listings and property marketing work." },
  { slug: "financial-solutions", label: "Financial awareness", expects: "Educational sessions and plain-language guides." },
];
