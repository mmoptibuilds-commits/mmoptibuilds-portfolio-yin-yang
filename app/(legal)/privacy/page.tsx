import Link from "next/link";
import type { Metadata } from "next";
import { PlainShell, Prose } from "@/components/shared/PlainShell";
import { pageMetadata } from "@/lib/seo";
import { CONSENT_VERSION, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy notice | mmoptibuilds",
  description:
    "What mmoptibuilds collects when you submit an enquiry, why, how long it is kept, who can see it, and how to have it deleted. Written to match what the site actually does.",
  path: "/privacy",
});

/**
 * Privacy notice.
 *
 * Every statement here describes behaviour that is actually implemented in
 * lib/enquiry-store.ts, app/actions/enquiry.ts and the Supabase policies. It
 * deliberately does NOT contain jurisdiction-specific legal language: spec 14
 * requires professional India privacy, GST and contract review before launch,
 * and inventing that text would be worse than marking it for review.
 */

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

export default function PrivacyPage() {
  return (
    <PlainShell currentPath="/privacy">
      <div className="px-(--spacing-gutter) pt-16 pb-20 md:pt-20">
        <h1 className="max-w-[24ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
          Privacy notice
        </h1>

        <Prose>
          <p className="mt-6 text-step-1 text-ink">
            This describes what happens to information you send through this
            website. It is written to match what the code does, not to be
            reassuring in general terms.
          </p>
          <p className="text-step--1 text-ink-faint">
            Notice version <span data-numeric>{CONSENT_VERSION}</span>. The
            version shown to you at the time is recorded against your
            submission, so a later edit to this page cannot change what you
            agreed to.
          </p>
        </Prose>

        <div className="mt-12">
          <Section id="what" title="What is collected">
            <p>
              Only what you type into an enquiry form, plus a small amount of
              technical context needed to stop abuse:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                <strong>Your answers.</strong> Name, email address, an optional
                phone number, and the fields for the enquiry type you chose.
              </li>
              <li>
                <strong>Which page you submitted from</strong>, so the reply has
                context.
              </li>
              <li>
                <strong>A one-way fingerprint</strong> derived from your IP
                address and browser, used for rate limiting. Your IP address
                itself is <strong>not stored</strong> — only a salted hash that
                cannot be reversed back to it.
              </li>
              <li>
                <strong>Whether the browser check passed</strong>, and how long
                the form took to complete.
              </li>
            </ul>
            <p>
              There is no visitor account, no password, no tracking pixel, no
              advertising cookie and no third-party marketing script on this
              site.
            </p>
          </Section>

          <Section id="why" title="Why">
            <p>
              To reply to your enquiry and to prepare a quote. That is the only
              purpose. Your details are not used for marketing email, are not
              sold, and are not shared with anyone for their own purposes.
            </p>
            <p>
              Where a quote requires checking availability with a distributor,
              the <strong>specification</strong> is discussed with them &mdash;
              your name and contact details are not.
            </p>
          </Section>

          <Section id="ai" title="Analytics and AI tools">
            <p>
              Nothing you type into an enquiry form is sent to analytics or to
              any AI service. Conversion measurement records that a form was
              started and completed, and on which page &mdash; never the
              contents. This is a deliberate architectural boundary, not a
              policy promise.
            </p>
          </Section>

          <Section id="who" title="Who can see it">
            <p>
              One person: the owner of mmoptibuilds, through an authenticated
              dashboard. Enquiries are stored with database-level access rules
              that permit submission but not reading, so the public key this
              website uses cannot retrieve a single enquiry even if it were
              extracted from the page.
            </p>
            <p>
              Infrastructure providers process data on our behalf as part of
              hosting it: Cloudflare (delivery, abuse prevention) and Supabase
              (database). They do not use it for their own purposes.
            </p>
          </Section>

          <Section id="long" title="How long it is kept">
            <p>
              Enquiries that lead to work are kept for as long as needed for
              that work and any warranty period. Enquiries that do not are kept
              while they might still be useful and then deleted.
            </p>
            <p className="border-l-2 border-accent pl-4 text-ink">
              A specific retention period is being set as part of the
              professional review noted below, rather than stated here as a
              number that has not been checked.
            </p>
          </Section>

          <Section id="rights" title="Asking for a copy, or deletion">
            <p>
              Send an enquiry through the{" "}
              <Link href="/contact">contact form</Link> quoting your reference
              ID and say what you want: a copy of what was submitted, a
              correction, or deletion. Deletion is honoured unless the
              information is still needed for work in progress, in which case
              you will be told what is being kept and why.
            </p>
            <p>
              Because there is no account system, your reference ID is how a
              request is matched to a submission. It is shown on screen after
              you submit.
            </p>
          </Section>

          <Section id="review" title="Legal review status">
            <p className="border-l-2 border-accent pl-4 text-ink">
              This notice describes actual system behaviour accurately, but has
              not yet been reviewed by a qualified professional in India. Data
              protection, GST and contract terms are under review before
              commercial launch. Nothing here should be read as a statement
              about statutory rights under Indian law.
            </p>
          </Section>

          <Section id="changes" title="Changes">
            <p>
              Material changes bump the notice version. Submissions keep the
              version that was displayed when they were made, so this page
              changing does not retroactively alter your consent.
            </p>
            <p>
              Registered in {site.market.city}, {site.market.country}. Contact
              is by <Link href="/contact">enquiry form</Link>; no email address
              is published on this site to keep it out of scrapers.
            </p>
          </Section>
        </div>
      </div>
    </PlainShell>
  );
}
