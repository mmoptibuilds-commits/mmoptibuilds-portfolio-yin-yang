import Link from "next/link";
import type { Metadata } from "next";
import { SkipLink } from "@/components/shared/SkipLink";
import { Mark } from "@/components/shared/Mark";
import {
  SystemBuildForm,
  EnterpriseRfqForm,
  StudioBriefForm,
} from "@/components/shared/forms";
import { isEnquiryIntent, type EnquiryIntent } from "@/lib/enquiry-fields";
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

/**
 * The boundaries shown beside each form.
 *
 * These are the same limits stated on the division pages, repeated at the
 * conversion moment because that is when they matter — spec 09 requires
 * boundaries near the CTA. Nothing here promises a response time, because no
 * response time can currently be met reliably.
 */
const BOUNDARIES: Record<EnquiryIntent, string[]> = {
  "system-build": [
    "No stock is held. Nothing is reserved by sending this.",
    "No price is quoted before availability and warranty terms are confirmed.",
    "No frame-rate or benchmark promise — that depends on your settings and drivers.",
    "Your budget range stays private and is never published.",
  ],
  "enterprise-rfq": [
    "Sourcing and delivery only. No installation, rack work or network configuration.",
    "No availability or lead time is stated before a distributor confirms it.",
    "Compatibility with equipment already in service is not guaranteed unless stated in writing.",
    "Grey-market and parallel-import stock is not supplied.",
  ],
  "studio-brief": [
    "No guaranteed ranking, traffic figure or conversion rate. Anyone promising those is guessing.",
    "You keep your domain and hosting accounts. Deployment access is removed at handover.",
    "30 days of bug fixes on reproducible defects; content changes are new scope.",
    "If a smaller job would serve you better, that is what the reply will say.",
  ],
};

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
        <div className="mx-auto max-w-6xl">
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

          {/* The form, with a sticky companion column.
              The right column is not decoration filling a gap: spec 09 requires
              boundaries stated near the CTA, and "what happens next" is the
              question every visitor has at the moment of submitting. Keeping it
              beside the form means it is readable while filling the fields in,
              rather than buried below the button. */}
          <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,38rem)_minmax(0,20rem)]">
            <div>
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

            <aside
              aria-labelledby="what-next"
              className="flex flex-col gap-10 border-t border-rule pt-8 lg:sticky lg:top-8 lg:self-start lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
            >
              <div>
                <h2
                  id="what-next"
                  className={cn(
                    "text-ink-faint",
                    isStudio
                      ? "text-step--1 tracking-[0.08em] uppercase"
                      : "label-instrument",
                  )}
                >
                  What happens next
                </h2>
                <ol className="mt-5 flex flex-col gap-5">
                  {[
                    "You get a reference number on screen. Keep it — quote it if you follow up.",
                    active === "studio-brief"
                      ? "Your current site, your market and the scope get looked at properly."
                      : "Availability, warranty terms, tax and delivery get confirmed with distributors.",
                    "You get a reply by email, written by a person after that work is done.",
                  ].map((line, i) => (
                    <li key={line} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 text-accent",
                          isStudio ? "text-step--1" : "label-instrument",
                        )}
                        data-numeric
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-step--1 leading-[1.6] text-ink-muted">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-rule pt-8">
                <h2
                  className={cn(
                    "text-ink-faint",
                    isStudio
                      ? "text-step--1 tracking-[0.08em] uppercase"
                      : "label-instrument",
                  )}
                >
                  Worth knowing
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {BOUNDARIES[active].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-3 shrink-0 bg-rule-strong"
                      />
                      <span className="text-step--1 leading-[1.55] text-ink-muted">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
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
