import Link from "next/link";
import type { Metadata } from "next";
import { DatumRule } from "@/components/systems/DatumRule";
import { Reveal } from "@/components/shared/Reveal";
import { systemsOverview } from "@/content/systems";
import { pageMetadata, jsonLd, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { divisions } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: systemsOverview.metaTitle,
  description: systemsOverview.metaDescription,
  path: "/systems",
  division: "systems",
});

export default function SystemsOverviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema({
            name: "Computer systems sourcing and assembly",
            description: systemsOverview.metaDescription,
            path: "/systems",
            serviceType: "Computer hardware sourcing",
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "Systems", path: "/systems" },
          ]),
        )}
      />

      {/* ── Statement ────────────────────────────────────────────────────────
          Type-led, no hero image. The readout beneath is the art direction:
          this division looks like an instrument, so it opens with a reading. */}
      <section className="px-(--spacing-gutter) pt-16 pb-20 md:pt-24 md:pb-28">
        <p className="label-instrument text-accent">Division 01 — Systems</p>

        <h1 className="mt-6 max-w-[22ch] font-display text-step-6 leading-[0.95] tracking-[-0.03em] uppercase">
          {systemsOverview.h1}
        </h1>

        <p className="measure mt-8 text-step-2 leading-[1.45] text-ink-muted">
          {systemsOverview.standfirst}
        </p>

        <DatumRule className="mt-14" label="index" value="03 paths" />
      </section>

      {/* ── Paths ────────────────────────────────────────────────────────────
          Full-bleed rows, not a three-card grid. Each row is a large hit area
          that reads like a line in a parts index: number, name, description,
          and a rule that extends on hover. */}
      <nav aria-label="Systems services" className="border-t border-rule">
        <ul>
          {systemsOverview.paths.map((path, i) => (
            <Reveal as="li" key={path.href} index={i} className="border-b border-rule">
              <Link
                href={path.href}
                className="group grid items-baseline gap-x-6 gap-y-2 px-(--spacing-gutter) py-8 md:grid-cols-[4rem_minmax(0,22ch)_1fr_auto] md:py-10"
              >
                <span
                  aria-hidden="true"
                  className="label-instrument text-ink-faint transition-colors duration-(--duration-micro) group-hover:text-accent"
                  data-numeric
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h2 className="font-display text-step-3 leading-[1.05] tracking-[-0.01em] uppercase transition-colors duration-(--duration-micro) group-hover:text-accent">
                  {path.label}
                </h2>

                <p className="measure text-step-0 text-ink-muted">{path.line}</p>

                <span
                  aria-hidden="true"
                  className="label-instrument hidden text-ink-faint transition-transform duration-(--duration-ui) ease-(--ease-mech) group-hover:translate-x-1.5 group-hover:text-accent md:block"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </nav>

      {/* ── Why the model is the way it is ───────────────────────────────────
          Deliberately prose. The three most common objections — no prices, no
          stock, what do I actually get — answered before they are asked. */}
      <section
        aria-labelledby="model"
        className="px-(--spacing-gutter) pt-24 pb-24 md:pt-32"
      >
        <h2 id="model" className="label-instrument text-ink-faint">
          The model
        </h2>

        <div className="mt-10 grid gap-x-12 gap-y-14 md:grid-cols-3">
          {systemsOverview.rationale.map((item, i) => (
            <Reveal key={item.heading} index={i}>
              <h3 className="font-display text-step-2 leading-[1.15] tracking-[-0.01em] text-ink">
                {item.heading}
              </h3>
              <p className="mt-4 text-step-0 leading-[1.62] text-ink-muted">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Enquiry ──────────────────────────────────────────────────────────
          Sunken surface so the conversion moment is materially different from
          the reading surface above it. */}
      <section
        aria-labelledby="systems-enquiry"
        className="border-t border-rule-strong bg-surface-sunken px-(--spacing-gutter) py-20 md:py-24"
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="systems-enquiry"
              className="max-w-[26ch] font-display text-step-4 leading-[1.05] tracking-[-0.02em] uppercase"
            >
              Start with the requirement
            </h2>
            <p className="measure mt-5 text-step-0 text-ink-muted">
              {divisions.systems.summary} If it turns out Studio is the right
              side of the business for you, you will be told that instead.
            </p>
          </div>

          <Link
            href="/contact?intent=system-build"
            className="label-instrument inline-flex min-h-12 shrink-0 items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
          >
            Describe a requirement &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
