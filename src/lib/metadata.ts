import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: PageMeta): Metadata {
  const url = path === "/" ? "/" : path;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.descriptor}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: ["/images/og.jpg"],
    },
  };
}
