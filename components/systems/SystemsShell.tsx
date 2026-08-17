import Link from "next/link";
import { Mark } from "@/components/shared/Mark";
import { MobileNav } from "@/components/shared/MobileNav";
import { SkipLink } from "@/components/shared/SkipLink";
import { SystemsNav } from "./SystemsNav";
import { DatumRule } from "./DatumRule";
import { systemsNav, universalNav, legalNav } from "@/content/navigation";
import { divisions } from "@/lib/site";

/**
 * The Systems shell. Server component — only the nav's active-route marker
 * and the mobile sheet are client side.
 */
export function SystemsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="division-systems min-h-dvh bg-surface text-ink">
      <SkipLink />

      <header className="sticky top-0 z-80 border-b border-rule bg-surface/92 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-(--spacing-gutter) py-3">
          <div className="flex items-center gap-6">
            <Mark />
            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-rule-strong lg:block"
            />
            <Link
              href="/systems"
              className="label-instrument hidden text-ink transition-colors duration-(--duration-micro) hover:text-accent lg:block"
            >
              Systems
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <SystemsNav />

            {/* Discreet sibling-division switcher, per the IA in spec 05. */}
            <Link
              href={divisions.studio.href}
              className="label-instrument hidden min-h-11 items-center border-l border-rule pl-4 text-ink-faint transition-colors duration-(--duration-micro) hover:text-ink lg:flex"
            >
              Studio&nbsp;&rarr;
            </Link>

            <Link
              href="/contact"
              className="label-instrument hidden min-h-11 items-center bg-accent px-4 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong lg:flex"
            >
              Enquire
            </Link>

            <MobileNav
              items={systemsNav}
              siblingLabel="Go to Studio"
              siblingHref={divisions.studio.href}
              tone="instrument"
            />
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-rule-strong bg-surface-sunken">
        <div className="px-(--spacing-gutter) py-14">
          <DatumRule label="mmoptibuilds systems" className="mb-10" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="measure-tight">
              <p className="text-step-0 text-ink">{divisions.systems.proposition}</p>
              <p className="mt-3 text-step--1 text-ink-muted">
                No stock is held. Requirements are confirmed with distributors
                before a quote is issued.
              </p>
            </div>

            <FooterColumn title="Systems" items={systemsNav} />
            <FooterColumn title="mmoptibuilds" items={universalNav} />
            <FooterColumn title="Legal" items={legalNav} />
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-step--1 text-ink-faint">
              &copy; {new Date().getFullYear()} mmoptibuilds. Bengaluru, India.
            </p>
            <Link
              href={divisions.studio.href}
              className="label-instrument text-ink-muted transition-colors duration-(--duration-micro) hover:text-accent"
            >
              mmoptibuilds Studio &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="label-instrument text-ink-faint">{title}</h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-step-0 text-ink-muted transition-colors duration-(--duration-micro) hover:text-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
