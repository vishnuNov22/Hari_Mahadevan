/**
 * Central identity, contact and navigation configuration.
 * Every fact here comes from the approved master specification.
 * Do not add social links, WhatsApp or extra claims until Hari confirms them.
 */

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string };

export const site = {
  name: "Hari Mahadevan",
  shortName: "Hari Mahadevan",
  descriptor:
    "Entrepreneur | Digital Marketer | Event Management | Real Estate | Financial Services",
  roles: ["Entrepreneur", "Digital Marketer", "Event Management", "Real Estate", "Financial Services"],
  positioning: [
    "Ideas into opportunities.",
    "Creativity into experiences.",
    "Relationships into long-term value.",
  ],
  signature: "Let’s Connect. Let’s Grow. Let’s Create.",
  description:
    "Hari Mahadevan is an entrepreneur working across digital marketing, event management, real estate and financial services — turning ideas into opportunities through creativity, strategy and client-focused service.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",

  contact: {
    email: "harimahadevan2002@gmail.com",
    phoneDisplay: "+91 94896 72128",
    phoneHref: "tel:+919489672128",
    /** Set to a wa.me URL only after Hari confirms the number is WhatsApp-enabled. */
    whatsappHref: null as string | null,
  },

  /**
   * "Mahadev Creator" was supplied as a contact label. It is intentionally not shown
   * publicly until Hari confirms it is a public brand name.
   */
  altContactLabel: "Mahadev Creator",
  showAltContactLabel: false,

  /** Render only verified, approved profile URLs. Empty by design. */
  social: [] as SocialLink[],

  /** Swap these paths when a professional portrait shoot is available. */
  portrait: {
    hero: "/images/hari-portrait-studio.jpg",
    heroAlt: "Hari Mahadevan smiling, in a navy sweater, against a warm studio backdrop",
    full: "/images/hari-portrait-full.jpg",
    alt: "Hari Mahadevan smiling, wearing a white shirt, holding a camera at an event venue",
  },
} as const;

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Ventures", href: "/ventures" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export const enquiryTopics = [
  "Digital Marketing",
  "Event Management",
  "Real Estate",
  "Financial Services",
  "Collaboration",
  "Other",
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number];

export function mailtoHref(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${site.contact.email}${query ? `?${query}` : ""}`;
}
