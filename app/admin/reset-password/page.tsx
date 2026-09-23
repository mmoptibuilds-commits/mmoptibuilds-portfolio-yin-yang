import Link from "next/link";
import { Mark } from "@/components/shared/Mark";
import { SkipLink } from "@/components/shared/SkipLink";
import { authMode, getOwnerSession } from "@/lib/owner-auth";
import { SetNewPasswordForm } from "../SetNewPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const session = authMode === "supabase" ? await getOwnerSession() : null;
  const ownerSession = session?.mode === "supabase" ? session : null;

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
          Choose a new password
        </h1>

        {ownerSession ? (
          <>
            <p className="measure mt-5 text-step-0 text-ink-muted">
              Set a new password for {ownerSession.email}.
            </p>
            <div className="mt-8">
              <SetNewPasswordForm />
            </div>
          </>
        ) : (
          <>
            <p role="alert" className="measure mt-5 text-step-0 text-ink-muted">
              This reset link is invalid, expired, or not for an owner account. Request a fresh link.
            </p>
            <Link
              href="/admin/forgot-password"
              className="label-instrument mt-8 inline-flex min-h-12 self-start items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
            >
              Request a new reset link
            </Link>
          </>
        )}

        <Link
          href="/admin"
          className="label-instrument mt-6 inline-flex min-h-11 self-start items-center text-ink-muted underline decoration-rule-strong underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink"
        >
          Back to owner sign in
        </Link>
      </main>
    </>
  );
}
