import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/shared/Reveal";
import { coldharbour } from "@/content/studio";
import { pageMetadata, jsonLd, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: coldharbour.metaTitle,
  description: coldharbour.metaDescription,
  path: `/studio/work/${coldharbour.slug}`,
  division: "studio",
});

/**
 * The Coldharbour case study.
 *
 * Schema is CreativeWork, not a review or product, and asserts no client,
 * no rating and no commercial result — because none exist. The disclosure
 * block is rendered before the narrative, not after it.
 */
function creativeWorkSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: coldharbour.title,
    description: coldharbour.metaDescription,
    url: absoluteUrl(`/studio/work/${coldharbour.slug}`),
    dateCreated: coldharbour.year,
    creator: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-IN",
    /** Accurate: this was self-directed, so the org is also the commissioner. */
    sponsor: { "@id": absoluteUrl("/#organization") },
    keywords: coldharbour.stack.join(", "),
    isAccessibleForFree: true,
    publisher: { "@id": absoluteUrl("/#organization") },
    locationCreated: {
      "@type": "Place",
      name: `${site.market.city}, ${site.market.country}`,
    },
  };
}

export default function ColdharbourPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(creativeWorkSchema())}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "Studio", path: "/studio" },
            { name: "Work", path: "/studio/work" },
            { name: coldharbour.title, path: `/studio/work/${coldharbour.slug}` },
          ]),
        )}
      />

      <article>
        {/* ── Cover ────────────────────────────────────────────────────────
            No cover image, because the project itself had none — the case
            study is art-directed the way the project was: type and rule only.
            The title is set at the largest step in the system. */}
        <header className="px-(--spacing-gutter) pt-14 pb-16 md:pt-20 md:pb-20">
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
              <li>
                <Link
                  href="/studio/work"
                  className="text-ink-faint transition-colors duration-(--duration-micro) hover:text-accent"
                >
                  Work
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-faint">
                /
              </li>
              <li className="text-ink-muted" aria-current="page">
                {coldharbour.title}
              </li>
            </ol>
          </nav>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="border border-rule-strong px-2 py-0.5 text-step--1 tracking-[0.06em] text-ink-muted uppercase">
              {coldharbour.kindLabel}
            </span>
            <span className="text-step--1 text-ink-faint" data-numeric>
              {coldharbour.year}
            </span>
          </div>

          <h1 className="mt-6 font-display text-step-7 leading-[0.88] tracking-[-0.03em]">
            {coldharbour.title}
          </h1>

          <p className="measure mt-8 text-step-2 leading-[1.45] text-ink-muted">
            {coldharbour.standfirst}
          </p>
        </header>

        {/* ── Disclosure ───────────────────────────────────────────────────
            Placed before the narrative and given a real border, so nobody can
            read the case study while believing it was client work. */}
        <aside
          aria-labelledby="disclosure"
          className="mx-(--spacing-gutter) border-y border-accent/40 bg-surface-raised px-6 py-6"
        >
          <h2
            id="disclosure"
            className="text-step--1 tracking-[0.08em] text-accent uppercase"
          >
            Please read this first
          </h2>
          <p className="measure mt-3 text-step-0 leading-[1.6] text-ink">
            {coldharbour.disclosure}
          </p>
        </aside>

        {/* ── Facts ────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="facts"
          className="px-(--spacing-gutter) pt-16 pb-4"
        >
          <h2 id="facts" className="sr-only">
            Project facts
          </h2>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-4">
            {coldharbour.facts.map((f) => (
              <div key={f.label}>
                <dt className="text-step--1 tracking-[0.06em] text-ink-faint uppercase">
                  {f.label}
                </dt>
                <dd className="mt-1.5 font-display text-step-2 text-ink" data-numeric>
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Narrative ────────────────────────────────────────────────────
            Numbered chapters with the number hanging in the margin. Long
            single-column measure, because this is meant to be read. */}
        <div className="px-(--spacing-gutter) pt-10 pb-20">
          {coldharbour.chapters.map((chapter, i) => (
            <Reveal
              as="section"
              key={chapter.n}
              index={i}
              className="grid gap-x-12 gap-y-4 border-t border-rule py-12 md:grid-cols-[4rem_1fr] md:py-16"
            >
              <span
                aria-hidden="true"
                className="font-display text-step-3 leading-none text-accent"
                data-numeric
              >
                {String(chapter.n).padStart(2, "0")}
              </span>

              <div>
                <h2 className="max-w-[28ch] font-display text-step-4 leading-[1.08] tracking-[-0.015em] text-balance">
                  {chapter.heading}
                </h2>
                <div className="measure mt-6 flex flex-col gap-5">
                  {chapter.body.map((para) => (
                    <p key={para} className="text-step-1 leading-[1.65] text-ink-muted">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Stack ────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="stack"
          className="border-t border-rule bg-surface-raised px-(--spacing-gutter) py-14"
        >
          <h2 id="stack" className="text-step--1 tracking-[0.08em] text-ink-faint uppercase">
            Built with
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {coldharbour.stack.map((tech) => (
              <li key={tech} className="text-step-1 text-ink">
                {tech}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Onward ──────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="coldharbour-cta"
          className="border-t border-rule-strong bg-surface-sunken px-(--spacing-gutter) py-20 md:py-24"
        >
          <h2
            id="coldharbour-cta"
            className="max-w-[28ch] font-display text-step-4 leading-[1.08] tracking-[-0.015em] text-balance"
          >
            Want something with this much attention paid to it?
          </h2>
          <p className="measure mt-5 text-step-0 leading-[1.6] text-ink-muted">
            Bespoke projects get this treatment. Focused projects get the same
            foundations with a smaller surface. Either way, describe the
            business first.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact?intent=studio-brief"
              className="group inline-flex min-h-12 items-center gap-3 bg-accent px-6 text-step-0 font-medium text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
            >
              Start a brief
              <span
                aria-hidden="true"
                className="transition-transform duration-(--duration-ui) ease-(--ease-editorial) group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
            <Link
              href="/studio/work"
              className="inline-flex min-h-12 items-center border border-border-control px-6 text-step-0 text-ink transition-colors duration-(--duration-micro) hover:border-ink"
            >
              Back to work
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
