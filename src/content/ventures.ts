import type { EnquiryTopic } from "./site";

/**
 * Typed venture content. Service scopes come directly from the master
 * specification's venture content matrix. Descriptive sentences explain those
 * services in plain language; they make no claims about volume, clients,
 * results or years of experience.
 */

export type VentureSlug = "digital" | "events" | "real-estate" | "financial-solutions";
export type ArtVariant = VentureSlug;

export type ServiceGroup = {
  title: string;
  description: string;
  services: string[];
};

export type ProcessStep = { title: string; body: string };

export type VenturePhoto = {
  src: string;
  alt: string;
  /** Unsplash photo page — free to use under the Unsplash License. */
  credit: string;
  /** CSS object-position for art-directed cropping */
  focus?: string;
};

export type VentureClip = { src: string; poster: string };

export type Venture = {
  slug: VentureSlug;
  number: string;
  /** Public label used across the site. */
  label: string;
  /** Short one-word chapter name. */
  chapter: string;
  eyebrow: string;
  headline: string;
  summary: string;
  intro: string;
  /** Short line revealed on hover / focus in the venture index. */
  descriptor: string;
  tone: "light" | "dark";
  enquiryTopic: EnquiryTopic;
  serviceGroups: ServiceGroup[];
  process: ProcessStep[];
  processTitle: string;
  ctaTitle: string;
  ctaBody: string;
  photo: VenturePhoto;
  /** 3D motion study rendered from the site's lattice sculpture, tinted for this venture */
  clip: VentureClip;
};

export const ventures: Venture[] = [
  {
    slug: "digital",
    number: "01",
    label: "ADS Digitals & Advertisements",
    chapter: "Digital",
    eyebrow: "Chapter 01 — Digital marketing",
    headline: "Brands that are seen, remembered and chosen.",
    summary:
      "Social media, digital advertising, websites, design, video and content — planned together so every piece pulls in the same direction.",
    intro:
      "ADS Digitals & Advertisements brings strategy, creative production and digital delivery under one roof. The aim is simple: understand what your business needs to say, then make it visible in the places your audience already spends time.",
    descriptor: "Strategy, creative and delivery for growing brands",
    tone: "light",
    enquiryTopic: "Digital Marketing",
    serviceGroups: [
      {
        title: "Strategy",
        description: "Deciding what to say, where to say it and how to keep the brand consistent.",
        services: ["Social media marketing", "Brand promotion", "Content strategy"],
      },
      {
        title: "Creative",
        description: "The visual and written material that carries the message.",
        services: ["Graphic design", "Video production", "Motion graphics", "Content creation"],
      },
      {
        title: "Digital delivery",
        description: "The channels and platforms that put the work in front of people.",
        services: ["Digital advertising", "Website design & development", "Search engine optimisation (SEO)"],
      },
    ],
    processTitle: "From brief to live campaign",
    process: [
      { title: "Brief", body: "Your business, audience, goals and budget — clarified in plain terms." },
      { title: "Strategy", body: "Channels, messages and a realistic content rhythm agreed up front." },
      { title: "Create", body: "Design, video, motion and copy produced to one consistent standard." },
      { title: "Launch & refine", body: "Campaigns go live, are reviewed and adjusted as you learn what works." },
    ],
    ctaTitle: "Planning a launch, a refresh or a steady presence online?",
    ctaBody: "Share what your business does and where you want it to be seen.",
    clip: { src: "/media/digital.mp4", poster: "/media/digital-poster.jpg" },
    photo: {
      src: "https://images.unsplash.com/photo-1789922129938-f02af2785d19",
      alt: "Laptop and monitor glowing on a desk in a dark creative workspace",
      credit: "https://unsplash.com/photos/laptop-and-monitor-in-dark-workspace-EBCVK7UUaNY",
      focus: "50% 55%",
    },
  },
  {
    slug: "events",
    number: "02",
    label: "ADS Events",
    chapter: "Events",
    eyebrow: "Chapter 02 — Event management",
    headline: "Celebrations planned with care, remembered for years.",
    summary:
      "Weddings and private events — from planning and stage décor to catering, entertainment, photography and video.",
    intro:
      "ADS Events looks after the details so hosts can be present on the day. Planning, coordination, production and the photographs and films that keep the memory alive are handled as one connected experience.",
    descriptor: "Weddings, private events and the memories they leave",
    tone: "dark",
    enquiryTopic: "Event Management",
    serviceGroups: [
      {
        title: "Planning & coordination",
        description: "Turning an idea for the day into a schedule, a budget and a team.",
        services: ["Event planning", "Wedding planning", "Private events"],
      },
      {
        title: "Production",
        description: "The atmosphere guests walk into — and the hospitality that keeps them there.",
        services: ["Stage decoration", "Catering", "Entertainment"],
      },
      {
        title: "Memories",
        description: "Capturing the people, the light and the small moments.",
        services: ["Photography & videography", "Pre-wedding shoots"],
      },
    ],
    processTitle: "How a celebration comes together",
    process: [
      { title: "Listen", body: "The occasion, the guests, the feeling you want the day to have." },
      { title: "Plan", body: "Venue needs, décor direction, food, entertainment and timings mapped out." },
      { title: "Produce", body: "Vendors coordinated and the setting built so the day runs smoothly." },
      { title: "Remember", body: "Photographs and films that hold on to the day long after it ends." },
    ],
    ctaTitle: "Have a date in mind — or just an idea?",
    ctaBody: "Tell us about the occasion and we will talk through what it could look like.",
    clip: { src: "/media/events.mp4", poster: "/media/events-poster.jpg" },
    photo: {
      src: "https://images.unsplash.com/photo-1785336872920-4c345ff9d897",
      alt: "Wedding stage dressed with white flowers under dramatic spotlights",
      credit: "https://unsplash.com/photos/ornate-stage-with-white-floral-decorations-and-dramatic-spotlights-zDwZtHTlURk",
      focus: "50% 45%",
    },
  },
  {
    slug: "real-estate",
    number: "03",
    label: "ADS Real Estate",
    chapter: "Property",
    eyebrow: "Chapter 03 — Real estate",
    headline: "Finding the right place — and the right people for it.",
    summary:
      "Residential and commercial sales, land and house listings, rental assistance, property marketing and support for buyers and sellers.",
    intro:
      "ADS Real Estate helps people move with more clarity: buyers and tenants looking for the right space, and owners who want their property presented properly to the right audience.",
    descriptor: "Sale, rent, residential and commercial support",
    tone: "light",
    enquiryTopic: "Real Estate",
    serviceGroups: [
      {
        title: "For buyers & tenants",
        description: "Narrowing the search to options that fit your needs, budget and location.",
        services: ["Buyer support", "Rental assistance", "Residential property", "Commercial property"],
      },
      {
        title: "For owners & sellers",
        description: "Presenting a property clearly so it reaches serious enquiries.",
        services: ["Seller support", "Land & house listings", "Property marketing"],
      },
    ],
    processTitle: "A clearer way to move",
    process: [
      { title: "Requirement", body: "Buy, sell, rent or let — residential or commercial, and where." },
      { title: "Shortlist / prepare", body: "Suitable options identified, or your property prepared for marketing." },
      { title: "Visit & discuss", body: "Viewings, questions and conversations handled openly." },
      { title: "Next steps", body: "Support through to an agreement both sides are comfortable with." },
    ],
    ctaTitle: "Looking for a property — or ready to list one?",
    ctaBody: "Share the type of property, location and what you need. No listings are published here without the owner’s approval.",
    clip: { src: "/media/property.mp4", poster: "/media/property-poster.jpg" },
    photo: {
      src: "https://images.unsplash.com/photo-1748063578185-3d68121b11ff",
      alt: "Modern two-storey house with warm interior lights at dusk",
      credit: "https://unsplash.com/photos/modern-house-exterior-glows-with-lights-4vioYQ9Nn9Y",
      focus: "50% 50%",
    },
  },
  {
    slug: "financial-solutions",
    number: "04",
    label: "Financial Solutions",
    chapter: "Financial",
    eyebrow: "Chapter 04 — Financial services",
    headline: "Plain-language guidance on protecting what matters.",
    summary:
      "Information on life insurance, investment-linked insurance, financial protection options and applicable loan services.",
    intro:
      "Financial decisions deserve calm, clear conversations. This part of Hari’s work focuses on helping individuals and families understand life insurance and protection options, and on sharing information about applicable loan services — so you can ask better questions before you decide.",
    descriptor: "Life insurance, protection and loan-service information",
    tone: "light",
    enquiryTopic: "Financial Services",
    serviceGroups: [
      {
        title: "Life insurance information",
        description: "Understanding how life cover works and what to consider for your family.",
        services: ["Life insurance", "Investment-linked insurance"],
      },
      {
        title: "Financial protection",
        description: "Talking through protection options in relation to your situation.",
        services: ["Financial protection options"],
      },
      {
        title: "Loan-service information",
        description:
          "Information on applicable loan services. Availability is always subject to eligibility and the lending institution’s terms.",
        services: ["Applicable loan-service information"],
      },
    ],
    processTitle: "How a conversation works",
    process: [
      { title: "Understand", body: "Your situation and what you want to protect or plan for." },
      { title: "Explain", body: "Relevant options described in plain language, including their limits." },
      { title: "Verify", body: "You confirm product details, costs and terms with the institution." },
      { title: "Decide", body: "You choose — in your own time, with no pressure." },
    ],
    ctaTitle: "Have a question about insurance or protection?",
    ctaBody: "Ask it in your own words. You will get a clear answer — or an honest “check this with the institution”.",
    clip: { src: "/media/financial.mp4", poster: "/media/financial-poster.jpg" },
    photo: {
      src: "https://images.unsplash.com/photo-1756982477661-107a1c72c8fd",
      alt: "A family walking hand in hand along a tree-lined path at sunset",
      credit: "https://unsplash.com/photos/family-walking-on-path-with-trees-at-sunset-El0yVRiFbxs",
      focus: "50% 50%",
    },
  },
];

/**
 * The supplied brand label for the financial vertical is
 * "SBI Life Insurance & Financial Solutions". It stays hidden until Hari verifies
 * the exact relationship and approves the wording (see spec §08).
 */
export const financialInstitutionLabel = {
  supplied: "SBI Life Insurance & Financial Solutions",
  approvedForDisplay: false,
} as const;

export const financialDisclaimer =
  "The information on this page is general and educational. It is not financial, investment, insurance or legal advice, and it is not an offer of any product. This website is not an official website of any bank or insurer. Product features, premiums, returns, eligibility and loan terms are set by the relevant institution and can change — always confirm details directly with the institution and read the policy or loan documents before deciding. No returns, approvals or outcomes are promised.";

export function getVenture(slug: VentureSlug): Venture {
  const venture = ventures.find((v) => v.slug === slug);
  if (!venture) throw new Error(`Unknown venture: ${slug}`);
  return venture;
}

export function ventureHref(slug: VentureSlug): string {
  return `/ventures/${slug}`;
}
