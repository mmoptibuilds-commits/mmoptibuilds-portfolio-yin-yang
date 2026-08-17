import Link from "next/link";
import type { Metadata } from "next";
import { SkipLink } from "@/components/shared/SkipLink";
import { Mark } from "@/components/shared/Mark";
import {
  SystemBuildForm,
  EnterpriseRfqForm,
  StudioBriefForm,
} from "@/components/shared/forms";
import { isEnquiryIntent, type EnquiryIntent } from "@/lib/enquiry-schema";
import { pageMetadata, jsonLd, breadcrumbSchema } from "@/lib/seo";
import { systemsFontClass } from "@/lib/fonts-systems";
import { studioFontClass } from "@/lib/fonts-studio";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Start an enquiry | mmoptibuilds",
  description:
    "Three ways to start: a system build brief, an enterprise hardware RFQ, or a website brief. No account needed. You get a reference ID on screen and a reply by email.",
  path: "/contact",
});

/**
 * Contact.
 *
 * Neutral ground. It belongs to neither division, so it uses the Systems
 * material — the darker surface reads as the utility layer of the brand —
 * but drops the instrument voice for the Studio path so the form still feels
 * like the division it belongs to.
 *
 * The intent is chosen by query string so every division CTA can deep-link
 * straight to the right form. Three separate URLs would fragment the SEO of a
 * single page whose purpose is identical; a query parameter keeps one
 * canonical URL, which is why /contact is canonical without the parameter.
 */

const TABS: { intent: EnquiryIntent; label: string; blurb: string }[] = [
  {
    intent: "system-build",
    label: "System build",
    blurb: "A PC or workstation specified around what it has to do.",
  },
  {
    intent: "enterprise-rfq",
    label: "Enterprise RFQ",
    blurb: "Exact-spec sourcing from a part number and quantity.",
  },
  {
    intent: "studio-brief",
    label: "Website brief",
    blurb: "A new site, a redesign, or a launch site.",
  },
];

type Props = { searchParams: Promise<{ intent?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const active: EnquiryIntent = isEnquiryIntent(params.intent)
    ? params.intent
    : "system-build";

  const isStudio = active === "studio-brief";

  return (
    <div
      className={cn(
        "min-h-dvh bg-surface text-ink",
        // Both font classes are applied because either division can be shown
        // here depending on the chosen intent, and the switch is a plain link
        // rather than a route change.
        systemsFontClass,
        studioFontClass,
        isStudio ? "division-studio" : "division-systems",
      )}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        )}
      />

      <SkipLink />

      <header className="border-b border-rule">
        <div className="flex items-center justify-between gap-4 px-(--spacing-gutter) py-4">
          <Mark />
          <Link
            href="/"
            className={cn(
              "min-h-11 content-center text-ink-muted transition-colors duration-(--duration-micro) hover:text-ink",
              isStudio ? "text-step--1" : "label-instrument",
            )}
          >
            &larr; Back
          </Link>
        </div>
      </header>

      <main id="main" className="px-(--spacing-gutter) py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h1
            className={cn(
              "max-w-[22ch] leading-[1.02] tracking-[-0.02em] text-balance",
              isStudio
                ? "font-display text-step-5"
                : "font-display text-step-5 uppercase",
            )}
          >
            Tell me what you need.
          </h1>

          <p className="measure mt-6 text-step-1 leading-[1.55] text-ink-muted">
            No account, no verification email, no automated quote. You get a
            reference on screen, and a reply written after the parts or the
            scope have actually been looked at.
          </p>

          {/* Intent chooser. Real links, so each is bookmarkable, works without
              JavaScript, and appears in browser history sensibly. Rendered as a
              nav with aria-current rather than an ARIA tablist, because these
              navigate rather than toggle panels. */}
          <nav aria-label="Enquiry type" className="mt-12">
            <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
              {TABS.map((tab) => {
                const selected = tab.intent === active;
                return (
                  <li key={tab.intent}>
                    <Link
                      href={`/contact?intent=${tab.intent}`}
                      aria-current={selected ? "page" : undefined}
                      className={cn(
                        "flex h-full flex-col gap-1.5 p-4 transition-colors duration-(--duration-micro)",
                        selected
                          ? "bg-surface-raised"
                          : "bg-surface hover:bg-surface-raised",
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-2",
                          isStudio ? "text-step-0 font-medium" : "label-instrument",
                          selected ? "text-accent" : "text-ink",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-(--duration-micro)",
                            selected ? "bg-accent" : "bg-rule-strong",
                          )}
                        />
                        {tab.label}
                      </span>
                      <span className="text-step--1 leading-[1.45] text-ink-muted">
                        {tab.blurb}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* The form. `key` forces a fresh mount when the intent changes, so
              no field state leaks between three structurally different forms. */}
          <div className="mt-14 max-w-2xl">
            {active === "system-build" ? (
              <SystemBuildForm key="system-build" sourcePath="/contact" />
            ) : null}
            {active === "enterprise-rfq" ? (
              <EnterpriseRfqForm key="enterprise-rfq" sourcePath="/contact" />
            ) : null}
            {active === "studio-brief" ? (
              <StudioBriefForm key="studio-brief" sourcePath="/contact" />
            ) : null}
          </div>
        </div>
      </main>

      <footer className="border-t border-rule px-(--spacing-gutter) py-8">
        <p className="text-step--1 text-ink-faint">
          &copy; {new Date().getFullYear()} mmoptibuilds. Bengaluru, India.
        </p>
      </footer>
    </div>
  );
}
