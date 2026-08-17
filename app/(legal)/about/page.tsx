import Link from "next/link";
import type { Metadata } from "next";
import { PlainShell, Prose } from "@/components/shared/PlainShell";
import { DatumRule } from "@/components/systems/DatumRule";
import { Reveal } from "@/components/shared/Reveal";
import { pageMetadata, jsonLd, breadcrumbSchema } from "@/lib/seo";
import { divisions } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About mmoptibuilds — founder-led, two divisions | mmoptibuilds",
  description:
    "mmoptibuilds is a founder-led technology brand in Bengaluru with two divisions: Systems for requirement-led hardware sourcing, and Studio for conversion-focused websites. How it works, and what it does not do.",
  path: "/about",
});

/**
 * About.
 *
 * The claim being made here is competence and honesty, not scale. It says
 * "one person" plainly, because pretending to be an agency is both a lie and
 * a worse pitch — spec 01 requires founder-visible positioning.
 */
export default function AboutPage() {
  return (
    <PlainShell currentPath="/about">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "mmoptibuilds", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />

      <section className="px-(--spacing-gutter) pt-16 pb-14 md:pt-24">
        <p className="label-instrument text-accent">About</p>
        <h1 className="mt-6 max-w-[24ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
          One person, two kinds of work.
        </h1>
        <Prose>
          <p className="mt-8 text-step-2 leading-[1.45] text-ink">
            mmoptibuilds is founder-led. Not a studio with a team page, not an
            agency with a stock photo of people pointing at a whiteboard. When
            you send an enquiry, the person who reads it is the person who does
            the work.
          </p>
          <p>
            That has consequences worth stating up front. It means the work is
            done by someone who understands both halves of it, and it means
            capacity is finite. If a project is not a good fit — wrong scope,
            wrong timing, wrong problem — you will be told rather than sold to.
          </p>
        </Prose>
      </section>

      {/* ── The two divisions, and why they coexist ─────────────────────────── */}
      <section
        aria-labelledby="divisions"
        className="border-t border-rule px-(--spacing-gutter) py-16"
      >
        <h2 id="divisions" className="label-instrument text-ink-faint">
          Why two divisions
        </h2>
        <DatumRule className="mt-4 mb-10" />

        <Prose>
          <p>
            Hardware and websites look like unrelated businesses. They share
            one thing that matters: both fail in the same way, which is
            somebody specifying a solution before understanding the
            requirement. A PC built to a price tier and a website built to a
            template are the same mistake in different materials.
          </p>
        </Prose>

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {Object.values(divisions).map((division, i) => (
            <Reveal
              key={division.key}
              index={i}
              className={i === 1 ? "md:border-l md:border-rule md:pl-12" : undefined}
            >
              <h3 className="font-display text-step-3 leading-[1.1] uppercase">
                {division.name}
              </h3>
              <p className="mt-3 text-step-1 text-ink">{division.proposition}</p>
              <p className="measure mt-3 text-step-0 leading-[1.6] text-ink-muted">
                {division.summary}
              </p>
              <Link
                href={division.href}
                className="label-instrument mt-5 inline-flex min-h-11 items-center text-accent transition-colors duration-(--duration-micro) hover:text-accent-strong"
              >
                Explore {division.name} &rarr;
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it actually works ──────────────────────────────────────────── */}
      <section
        aria-labelledby="how"
        className="border-t border-rule bg-surface-raised px-(--spacing-gutter) py-16"
      >
        <h2 id="how" className="label-instrument text-ink-faint">
          How working together goes
        </h2>

        <ol className="mt-10 flex flex-col">
          {[
            {
              t: "You describe the requirement",
              b: "A form, in your words. No account, no verification email, no sales call before you have said what you need.",
            },
            {
              t: "It gets researched properly",
              b: "For Systems: distributor availability, warranty terms, tax and delivery. For Studio: your current site, your market, what the site actually has to achieve.",
            },
            {
              t: "You get a specific reply",
              b: "Written by a person, after the work above. If the answer is that you need something smaller, cheaper, or different, that is what the reply says.",
            },
            {
              t: "Then the work, and then it is yours",
              b: "Hardware is sourced, assembled and tested where agreed. Websites are built, documented and handed over with your accounts under your control.",
            },
          ].map((step, i) => (
            <Reveal
              as="li"
              key={step.t}
              index={i}
              className="grid gap-x-8 gap-y-2 border-t border-rule py-6 md:grid-cols-[3.5rem_minmax(0,26ch)_1fr]"
            >
              <span
                aria-hidden="true"
                className="label-instrument text-accent"
                data-numeric
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-step-1 leading-[1.35] text-ink">{step.t}</h3>
              <p className="measure text-step-0 leading-[1.6] text-ink-muted">
                {step.b}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── What is deliberately not claimed ───────────────────────────────── */}
      <section
        aria-labelledby="not"
        className="border-t border-rule px-(--spacing-gutter) py-16"
      >
        <h2 id="not" className="label-instrument text-ink-faint">
          Things this site does not claim
        </h2>
        <DatumRule className="mt-4 mb-8" />
        <Prose>
          <p>
            There are no testimonials on this website, no client logos, no award
            badges and no statistics about traffic or revenue. That is not
            modesty — it is because those things do not exist yet, and putting
            them up anyway is the single most common lie on a portfolio site.
          </p>
          <p>
            Studio has one project in its portfolio and it is labelled as an
            independent project, because that is what it is. Systems holds no
            stock and publishes no prices, so it cannot tell you what something
            costs until it has been checked. When there is real proof, it will
            appear here and it will be checkable.
          </p>
        </Prose>

        <Link
          href="/about/story"
          className="label-instrument mt-8 inline-flex min-h-11 items-center text-accent transition-colors duration-(--duration-micro) hover:text-accent-strong"
        >
          The longer version &rarr;
        </Link>
      </section>

      <section
        aria-labelledby="about-cta"
        className="border-t border-rule-strong bg-surface-sunken px-(--spacing-gutter) py-20"
      >
        <h2
          id="about-cta"
          className="max-w-[26ch] font-display text-step-4 leading-[1.05] tracking-[-0.02em] uppercase"
        >
          Describe the problem in plain words
        </h2>
        <p className="measure mt-5 text-step-0 text-ink-muted">
          You do not need to know which division you need, or what the solution
          is. That is the part that gets worked out.
        </p>
        <Link
          href="/contact"
          className="label-instrument mt-8 inline-flex min-h-12 items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
        >
          Start an enquiry &rarr;
        </Link>
      </section>
    </PlainShell>
  );
}
