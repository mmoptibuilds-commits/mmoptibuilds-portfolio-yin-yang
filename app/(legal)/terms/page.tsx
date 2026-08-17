import Link from "next/link";
import type { Metadata } from "next";
import { PlainShell, Prose } from "@/components/shared/PlainShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms | mmoptibuilds",
  description:
    "Terms for using this website and for submitting an enquiry: what a quote is, what a website project includes, the 30-day bug-fix warranty, and hardware sourcing boundaries.",
  path: "/terms",
});

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section aria-labelledby={id} className="border-t border-rule py-10">
    <h2 id={id} className="font-display text-step-2 leading-[1.15] uppercase">
      {title}
    </h2>
    <div className="mt-5">
      <Prose>{children}</Prose>
    </div>
  </section>
);

export default function TermsPage() {
  return (
    <PlainShell currentPath="/terms">
      <div className="px-(--spacing-gutter) pt-16 pb-20 md:pt-20">
        <h1 className="max-w-[24ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
          Terms
        </h1>

        <Prose>
          <p className="mt-6 text-step-1 text-ink">
            These cover using this website and submitting an enquiry. Project
            work is governed by a written agreement signed before work starts,
            not by this page.
          </p>
        </Prose>

        <div className="mt-12">
          <Section id="enquiries" title="Enquiries and quotes">
            <p>
              Submitting an enquiry does not create a contract and does not
              reserve stock, capacity or a price. A quote is an offer to supply
              on stated terms; it becomes binding only when accepted in writing
              and is valid for the period stated on it.
            </p>
            <p>
              Quotes depend on information confirmed at the time of issue.
              Component availability, distributor pricing, warranty terms,
              taxes and freight can change. Where they change before
              acceptance, a revised quote is issued rather than the original
              being quietly honoured or quietly withdrawn.
            </p>
          </Section>

          <Section id="hardware" title="Hardware sourcing">
            <p>
              No stock is held. Products are sourced from distributors after a
              request, so nothing on this website is an offer of goods in
              possession and no delivery date is promised before it is
              confirmed.
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                Manufacturer warranty applies as supplied. mmoptibuilds does not
                extend or replace it.
              </li>
              <li>
                For complete PCs, assembly and testing are performed where
                agreed in the quote.
              </li>
              <li>
                Enterprise supply is <strong>sourcing and delivery only</strong>
                . Installation, rack work, cabling, network configuration and
                managed infrastructure are outside scope.
              </li>
              <li>
                Where you specify an exact part number, the specification is
                yours. Compatibility with equipment already in service is not
                guaranteed unless expressly stated in writing.
              </li>
              <li>Grey-market and parallel-import stock is not supplied.</li>
            </ul>
          </Section>

          <Section id="websites" title="Website projects">
            <p>
              Scope, deliverables, milestones and fees are defined per project
              in a written agreement. In every case:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                <strong>You own your domain and hosting accounts.</strong>{" "}
                Deployment is performed once using temporary collaborator
                access, which is then removed. A handover document is provided.
              </li>
              <li>
                <strong>You own the delivered site</strong> on final payment,
                including the code written for you. Third-party libraries remain
                under their own licences.
              </li>
              <li>
                <strong>A 30-day bug-fix window</strong> runs from launch,
                covering reproducible defects in what was built. It does not
                cover content changes, new features, changes to third-party
                services, or problems caused by later edits by others.
              </li>
              <li>
                Content you supply must be yours to use. Responsibility for
                copyright in supplied text, images and logos rests with you.
              </li>
            </ul>
            <p>
              No guarantee is offered about search ranking, traffic volume,
              conversion rate or revenue. Anyone offering one is guessing.
            </p>
          </Section>

          <Section id="site" title="Using this website">
            <p>
              Content on this site is provided for information. The design,
              copy and code of this website are its own work and are not
              licensed for reuse.
            </p>
            <p>
              Automated scraping, bulk submission of forms, and attempts to
              probe or bypass the abuse controls are not permitted.
            </p>
          </Section>

          <Section id="liability" title="Liability">
            <p>
              Nothing here excludes liability that cannot lawfully be excluded.
              Subject to that, liability arising from a project is limited to
              the fees paid for that project, and does not extend to indirect
              or consequential loss including lost profit, lost data or business
              interruption.
            </p>
            <p className="border-l-2 border-accent pl-4 text-ink">
              This clause and the governing-law position are under professional
              review in India before commercial launch. They are stated here in
              plain terms rather than in borrowed legal language that has not
              been checked.
            </p>
          </Section>

          <Section id="contact" title="Questions">
            <p>
              Ask through the <Link href="/contact">enquiry form</Link> before
              committing to anything. A question about terms gets a direct
              answer, and it is better asked now than discovered later.
            </p>
          </Section>
        </div>
      </div>
    </PlainShell>
  );
}
