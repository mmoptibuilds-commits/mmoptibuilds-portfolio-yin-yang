import Link from "next/link";
import { Mark } from "@/components/shared/Mark";
import { SkipLink } from "@/components/shared/SkipLink";
import { legalNav, universalNav } from "@/content/navigation";
import { systemsFontClass } from "@/lib/fonts-systems";

/**
 * Shell for pages that belong to neither division: about, story, legal.
 *
 * Uses the Systems material because the darker surface reads as the brand's
 * utility layer, but drops the instrument voice — these pages are read, not
 * operated. Kept separate from the division shells so a legal page never
 * inherits a service-page navigation.
 */
export function PlainShell({
  children,
  currentPath,
}: {
  children: React.ReactNode;
  currentPath?: string;
}) {
  return (
    <div
      className={`division-systems min-h-dvh bg-surface text-ink ${systemsFontClass}`}
    >
      <SkipLink />

      <header className="border-b border-rule">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-(--spacing-gutter) py-4">
          <Mark />
          {/* Four short links. On a narrow phone they exceed the row, so the
              list wraps and the negative inline margin keeps the first label
              optically aligned with the mark above it rather than indented by
              its own padding. */}
          <nav aria-label="Site" className="-mx-3">
            <ul className="flex flex-wrap items-center">
              {[...universalNav, ...legalNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={currentPath === item.href ? "page" : undefined}
                    className={
                      currentPath === item.href
                        ? "label-instrument flex min-h-11 items-center px-3 text-accent"
                        : "label-instrument flex min-h-11 items-center px-3 text-ink-muted transition-colors duration-(--duration-micro) hover:text-ink"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-rule-strong bg-surface-sunken px-(--spacing-gutter) py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="label-instrument text-ink-faint">mmoptibuilds</p>
            <p className="measure-tight mt-3 text-step--1 text-ink-muted">
              Requirement-led hardware sourcing and conversion-focused web
              development. Bengaluru, India.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Systems", href: "/systems" },
              { label: "Studio", href: "/studio" },
              ...legalNav,
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-step--1 text-ink-muted transition-colors duration-(--duration-micro) hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 border-t border-rule pt-6 text-step--1 text-ink-faint">
          &copy; {new Date().getFullYear()} mmoptibuilds. Bengaluru, India.
        </p>
      </footer>
    </div>
  );
}

/** Consistent measure and rhythm for long-form legal and editorial prose. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="measure flex flex-col gap-5 text-step-0 leading-[1.68] text-ink-muted [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-1 [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-ink">
      {children}
    </div>
  );
}
