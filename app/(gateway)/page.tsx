import type { Metadata } from "next";
import Link from "next/link";
import { gatewayFontClass } from "@/lib/fonts";
import { site, divisions } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { SkipLink } from "@/components/shared/SkipLink";
import { Mark } from "@/components/shared/Mark";
import { Reveal } from "@/components/shared/Reveal";
import { DatumRule } from "@/components/systems/DatumRule";
import { GatewayIntro } from "@/components/gateway/GatewayIntro";

export const metadata: Metadata = pageMetadata({
  title: `${site.legalDisplayName} — ${site.tagline}`,
  description: site.description,
  path: "/",
});

/**
 * The gateway.
 *
 * Concept: one company, two materials, meeting at a seam. The headline
 * crosses that seam and inverts as it crosses — a single element with a
 * hard-stop gradient clipped to the text, so it stays one accessible H1
 * rather than two duplicated copies.
 *
 * The parent brand's base material is the technical one. Both divisions then
 * get an identical, full-bleed, equal-height section in their own material,
 * so neither is subordinate — spec 05 requires equal prominence on root.
 */
export default function GatewayPage() {
  return (
    <div className={`division-systems bg-surface text-ink ${gatewayFontClass}`}>
      <SkipLink />

      {/* ── Hero: the diptych ─────────────────────────────────────────── */}
      <header className="relative isolate min-h-dvh overflow-hidden">
        {/* The two materials. Fixed 50/50 on desktop so nothing animates
            layout; stacked on mobile where a split would be unreadable. */}
        <div className="absolute inset-0 grid grid-rows-2 md:grid-cols-2 md:grid-rows-1">
          <div className="division-systems bg-surface" />
          <div className="division-studio bg-surface" />
        </div>

        {/* The seam. Decorative — the two links below carry the meaning. */}
        <div
          aria-hidden="true"
          className="gateway-seam absolute inset-x-0 top-1/2 h-px origin-center -translate-y-px bg-rule-strong md:inset-y-0 md:left-1/2 md:h-auto md:w-px md:translate-y-0 md:-translate-x-px md:origin-top"
        />

        <div className="relative flex min-h-dvh flex-col">
          <div className="flex items-center justify-between px-(--spacing-gutter) py-5">
            <Mark />
            <Link
              href="/contact"
              className="label-instrument min-h-11 content-center px-2 text-ink transition-colors duration-(--duration-micro) hover:text-accent"
            >
              Enquire
            </Link>
          </div>

          <GatewayIntro />

          {/* Division entry points. Equal weight, equal size, both reachable
              by keyboard in reading order. */}
          <div className="mt-auto grid md:grid-cols-2">
            <GatewayPanel
              division="systems"
              index="01"
              eyebrow="Systems"
              proposition={divisions.systems.proposition}
              detail="Custom PCs, workstations, business systems and exact-spec enterprise hardware. No stock is held — availability, warranty and price are confirmed with distributors before you get a quote."
              href={divisions.systems.href}
              cta="Explore Systems"
            />
            <GatewayPanel
              division="studio"
              index="02"
              eyebrow="Studio"
              proposition={divisions.studio.proposition}
              detail="Conversion-focused websites for businesses, startups and teams replacing an outdated presence. Your domain and hosting stay in your control."
              href={divisions.studio.href}
              cta="Explore Studio"
            />
          </div>
        </div>
      </header>

      <main id="main">
        {/* ── The operating model ───────────────────────────────────────── */}
        <section
          aria-labelledby="how-it-works"
          className="border-t border-rule px-(--spacing-gutter) py-20 md:py-28"
        >
          <Reveal>
            <DatumRule label="How this works" className="mb-12" />
          </Reveal>

          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,32ch)_1fr]">
            <div>
              <h2
                id="how-it-works"
                className="font-display text-step-4 leading-[1.02] tracking-[-0.02em] text-balance uppercase"
              >
                Nothing is pre-made
              </h2>
              <p className="measure-tight mt-6 text-step-1 text-ink-muted">
                Both divisions start the same way: with what you actually need,
                written down. A shelf product would be faster to sell. It would
                also be the wrong product more often than not.
              </p>
            </div>

            <ol className="grid gap-px bg-rule sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "You describe the requirement",
                  body: "A workload, a part number, or a business goal. Structured questions, no jargon, and budget stays private.",
                },
                {
                  step: "02",
                  title: "It gets researched",
                  body: "Systems: distributor availability, warranty and tax confirmed. Studio: scope, audience and the one action the site must drive.",
                },
                {
                  step: "03",
                  title: "You get a specific reply",
                  body: "A quote or a scoped proposal written against your requirement — by email, from a person who read it.",
                },
              ].map((item, i) => (
                <li key={item.step} className="bg-surface p-6 md:p-8">
                  <Reveal index={i}>
                    <span className="label-instrument text-accent" data-numeric>
                      {item.step}
                    </span>
                    <h3 className="mt-4 font-display text-step-1 uppercase">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-step--1 text-ink-muted">{item.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Closing: single, low-pressure route to contact ────────────── */}
        <section
          aria-labelledby="gateway-contact"
          className="border-t border-rule px-(--spacing-gutter) py-20 md:py-28"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2
                id="gateway-contact"
                className="font-display text-step-3 uppercase text-balance"
              >
                Not sure which side you need?
              </h2>
              <p className="measure mt-4 text-step-0 text-ink-muted">
                Describe the problem in plain words. If it is the wrong division,
                you will be told so rather than sold something.
              </p>
            </div>
            <Link
              href="/contact"
              className="label-instrument inline-flex min-h-12 shrink-0 items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
            >
              Start an enquiry
            </Link>
          </div>
        </section>

        <footer className="border-t border-rule-strong px-(--spacing-gutter) py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-step--1 text-ink-faint">
              &copy; {new Date().getFullYear()} mmoptibuilds. Bengaluru, India.
            </p>
            <ul className="flex gap-6">
              {[
                { label: "About", href: "/about" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-step--1 text-ink-muted transition-colors duration-(--duration-micro) hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
}

function GatewayPanel({
  division,
  index,
  eyebrow,
  proposition,
  detail,
  href,
  cta,
}: {
  division: "systems" | "studio";
  index: string;
  eyebrow: string;
  proposition: string;
  detail: string;
  href: string;
  cta: string;
}) {
  const isSystems = division === "systems";

  return (
    <div
      className={`division-${division} group relative border-t border-rule px-(--spacing-gutter) py-10 md:border-t-0 md:py-14`}
    >
      <div className="flex items-baseline gap-3">
        <span
          className={isSystems ? "label-instrument text-accent" : "text-step--1 tracking-[0.1em] uppercase text-accent"}
          data-numeric
        >
          {index}
        </span>
        <span
          className={
            isSystems
              ? "label-instrument text-ink"
              : "text-step--1 tracking-[0.1em] uppercase text-ink"
          }
        >
          {eyebrow}
        </span>
      </div>

      <p
        className={
          isSystems
            ? "mt-4 font-display text-step-2 leading-[1.1] uppercase text-balance"
            : "mt-4 font-display text-step-3 leading-[1.05] text-balance"
        }
      >
        {proposition}
      </p>

      <p className="measure-tight mt-4 text-step--1 text-ink-muted">{detail}</p>

      {/* The whole panel is the target, but the link itself is what focuses,
          so keyboard and pointer get the same affordance. */}
      <Link
        href={href}
        className={`mt-7 inline-flex min-h-11 items-center gap-2.5 text-ink transition-colors duration-(--duration-micro) hover:text-accent ${
          isSystems ? "label-instrument" : "text-step-0 font-medium"
        }`}
      >
        <span className="absolute inset-0" aria-hidden="true" />
        {cta}
        <svg
          width="22"
          height="8"
          viewBox="0 0 22 8"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-(--duration-ui) ease-(--ease-mech) group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          <path d="M0 4h20M17 1l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </Link>
    </div>
  );
}
