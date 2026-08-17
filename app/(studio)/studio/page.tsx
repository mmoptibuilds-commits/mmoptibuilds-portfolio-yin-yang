import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/shared/Reveal";
import { studioOverview } from "@/content/studio";
import { pageMetadata, jsonLd, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: studioOverview.metaTitle,
  description: studioOverview.metaDescription,
  path: "/studio",
  division: "studio",
});

export default function StudioOverviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema({
            name: "Website design and development",
            description: studioOverview.metaDescription,
            path: "/studio",
            serviceType: "Web design and development",
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "Studio", path: "/studio" },
          ]),
        )}
      />

      {/* ── Opening ──────────────────────────────────────────────────────────
          Editorial, not instrumental: the headline is set in the serif at a
          generous measure, indented from the left edge rather than flush to
          it, with the standfirst hanging in the margin. Deliberately unlike
          the Systems opening, which is flush-left and readout-driven. */}
      <section className="px-(--spacing-gutter) pt-16 pb-20 md:pt-28 md:pb-28">
        <p className="text-step--1 tracking-[0.08em] text-accent uppercase">
          Division 02 &mdash; Studio
        </p>

        <div className="mt-8 grid gap-x-16 gap-y-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <h1 className="font-display text-step-6 leading-[0.98] tracking-[-0.015em] text-balance">
            {studioOverview.h1}
          </h1>

          <p className="measure text-step-1 leading-[1.6] text-ink-muted lg:pb-3">
            {studioOverview.standfirst}
          </p>
        </div>
      </section>

      {/* ── Two modes ────────────────────────────────────────────────────────
          Two columns divided by a single hairline rule rather than two boxed
          cards. The rule is the divider; the whitespace does the containing. */}
      <section
        aria-labelledby="modes"
        className="border-t border-rule px-(--spacing-gutter) py-20 md:py-24"
      >
        <h2 id="modes" className="text-step--1 tracking-[0.08em] text-ink-faint uppercase">
          Two ways of working
        </h2>

        <div className="mt-12 grid gap-x-16 gap-y-16 md:grid-cols-2">
          {studioOverview.modes.map((mode, i) => (
            <Reveal
              key={mode.name}
              index={i}
              className={i === 1 ? "md:border-l md:border-rule md:pl-16" : undefined}
            >
              <div className="flex items-baseline gap-4">
                <h3 className="font-display text-step-4 leading-[1.05] tracking-[-0.015em]">
                  {mode.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-rule-strong"
                />
              </div>

              <p className="mt-5 font-display text-step-2 leading-[1.3] text-ink">
                {mode.line}
              </p>

              <p className="measure mt-4 text-step-0 leading-[1.65] text-ink-muted">
                {mode.body}
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {mode.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-step-0 text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    <span className="leading-[1.5]">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The baseline ─────────────────────────────────────────────────────
          Set on the raised paper surface. A numbered list in the margin voice,
          because this is the fine print that is actually reassuring. */}
      <section
        aria-labelledby="baseline"
        className="border-t border-rule bg-surface-raised px-(--spacing-gutter) py-20 md:py-24"
      >
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2
              id="baseline"
              className="font-display text-step-4 leading-[1.08] tracking-[-0.015em] text-balance"
            >
              The same floor, whichever way we work.
            </h2>
            <p className="measure-tight mt-6 text-step-0 leading-[1.6] text-ink-muted">
              Lean scope is not lower quality. A smaller site has less surface
              area, not weaker foundations &mdash; and the six things below are
              not negotiable in either mode.
            </p>
          </div>

          <ol className="flex flex-col">
            {studioOverview.baseline.map((line, i) => (
              <Reveal
                as="li"
                key={line}
                index={i}
                className="flex items-baseline gap-5 border-t border-rule py-4"
              >
                <span
                  aria-hidden="true"
                  className="text-step--1 text-ink-faint"
                  data-numeric
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-step-1 leading-[1.45] text-ink">{line}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Paths ────────────────────────────────────────────────────────────
          Editorial index. Serif titles at display scale, an underline that
          draws on hover — the Studio hover signature, versus Systems' tick. */}
      <nav
        aria-label="Studio services"
        className="border-t border-rule px-(--spacing-gutter) py-20 md:py-24"
      >
        <h2 className="text-step--1 tracking-[0.08em] text-ink-faint uppercase">
          Where to start
        </h2>

        <ul className="mt-10 flex flex-col">
          {studioOverview.paths.map((path, i) => (
            <Reveal as="li" key={path.href} index={i} className="border-t border-rule">
              <Link
                href={path.href}
                className="group grid gap-x-10 gap-y-2 py-7 md:grid-cols-[minmax(0,26ch)_1fr_auto] md:items-baseline"
              >
                <h3 className="relative inline-block font-display text-step-3 leading-[1.1] tracking-[-0.01em]">
                  <span className="relative">
                    {path.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-(--duration-ui) ease-(--ease-editorial) group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </span>
                </h3>

                <p className="measure text-step-0 leading-[1.55] text-ink-muted">
                  {path.line}
                </p>

                <span
                  aria-hidden="true"
                  className="hidden text-step-0 text-ink-faint transition-transform duration-(--duration-ui) ease-(--ease-editorial) group-hover:translate-x-1.5 group-hover:text-accent md:block"
                >
                  &rarr;
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </nav>

      {/* ── Conversion ───────────────────────────────────────────────────────
          Quieter than the Systems equivalent: a sentence and a link, not a
          filled block. Studio's CTA intensity is lower by design because the
          decision is slower. */}
      <section
        aria-labelledby="studio-cta"
        className="border-t border-rule-strong bg-surface-sunken px-(--spacing-gutter) py-20 md:py-24"
      >
        <h2
          id="studio-cta"
          className="max-w-[30ch] font-display text-step-4 leading-[1.08] tracking-[-0.015em] text-balance"
        >
          Send the situation, not a specification.
        </h2>
        <p className="measure mt-5 text-step-0 leading-[1.6] text-ink-muted">
          A URL and two sentences about what the business does is enough. If a
          smaller job would serve you better, that is what you will be told.
        </p>
        <Link
          href="/contact?intent=studio-brief"
          className="group mt-8 inline-flex min-h-12 items-center gap-3 bg-accent px-6 text-step-0 font-medium text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
        >
          Start a brief
          <span
            aria-hidden="true"
            className="transition-transform duration-(--duration-ui) ease-(--ease-editorial) group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>
      </section>
    </>
  );
}
