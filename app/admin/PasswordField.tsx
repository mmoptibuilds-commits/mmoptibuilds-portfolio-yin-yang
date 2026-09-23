"use client";

import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
};

/** A labeled password control with an accessible visibility toggle. */
export function PasswordField({
  id,
  label,
  name,
  autoComplete,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label-instrument text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          className="min-h-11 w-full border border-border-control bg-surface-raised px-3 pr-16 text-step-0 text-ink"
        />
        <button
          type="button"
          aria-controls={id}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="label-instrument absolute inset-y-0 right-0 inline-flex min-h-11 items-center px-3 text-ink-muted underline decoration-rule-strong underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        >
          {visible ? "Hide" : "Show"}
          <span className="sr-only"> password</span>
        </button>
      </div>
    </div>
  );
}
