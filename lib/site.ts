/**
 * Facts about the business, in one place.
 *
 * Everything here must be true and verifiable. Per spec 01 and decision
 * D-022: no invented clients, testimonials, awards, certifications, stock,
 * distributor relationships, savings, delivery times or performance figures.
 */

export const site = {
  name: "mmoptibuilds",
  /** Used in prose. Lowercase, one word, per spec 01. */
  brand: "mmoptibuilds",
  /** Used where a proper noun is required (schema.org, page titles). */
  legalDisplayName: "MMOptiBuilds",
  url: "https://mmoptibuilds.com",
  tagline: "Two kinds of technical work. One standard of care.",
  description:
    "mmoptibuilds sources computer systems around real workloads and builds websites around real business goals. Requirement-led hardware sourcing and conversion-focused web development, from Bengaluru.",
  locale: "en_IN",
  /** Primary launch market, per spec 01. */
  market: {
    city: "Bengaluru",
    region: "Karnataka",
    country: "India",
    countryCode: "IN",
  },
  /**
   * Intake is by form only. The roadmap publishes no email address or phone
   * number, so this site must not invent one.
   */
  contactRoute: "/contact",
} as const;

export const divisions = {
  systems: {
    key: "systems",
    name: "Systems",
    fullName: "mmoptibuilds Systems",
    href: "/systems",
    /** One line, used on the gateway and in metadata. */
    proposition: "Hardware that starts with the requirement.",
    summary:
      "Custom PCs, workstations, business systems and exact-spec enterprise hardware — researched and quoted after your requirements are clear.",
  },
  studio: {
    key: "studio",
    name: "Studio",
    fullName: "mmoptibuilds Studio",
    href: "/studio",
    proposition: "Clear enough to convert. Distinctive enough to remember.",
    summary:
      "Conversion-focused websites for businesses, startups and teams ready to replace an outdated presence.",
  },
} as const;

export type DivisionKey = keyof typeof divisions;

/**
 * The consent notice version recorded against every submission. Bump this
 * whenever the privacy notice changes materially; stored submissions keep
 * the version that was actually shown to the visitor.
 */
export const CONSENT_VERSION = "2026-08-1";
