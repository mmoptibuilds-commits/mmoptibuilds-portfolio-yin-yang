import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/shared/Reveal";
import { workIndex } from "@/content/studio";
import { pageMetadata, jsonLd, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work — projects and labelled concepts | mmoptibuilds Studio",
  description:
    "Selected work from mmoptibuilds Studio. Every project is labelled by what it actually is: commissioned work, independent project or concept. No invented clients or results.",
  path: "/studio/work",
  division: "studio",
});

/**
 * The work index.
 *
 * There is one project. That is stated plainly rather than padded out with
 * concepts to make a grid look full — spec 16 forbids presenting experiments
 * as though they were commissioned work, and a thin portfolio described
 * honestly is more credible than a padded one.
 */
export default function WorkIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "Studio", path: "/studio" },
            { name: "Work", path: "/studio/work" },
          ]),
        )}
      />

      <section className="px-(--spacing-gutter) pt-14 pb-14 md:pt-20">
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
              Work
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 max-w-[24ch] font-display text-step-5 leading-[1.0] tracking-[-0.02em] text-balance">
          One project, described accurately.
        </h1>

        <p className="measure mt-7 text-step-1 leading-[1.6] text-ink-muted">
          Studio is new. Rather than fill this page with concepts presented as
          client work, there is one project here and it is labelled for what it
          is. Everything added later will carry the same label.
        </p>
      </section>

      <ul className="border-t border-rule">
        {workIndex.map((item, i) => (
          <Reveal as="li" key={item.slug} index={i} className="border-b border-rule">
            <Link
              href={item.href}
              className="group grid gap-x-12 gap-y-4 px-(--spacing-gutter) py-10 md:grid-cols-[1fr_minmax(0,38ch)] md:py-14"
            >
              <div>
                {/* The honesty label. Visible, not a footnote. */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="border border-rule-strong px-2 py-0.5 text-step--1 tracking-[0.06em] text-ink-muted uppercase">
                    {item.kindLabel}
                  </span>
                  <span className="text-step--1 text-ink-faint" data-numeric>
                    {item.year}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-step-6 leading-[0.95] tracking-[-0.02em]">
                  <span className="relative">
                    {item.title}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-(--duration-ui-lg) ease-(--ease-editorial) group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </span>
                </h2>

                <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-step--1 text-ink-faint">
                  {item.discipline.map((d, di) => (
                    <span key={d}>
                      {d}
                      {di < item.discipline.length - 1 ? (
                        <span aria-hidden="true" className="ml-3 text-rule-strong">
                          /
                        </span>
                      ) : null}
                    </span>
                  ))}
                </p>
              </div>

              <div className="md:pt-14">
                <p className="text-step-1 leading-[1.6] text-ink-muted">
                  {item.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-step-0 text-accent">
                  Read the case study
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-(--duration-ui) ease-(--ease-editorial) group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>

      <section
        aria-labelledby="work-cta"
        className="bg-surface-sunken px-(--spacing-gutter) py-20 md:py-24"
      >
        <h2
          id="work-cta"
          className="max-w-[28ch] font-display text-step-4 leading-[1.08] tracking-[-0.015em] text-balance"
        >
          A short portfolio is not the same as no experience.
        </h2>
        <p className="measure mt-5 text-step-0 leading-[1.6] text-ink-muted">
          If you want to see how a problem like yours would be approached, ask.
          You will get a specific answer about your site rather than a slide
          deck about someone else&rsquo;s.
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
