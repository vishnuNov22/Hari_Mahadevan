import type { Metadata } from "next";
import { site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";
import { HeroStory } from "@/components/home/HeroStory";
import { IntroStatement } from "@/components/home/IntroStatement";
import { FourChapters } from "@/components/home/FourChapters";
import { Founder } from "@/components/home/Founder";
import { MethodRail } from "@/components/home/MethodRail";
import { MotionReel } from "@/components/home/MotionReel";
import { Capabilities } from "@/components/home/Capabilities";
import { WorkPreview } from "@/components/home/WorkPreview";
import { Principles } from "@/components/home/Principles";
import { ClosingCta } from "@/components/home/ClosingCta";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Entrepreneur",
    description: site.description,
    url: site.url,
    image: `${site.url}${site.portrait.hero}`,
    email: `mailto:${site.contact.email}`,
    telephone: "+919489672128",
    knowsAbout: ["Digital marketing", "Event management", "Real estate", "Life insurance information"],
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    hasPart: ventures.map((v) => ({ "@type": "WebPage", name: v.label, url: `${site.url}${ventureHref(v.slug)}` })),
  };

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />
      <HeroStory />
      <IntroStatement />
      <FourChapters />
      <Founder />
      <MotionReel />
      <Capabilities />
      <MethodRail />
      <WorkPreview />
      <Principles />
      <ClosingCta />
    </>
  );
}
