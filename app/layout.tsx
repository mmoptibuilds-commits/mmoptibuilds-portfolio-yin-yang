import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { absoluteUrl, jsonLd, organizationSchema, webSiteSchema } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalDisplayName} — ${site.tagline}`,
    template: `%s — ${site.legalDisplayName}`,
  },
  description: site.description,
  applicationName: site.legalDisplayName,
  alternates: { canonical: absoluteUrl("/") },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: site.legalDisplayName,
    locale: site.locale,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never block zoom. WCAG 1.4.4.
  maximumScale: 5,
  colorScheme: "dark light",
};

/**
 * The root layout intentionally renders no navigation, footer, colour or
 * type. Each division owns its visible shell so that Systems and Studio can
 * look like different products, per decision D-004. Only behaviour and
 * document-level concerns live here.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/*
          Marks the document as JS-capable before first paint. The reveal
          system only hides content when this is set, so if JS fails or is
          disabled every reveal renders visible instead of blank.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="on"`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(webSiteSchema())}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
