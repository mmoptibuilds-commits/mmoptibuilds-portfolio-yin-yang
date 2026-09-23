import Link from "next/link";
import { Mark } from "@/components/shared/Mark";
import { SkipLink } from "@/components/shared/SkipLink";
import { authMode } from "@/lib/owner-auth";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

export const dynamic = "force-dynamic";

type SearchParams = { reset?: string };

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

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
        <p className="label-instrument text-accent">Owner access</p>
        <h1 className="mt-5 max-w-[20ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
          Reset your password
        </h1>
        <p className="measure mt-5 text-step-0 text-ink-muted">
          Enter the email for your owner account. We’ll send a one-use link if it matches.
        </p>

        {params.reset === "invalid" ? (
          <p role="alert" className="mt-6 max-w-sm border border-accent bg-surface-raised p-4 text-step-0 text-ink">
            That reset link is missing, expired, or already used. Request a fresh link below.
          </p>
        ) : params.reset === "unavailable" ? (
          <p role="alert" className="mt-6 max-w-sm border border-accent bg-surface-raised p-4 text-step-0 text-ink">
            Password recovery is temporarily unavailable. Please return to the owner sign-in page.
          </p>
        ) : null}

        <div className="mt-8">
          {authMode === "supabase" ? (
            <ForgotPasswordForm />
          ) : (
            <p role="alert" className="max-w-sm border border-accent bg-surface-raised p-4 text-step-0 text-ink">
              Password recovery is available only when Supabase Auth is configured.
            </p>
          )}
        </div>

        <Link
          href="/admin"
          className="label-instrument mt-8 inline-flex min-h-11 self-start items-center text-ink-muted underline decoration-rule-strong underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink"
        >
          Back to owner sign in
        </Link>
      </main>
    </>
  );
}
