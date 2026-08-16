import { site } from "@/lib/site";

/**
 * The gateway headline.
 *
 * The H1 spans the full viewport and crosses the seam between the two
 * division materials. Rather than duplicating the text into a light copy and
 * a dark copy — which would read twice to a screen reader — a single element
 * is painted with a hard-stop gradient clipped to the glyphs, so the left
 * half is Systems ink on graphite and the right half is Studio ink on paper.
 *
 * No JavaScript. The text is the LCP element, so it is fully painted on
 * first render with no entrance animation delaying it.
 */
export function GatewayIntro() {
  return (
    <div className="relative flex flex-1 flex-col justify-center py-16">
      <h1 className="gateway-headline px-(--spacing-gutter) font-display text-step-6 leading-[0.92] tracking-[-0.03em] uppercase">
        Two kinds of
        <br />
        technical work.
        <br />
        <span className="gateway-headline-quiet">One standard of care.</span>
      </h1>

      {/* Specification readout. Real facts, tabular figures, instrument voice.
          Sits inside the Systems half at every breakpoint so its tokens are
          unambiguous. */}
      <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 px-(--spacing-gutter) md:mt-14 md:w-1/2 md:pr-10">
        {[
          { k: "Divisions", v: "02" },
          { k: "Based in", v: site.market.city },
          { k: "Stock held", v: "None" },
          { k: "Model", v: "Quote first" },
        ].map((item) => (
          <div key={item.k} className="flex flex-col gap-1">
            <dt className="label-instrument text-ink-faint">{item.k}</dt>
            <dd className="label-instrument text-ink" data-numeric>
              {item.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
