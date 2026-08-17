import Link from "next/link";
import { Mark } from "@/components/shared/Mark";
import { SkipLink } from "@/components/shared/SkipLink";
import { DatumRule } from "@/components/systems/DatumRule";
import { authMode, getOwnerSession } from "@/lib/owner-auth";
import { listEnquiries, storageBackend } from "@/lib/enquiry-store";
import { SignInForm } from "./SignInForm";
import { EnquiryRow } from "./EnquiryRow";
import { signOut } from "./actions";

/**
 * Owner console.
 *
 * Always dynamic: it reads a session and personal data, so a cached render
 * would be both wrong and a disclosure risk.
 */
export const dynamic = "force-dynamic";

type Search = { status?: string; division?: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const session = await getOwnerSession();

  if (!session) {
    return (
      <>
        <SkipLink />
        <header className="border-b border-rule px-(--spacing-gutter) py-4">
          <Mark />
        </header>
        <main
          id="main"
          className="flex min-h-[70dvh] flex-col justify-center px-(--spacing-gutter) py-16"
        >
          <p className="label-instrument text-accent">Restricted</p>
          <h1 className="mt-5 max-w-[20ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
            Owner console
          </h1>
          <p className="measure mt-5 text-step-0 text-ink-muted">
            This area holds enquiry data. If you are not the owner, there is
            nothing here for you &mdash; the{" "}
            <Link href="/" className="text-ink underline decoration-accent underline-offset-4">
              public site
            </Link>{" "}
            is that way.
          </p>
          <div className="mt-10">
            <SignInForm mode={authMode} />
          </div>
        </main>
      </>
    );
  }

  const params = await searchParams;
  const all = await listEnquiries();

  const filtered = all.filter((row) => {
    if (params.status && row.status !== params.status) return false;
    if (params.division && row.division !== params.division) return false;
    return true;
  });

  const counts = {
    total: all.length,
    new: all.filter((r) => r.status === "new").length,
    systems: all.filter((r) => r.division === "systems").length,
    studio: all.filter((r) => r.division === "studio").length,
  };

  const filters: { label: string; href: string; active: boolean }[] = [
    { label: "All", href: "/admin", active: !params.status && !params.division },
    { label: "New", href: "/admin?status=new", active: params.status === "new" },
    {
      label: "Systems",
      href: "/admin?division=systems",
      active: params.division === "systems",
    },
    {
      label: "Studio",
      href: "/admin?division=studio",
      active: params.division === "studio",
    },
  ];

  return (
    <>
      <SkipLink />

      <header className="sticky top-0 z-80 border-b border-rule bg-surface/95 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 px-(--spacing-gutter) py-3">
          <div className="flex items-center gap-5">
            <Mark />
            <span aria-hidden="true" className="h-4 w-px bg-rule-strong" />
            <span className="label-instrument text-ink">Owner console</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="label-instrument hidden text-ink-faint sm:inline">
              {session.email}
            </span>
            {storageBackend === "file" ? (
              <span
                className="label-instrument border border-accent px-2 py-0.5 text-accent"
                title="Enquiries are being written to .enquiries/ on disk, not Supabase"
              >
                Local store
              </span>
            ) : null}
            <form action={signOut}>
              <button
                type="submit"
                className="label-instrument min-h-11 text-ink-muted transition-colors duration-(--duration-micro) hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="px-(--spacing-gutter) pt-10 pb-6">
          <h1 className="font-display text-step-4 leading-[1.05] tracking-[-0.02em] uppercase">
            Inbox
          </h1>

          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { k: "Total", v: counts.total },
              { k: "New", v: counts.new },
              { k: "Systems", v: counts.systems },
              { k: "Studio", v: counts.studio },
            ].map((stat) => (
              <div key={stat.k}>
                <dt className="label-instrument text-ink-faint">{stat.k}</dt>
                <dd
                  className="mt-1 font-display text-step-3 text-ink"
                  data-numeric
                >
                  {String(stat.v).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>

          <DatumRule className="mt-8" />

          <nav aria-label="Filter enquiries" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <li key={f.href}>
                  <Link
                    href={f.href}
                    aria-current={f.active ? "page" : undefined}
                    className={
                      f.active
                        ? "label-instrument inline-flex min-h-11 items-center border border-accent px-4 text-accent"
                        : "label-instrument inline-flex min-h-11 items-center border border-rule-strong px-4 text-ink-muted transition-colors duration-(--duration-micro) hover:border-ink hover:text-ink"
                    }
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {filtered.length === 0 ? (
          <p className="border-t border-rule px-(--spacing-gutter) py-16 text-step-1 text-ink-muted">
            {all.length === 0
              ? "No enquiries yet. Submissions will appear here as they arrive."
              : "No enquiries match that filter."}
          </p>
        ) : (
          <>
            {/* Column headings, desktop only — on mobile each row is a stack
                and repeated headings would be noise. */}
            <div
              aria-hidden="true"
              className="hidden border-t border-rule-strong px-(--spacing-gutter) py-2 md:grid md:grid-cols-[7rem_9rem_1fr_10rem_6rem] md:gap-x-6"
            >
              {["Ref", "Type", "From", "Received", "Status"].map((h) => (
                <span key={h} className="label-instrument text-ink-faint">
                  {h}
                </span>
              ))}
            </div>

            <ul className="border-t border-rule">
              {filtered.map((row) => (
                <li key={row.id}>
                  <EnquiryRow row={row} />
                </li>
              ))}
            </ul>

            <p className="label-instrument px-(--spacing-gutter) py-8 text-ink-faint">
              Showing {filtered.length} of {all.length}
              {params.status ? ` · status: ${params.status}` : ""}
              {params.division ? ` · division: ${params.division}` : ""}
            </p>
          </>
        )}
      </main>
    </>
  );
}
