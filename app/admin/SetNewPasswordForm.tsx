"use client";

import { useActionState } from "react";
import { PasswordField } from "./PasswordField";
import { setOwnerPassword, type SetOwnerPasswordState } from "./actions";

export function SetNewPasswordForm() {
  const [state, action, pending] = useActionState<SetOwnerPasswordState, FormData>(
    setOwnerPassword,
    {},
  );

  return (
    <form action={action} className="flex max-w-sm flex-col gap-5">
      {state.error ? (
        <p role="alert" className="border border-accent bg-surface-raised p-4 text-step-0 text-ink">
          {state.error}
        </p>
      ) : null}

      <PasswordField
        id="new-password"
        name="password"
        label="New password"
        autoComplete="new-password"
        minLength={12}
      />
      <PasswordField
        id="confirm-password"
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        minLength={12}
      />

      <p className="text-step--1 leading-[1.5] text-ink-faint">
        Use at least 12 characters. A longer passphrase is easier to remember and harder to guess.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="label-instrument inline-flex min-h-12 items-center justify-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong disabled:cursor-progress disabled:opacity-70"
      >
        {pending ? "Saving password…" : "Set new password"}
      </button>
    </form>
  );
}
