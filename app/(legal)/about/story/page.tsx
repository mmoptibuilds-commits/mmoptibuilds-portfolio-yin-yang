import Link from "next/link";
import type { Metadata } from "next";
import { PlainShell, Prose } from "@/components/shared/PlainShell";
import { Reveal } from "@/components/shared/Reveal";
import { pageMetadata, jsonLd, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The longer story — how mmoptibuilds got here | mmoptibuilds",
  description:
    "Why mmoptibuilds spans hardware sourcing and web development, what that combination is actually good for, and the reasoning behind a quote-first model with no published prices.",
  path: "/about/story",
});

const sections = [
  {
    heading: "Two halves of the same habit",
    body: [
      "Specifying a computer and building a website are the same activity performed on different material. In both cases the useful work happens before anything is assembled: understanding what the thing has to do, under what constraints, for whom, and what happens if it is wrong.",
      "Most of the bad outcomes in both fields come from skipping that. A build gets chosen from a price tier because the tier was easier than the conversation. A website gets a template because the template was faster than deciding what the business actually sells. Both produce something that works and misses.",
    ],
  },
  {
    heading: "Why quote-first, and why it is slower",
    body: [
      "There is no price list on this site and that is a deliberate cost. Publishing prices would win enquiries from people comparing numbers, and it would produce quotes that are wrong by the time they are read — component pricing in India moves with import duty, distributor allocation and the exchange rate.",
      "The alternative is slower and honest: you describe the requirement, availability and terms get confirmed, and then one figure arrives that holds. It loses the visitors who wanted a number in ten seconds. It keeps the ones who wanted the right machine.",
    ],
  },
  {
    heading: "What the combination is actually good for",
    body: [
      "The overlap is narrower than a marketing page would claim, so here is the honest version. Knowing hardware makes web work better in one specific way: it makes performance a physical intuition rather than a score. A page that feels fine on a development machine and bad on a mid-range phone is obvious if you have spent time thinking about thermal limits and memory bandwidth.",
      "Beyond that, the two divisions are separate businesses that share a standard of care and nothing else. They are presented separately on this site for exactly that reason — a visitor sourcing enterprise drives does not need to read about typography.",
    ],
  },
  {
    heading: "On being one person",
    body: [
      "The obvious objection to a founder-led operation is capacity, and it is a fair one. The answer is not to pretend otherwise but to scope accordingly: fewer projects, honestly sequenced, with the boundaries written down before work starts rather than discovered during it.",
      "The 30-day bug-fix window, the client-owned hosting, the access removal at handover — these exist because a one-person operation has to be the kind of supplier you can leave. A website you cannot maintain without me would be a worse product, however convenient it might be commercially.",
    ],
  },
];

export default function StoryPage() {
  return (
    <PlainShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "About", path: "/about" },
            { name: "Story", path: "/about/story" },
          ]),
        )}
      />

      <article className="px-(--spacing-gutter) pt-16 pb-20 md:pt-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/about"
                className="label-instrument text-ink-faint transition-colors duration-(--duration-micro) hover:text-accent"
              >
                About
              </Link>
            </li>
            <li aria-hidden="true" className="label-instrument text-ink-faint">
              /
            </li>
            <li className="label-instrument text-ink-muted" aria-current="page">
              Story
            </li>
          </ol>
        </nav>

        <h1 className="mt-8 max-w-[26ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
          The longer version
        </h1>

        <Prose>
          <p className="mt-8 text-step-2 leading-[1.45] text-ink">
            The short version is on the{" "}
            <Link href="/about">about page</Link>. This is the reasoning behind
            it, for anyone deciding whether to trust a supplier they have not
            met.
          </p>
        </Prose>

        <div className="mt-16 flex flex-col">
          {sections.map((section, i) => (
            <Reveal
              as="section"
              key={section.heading}
              index={i}
              className="grid gap-x-12 gap-y-4 border-t border-rule py-10 md:grid-cols-[4rem_1fr] md:py-14"
            >
              <span
                aria-hidden="true"
                className="label-instrument text-accent"
                data-numeric
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="max-w-[28ch] font-display text-step-3 leading-[1.12] uppercase">
                  {section.heading}
                </h2>
                <Prose>
                  <div className="mt-5 flex flex-col gap-5">
                    {section.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </Prose>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 border-t border-rule-strong pt-10">
          <Link
            href="/contact"
            className="label-instrument inline-flex min-h-12 items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
          >
            Start a conversation &rarr;
          </Link>
        </div>
      </article>
    </PlainShell>
  );
}
