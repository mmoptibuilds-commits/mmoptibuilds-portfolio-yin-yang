import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DatumRule } from "@/components/systems/DatumRule";
import { Reveal } from "@/components/shared/Reveal";
import { systemsPages, systemsPageBySlug } from "@/content/systems";
import { pageMetadata, jsonLd, serviceSchema, breadcrumbSchema } from "@/lib/seo";

/**
 * The three Systems intent pages. One route, three content records.
 *
 * They share a composition because they answer the same shape of question —
 * what do you need, what will I ask, what will I not do. Repeating the shell
 * is correct here; the pages differ in substance, not in structure. Where the
 * spec wants rhythm (spec 08), that happens between sections and between
 * divisions, not by making three sibling pages gratuitously different.
 */

export function generateStaticParams() {
  return systemsPages.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = systemsPageBySlug(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/systems/${page.slug}`,
    division: "systems",
  });
}

export default async function SystemsIntentPage({ params }: Params) {
  const { slug } = await params;
  const page = systemsPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema({
            name: page.label,
            description: page.metaDescription,
            path: `/systems/${page.slug}`,
            serviceType:
              page.intent === "enterprise-rfq"
                ? "Enterprise hardware sourcing"
                : "Custom computer building",
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "Systems", path: "/systems" },
            { name: page.label, path: `/systems/${page.slug}` },
          ]),
        )}
      />

      {/* ── Statement + readout ──────────────────────────────────────────────
          Asymmetric: the heading takes the left two-thirds, the instrument
          readout hangs in the right third like a spec plate on a machine. */}
      <section className="px-(--spacing-gutter) pt-14 pb-16 md:pt-20 md:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/systems"
                className="label-instrument text-ink-faint transition-colors duration-(--duration-micro) hover:text-accent"
              >
                Systems
              </Link>
            </li>
            <li aria-hidden="true" className="label-instrument text-ink-faint">
              /
            </li>
            <li className="label-instrument text-ink-muted" aria-current="page">
              {page.label}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="max-w-[26ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
              {page.h1}
            </h1>
            <p className="measure mt-7 text-step-2 leading-[1.45] text-ink-muted">
              {page.standfirst}
            </p>
          </div>

          {/* Spec plate. Tabular figures, hairline border, no rounding. */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 self-start border-l border-rule-strong pl-6 lg:min-w-[16rem] lg:grid-cols-1 lg:gap-y-4">
            {page.readout.map((row) => (
              <div key={row.label}>
                <dt className="label-instrument text-ink-faint">{row.label}</dt>
                <dd className="label-instrument mt-1 text-ink" data-numeric>
                  {row.value}
                  {row.note ? (
                    <span className="ml-1.5 normal-case tracking-normal text-ink-faint">
                      {row.note}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Who it is for ────────────────────────────────────────────────────
          A short list, set in the reading face rather than as pills or cards. */}
      <section
        aria-labelledby="audience"
        className="border-t border-rule px-(--spacing-gutter) py-14"
      >
        <h2 id="audience" className="label-instrument text-ink-faint">
          Who this is for
        </h2>
        <ul className="mt-6 grid gap-x-12 gap-y-4 md:grid-cols-3">
          {page.audience.map((line, i) => (
            <Reveal as="li" key={line} index={i} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 h-px w-4 shrink-0 bg-accent"
              />
              <span className="text-step-0 leading-[1.55] text-ink-muted">
                {line}
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── The questions ────────────────────────────────────────────────────
          The heart of the page, and the thing that makes it useful rather than
          promotional: the actual questions a quote depends on, each with the
          reason it is asked. Numbered rows with a hairline datum between. */}
      <section
        aria-labelledby="questions"
        className="border-t border-rule-strong bg-surface-raised px-(--spacing-gutter) py-20 md:py-24"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="questions"
            className="font-display text-step-4 leading-[1.05] tracking-[-0.02em] uppercase"
          >
            What you will be asked
          </h2>
          <p className="label-instrument text-ink-faint" data-numeric>
            {String(page.questions.length).padStart(2, "0")} questions
          </p>
        </div>

        <p className="measure mt-6 text-step-0 text-ink-muted">
          These are the questions the quote actually depends on. Answering them
          here saves a round of email; every one of them changes the parts list.
        </p>

        <ol className="mt-14 flex flex-col">
          {page.questions.map((item, i) => (
            <Reveal
              as="li"
              key={item.q}
              index={i}
              className="grid gap-x-8 gap-y-3 border-t border-rule py-8 md:grid-cols-[3.5rem_minmax(0,34ch)_1fr]"
            >
              <span
                aria-hidden="true"
                className="label-instrument text-accent"
                data-numeric
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-step-1 leading-[1.35] text-ink">{item.q}</h3>
              <p className="measure text-step-0 leading-[1.6] text-ink-muted">
                {item.why}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Boundaries ───────────────────────────────────────────────────────
          Stated near the conversion point, per spec 07. Trust is built by
          being specific about what is not on offer. */}
      <section
        aria-labelledby="boundaries"
        className="px-(--spacing-gutter) py-20"
      >
        <h2 id="boundaries" className="label-instrument text-ink-faint">
          What this does not include
        </h2>
        <DatumRule className="mt-4 mb-8" />
        <ul className="measure flex flex-col gap-3">
          {page.boundaries.map((line) => (
            <li key={line} className="flex gap-3 text-step-0 text-ink-muted">
              <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-rule-strong" />
              <span className="leading-[1.55]">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Conversion ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta"
        className="border-t border-rule-strong bg-surface-sunken px-(--spacing-gutter) py-20 md:py-24"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="cta"
              className="max-w-[24ch] font-display text-step-4 leading-[1.05] tracking-[-0.02em] uppercase"
            >
              {page.cta.heading}
            </h2>
            <p className="measure mt-4 text-step-0 text-ink-muted">
              {page.cta.sub}
            </p>
          </div>
          <Link
            href={`/contact?intent=${page.intent}`}
            className="label-instrument inline-flex min-h-12 shrink-0 items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
          >
            {page.cta.label} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
