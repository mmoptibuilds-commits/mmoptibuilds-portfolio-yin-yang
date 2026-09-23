"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type PasswordResetRequestState } from "./actions";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<PasswordResetRequestState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.sent) {
    return (
      <div className="border border-rule bg-surface-raised p-5" role="status" aria-live="polite">
        <p className="label-instrument text-ink">Check your inbox</p>
        <p className="measure mt-3 text-step-0 leading-[1.6] text-ink-muted">
          If that email belongs to an owner account, a reset link is on its way. Check your spam
          folder too.
        </p>
        <Link
          href="/admin/forgot-password?retry=1"
          className="label-instrument mt-5 inline-flex min-h-11 items-center text-ink underline decoration-rule-strong underline-offset-4 hover:text-accent"
        >
          Send another link
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex max-w-sm flex-col gap-5">
      {state.error ? (
        <p role="alert" className="border border-accent bg-surface-raised p-4 text-step-0 text-ink">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="recovery-email" className="label-instrument text-ink-muted">
          Owner account email
        </label>
        <input
          id="recovery-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="min-h-11 border border-border-control bg-surface-raised px-3 text-step-0 text-ink"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="label-instrument inline-flex min-h-12 items-center justify-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong disabled:cursor-progress disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
