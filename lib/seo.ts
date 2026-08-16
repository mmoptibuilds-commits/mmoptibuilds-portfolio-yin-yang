import type { MetadataRoute } from "next";
import type { Metadata } from "next";
import { site } from "./site";

/** Absolute URL for canonicals, OG images and JSON-LD. */
export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Which division's OG card to use. Omit for the gateway and legal pages. */
  division?: "systems" | "studio";
  noindex?: boolean;
};

/**
 * Every indexable route builds its metadata here so titles, canonicals and
 * social cards cannot drift apart.
 */
export function pageMetadata({
  title,
  description,
  path,
  division,
  noindex,
}: PageMetaInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(
    division ? `/opengraph/${division}` : "/opengraph/gateway",
  );

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: site.legalDisplayName,
      title,
      description,
      url: canonical,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** JSON-LD helper. Renders nothing visible; asserts only supportable facts. */
export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.legalDisplayName,
    alternateName: site.brand,
    url: site.url,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.market.city,
      addressRegion: site.market.region,
      addressCountry: site.market.countryCode,
    },
    areaServed: { "@type": "Country", name: site.market.country },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: absoluteUrl(site.contactRoute),
      availableLanguage: ["en"],
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: site.url,
    name: site.legalDisplayName,
    description: site.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-IN",
  };
}

/**
 * Service schema. Deliberately omits offers, price and availability: the
 * business publishes no prices and holds no stock (decisions D-006, D-007),
 * so asserting them would be false structured data.
 */
export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: absoluteUrl(input.path),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Country", name: site.market.country },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Public routes only. /admin and API routes are excluded by construction. */
export const publicRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/systems", priority: 0.9, changeFrequency: "monthly" },
  { path: "/systems/gaming-pcs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/systems/workstations", priority: 0.8, changeFrequency: "monthly" },
  { path: "/systems/enterprise-hardware", priority: 0.8, changeFrequency: "monthly" },
  { path: "/studio", priority: 0.9, changeFrequency: "monthly" },
  { path: "/studio/business-websites", priority: 0.8, changeFrequency: "monthly" },
  { path: "/studio/startup-websites", priority: 0.8, changeFrequency: "monthly" },
  { path: "/studio/website-redesign", priority: 0.8, changeFrequency: "monthly" },
  { path: "/studio/work", priority: 0.7, changeFrequency: "monthly" },
  { path: "/studio/work/coldharbour", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/about/story", priority: 0.4, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.9, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];
