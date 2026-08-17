import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/shared/Reveal";
import { MarginNote } from "@/components/studio/MarginNote";
import { studioPages, studioPageBySlug } from "@/content/studio";
import { pageMetadata, jsonLd, serviceSchema, breadcrumbSchema } from "@/lib/seo";

/**
 * The three Studio intent pages.
 *
 * Composed as an editorial feature rather than a service page: recognition
 * first ("this is your situation"), then what actually gets done, then the
 * boundaries. The Systems intent pages open with a spec plate; these open
 * with a paragraph, because the visitor's problem is qualitative.
 */

export function generateStaticParams() {
  return studioPages.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = studioPageBySlug(slug);
  if (!page) return {};
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/studio/${page.slug}`,
    division: "studio",
  });
}

export default async function StudioIntentPage({ params }: Params) {
  const { slug } = await params;
  const page = studioPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          serviceSchema({
            name: page.label,
            description: page.metaDescription,
            path: `/studio/${page.slug}`,
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
            { name: page.label, path: `/studio/${page.slug}` },
          ]),
        )}
      />

      {/* ── Opening ──────────────────────────────────────────────────────── */}
      <section className="px-(--spacing-gutter) pt-14 pb-16 md:pt-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-step--1">
            <li>
              <Link
                href="/studio"
                className="text-ink-faint transition-colors duration-(--duration-micro) hover:text-accent"
              >
                Studio
              </Link>
            </li>
            <li aria-hidden="true" className="text-ink-faint">
              /
            </li>
            <li className="text-ink-muted" aria-current="page">
              {page.label}
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 max-w-[30ch] font-display text-step-5 leading-[1.0] tracking-[-0.02em] text-balance">
          {page.h1}
        </h1>

        <p className="measure mt-7 text-step-2 leading-[1.5] text-ink-muted">
          {page.standfirst}
        </p>
      </section>

      {/* ── Recognition ──────────────────────────────────────────────────────
          Deliberately the first substantive block: the visitor should see
          their own situation described before being told what is on offer. */}
      <section
        aria-labelledby="situation"
        className="border-t border-rule bg-surface-raised px-(--spacing-gutter) py-16 md:py-20"
      >
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.5fr]">
          <h2
            id="situation"
            className="font-display text-step-3 leading-[1.15] tracking-[-0.01em] text-balance"
          >
            You are probably here because
          </h2>

          <ul className="flex flex-col">
            {page.situation.map((line, i) => (
              <Reveal
                as="li"
                key={line}
                index={i}
                className="border-t border-rule py-4 text-step-1 leading-[1.5] text-ink first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-4"
              >
                {line}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What gets done ───────────────────────────────────────────────────
          Alternating measure widths so the column does not read as four
          identical blocks. Each item is a small essay, not a feature bullet. */}
      <section
        aria-labelledby="included"
        className="border-t border-rule px-(--spacing-gutter) py-20 md:py-24"
      >
        <h2 id="included" className="text-step--1 tracking-[0.08em] text-ink-faint uppercase">
          What that involves
        </h2>

        <div className="mt-12 flex flex-col gap-14">
          {page.included.map((item, i) => (
            <Reveal
              key={item.title}
              index={i}
              className="grid gap-x-12 gap-y-3 md:grid-cols-[minmax(0,26ch)_1fr] md:items-baseline"
            >
              <h3 className="font-display text-step-3 leading-[1.12] tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="measure text-step-1 leading-[1.6] text-ink-muted">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Boundaries + notes ───────────────────────────────────────────────
          The boundaries sit beside the margin notes, so the honest limits and
          the practical asides read as one column of fine print. */}
      <section
        aria-labelledby="limits"
        className="border-t border-rule bg-surface-sunken px-(--spacing-gutter) py-16 md:py-20"
      >
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2
              id="limits"
              className="text-step--1 tracking-[0.08em] text-ink-faint uppercase"
            >
              What this is not
            </h2>
            <ul className="measure mt-6 flex flex-col gap-3">
              {page.boundaries.map((line) => (
                <li key={line} className="flex gap-3 text-step-0 text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-rule-strong"
                  />
                  <span className="leading-[1.55]">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5 lg:border-l lg:border-rule lg:pl-10">
            {page.notes.map((note, i) => (
              <MarginNote key={note} n={i + 1} className="lg:border-l-0 lg:pl-0">
                {note}
              </MarginNote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conversion ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="studio-page-cta"
        className="border-t border-rule-strong px-(--spacing-gutter) py-20 md:py-24"
      >
        <h2
          id="studio-page-cta"
          className="max-w-[26ch] font-display text-step-4 leading-[1.08] tracking-[-0.015em] text-balance"
        >
          {page.cta.label}
        </h2>
        <p className="measure mt-5 text-step-0 leading-[1.6] text-ink-muted">
          {page.cta.sub}
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
