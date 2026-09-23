"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type SignInState } from "./actions";
import { PasswordField } from "./PasswordField";
import { cn } from "@/lib/cn";

/**
 * Owner sign-in form. Client component only for the pending/error state.
 * The email field is hidden in dev mode, where there is no user record.
 */
export function SignInForm({ mode }: { mode: "supabase" | "dev" | "locked" }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});

  if (mode === "locked") {
    return (
      <div className="border border-accent bg-surface-raised p-6" role="alert">
        <h2 className="label-instrument text-accent">Not configured</h2>
        <p className="measure mt-3 text-step-0 leading-[1.6] text-ink-muted">
          Owner access needs Supabase credentials. Set{" "}
          <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-ink">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>,
          run the migration in <code className="text-ink">supabase/migrations</code>,
          then add your user id to <code className="text-ink">owner_accounts</code>.
        </p>
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

      {mode === "supabase" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="label-instrument text-ink-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="min-h-11 border border-border-control bg-surface-raised px-3 text-step-0 text-ink"
          />
        </div>
      ) : (
        <p className="label-instrument text-ink-faint">
          Development mode &mdash; password only
        </p>
      )}

      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "label-instrument inline-flex min-h-12 items-center justify-center bg-accent px-6",
          "text-accent-contrast transition-colors duration-(--duration-micro)",
          "hover:bg-accent-strong disabled:cursor-progress disabled:opacity-70",
        )}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>

      {mode === "supabase" ? (
        <Link
          href="/admin/forgot-password"
          className="label-instrument min-h-11 self-start py-3 text-ink-muted underline decoration-rule-strong underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Forgot your password?
        </Link>
      ) : null}
    </form>
  );
}
