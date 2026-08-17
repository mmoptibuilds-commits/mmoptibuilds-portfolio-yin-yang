import Link from "next/link";
import type { Metadata } from "next";
import { Mark } from "@/components/shared/Mark";
import { SkipLink } from "@/components/shared/SkipLink";
import { divisions } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found | mmoptibuilds",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Uses the missing-page moment to route rather than apologise: the four
 * destinations below are where someone who mistyped a URL was probably
 * heading. Styled as an instrument fault readout, which keeps it inside the
 * brand instead of feeling like a framework default.
 */
export default function NotFound() {
  const destinations = [
    { label: divisions.systems.name, href: divisions.systems.href, line: divisions.systems.proposition },
    { label: divisions.studio.name, href: divisions.studio.href, line: divisions.studio.proposition },
    { label: "About", href: "/about", line: "Who runs this and how it works." },
    { label: "Start an enquiry", href: "/contact", line: "Describe what you need." },
  ];

  return (
    <div className="division-systems flex min-h-dvh flex-col bg-surface text-ink">
      <SkipLink />
      <header className="border-b border-rule px-(--spacing-gutter) py-4">
        <Mark />
      </header>

      <main id="main" className="flex flex-1 flex-col justify-center px-(--spacing-gutter) py-16">
        <p className="label-instrument text-accent" data-numeric>
          Error 404
        </p>

        <h1 className="mt-6 max-w-[24ch] font-display text-step-6 leading-[0.95] tracking-[-0.03em] uppercase">
          No page at this address.
        </h1>

        <p className="measure mt-6 text-step-1 leading-[1.55] text-ink-muted">
          Either the link was wrong or the page moved. Nothing here is broken on
          your end. These are the four places most people are looking for.
        </p>

        <nav aria-label="Suggested pages" className="mt-14 border-t border-rule">
          <ul>
            {destinations.map((d, i) => (
              <li key={d.href} className="border-b border-rule">
                <Link
                  href={d.href}
                  className="group grid items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[3.5rem_minmax(0,20ch)_1fr]"
                >
                  <span
                    aria-hidden="true"
                    className="label-instrument text-ink-faint transition-colors duration-(--duration-micro) group-hover:text-accent"
                    data-numeric
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-step-2 uppercase transition-colors duration-(--duration-micro) group-hover:text-accent">
                    {d.label}
                  </span>
                  <span className="text-step-0 text-ink-muted">{d.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
