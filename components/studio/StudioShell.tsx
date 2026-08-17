import Link from "next/link";
import { Mark } from "@/components/shared/Mark";
import { MobileNav } from "@/components/shared/MobileNav";
import { SkipLink } from "@/components/shared/SkipLink";
import { StudioNav } from "./StudioNav";
import { studioNav, universalNav, legalNav } from "@/content/navigation";
import { divisions } from "@/lib/site";

/** The Studio shell. Warm paper, ink, editorial rhythm. */
export function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="division-studio min-h-dvh bg-surface text-ink">
      <SkipLink />

      <header className="sticky top-0 z-80 border-b border-rule bg-surface/92 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-(--spacing-gutter) py-3">
          <div className="flex items-center gap-5">
            <Mark />
            <span aria-hidden="true" className="hidden h-4 w-px bg-rule-strong lg:block" />
            <Link
              href="/studio"
              className="hidden font-display text-step-1 text-ink transition-colors duration-(--duration-micro) hover:text-accent lg:block"
            >
              Studio
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <StudioNav />

            <Link
              href={divisions.systems.href}
              className="hidden min-h-11 items-center border-l border-rule pl-4 text-step--1 text-ink-faint transition-colors duration-(--duration-micro) hover:text-ink lg:flex"
            >
              Systems&nbsp;&rarr;
            </Link>

            <Link
              href="/contact"
              className="hidden min-h-11 items-center bg-accent px-4 text-step-0 font-medium text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong lg:flex"
            >
              Start a brief
            </Link>

            <MobileNav
              items={studioNav}
              siblingLabel="Go to Systems"
              siblingHref={divisions.systems.href}
              tone="editorial"
            />
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-rule-strong bg-surface-sunken">
        <div className="px-(--spacing-gutter) py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="measure-tight">
              <p className="font-display text-step-2 text-ink">
                {divisions.studio.proposition}
              </p>
              <p className="mt-3 text-step--1 text-ink-muted">
                Your domain and hosting stay in your control. Deployment access
                is removed at handover.
              </p>
            </div>

            <FooterColumn title="Studio" items={studioNav} />
            <FooterColumn title="mmoptibuilds" items={universalNav} />
            <FooterColumn title="Legal" items={legalNav} />
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-step--1 text-ink-faint">
              &copy; {new Date().getFullYear()} mmoptibuilds. Bengaluru, India.
            </p>
            <Link
              href={divisions.systems.href}
              className="text-step--1 text-ink-muted transition-colors duration-(--duration-micro) hover:text-accent"
            >
              mmoptibuilds Systems &rarr;
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
      <h2 className="text-step--1 tracking-[0.08em] text-ink-faint uppercase">{title}</h2>
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
