"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { submitEnquiry, type EnquiryFormState } from "@/app/actions/enquiry";
import { cn } from "@/lib/cn";

/**
 * The shell every enquiry form renders inside.
 *
 * Handles the parts that are easy to get wrong and must behave identically on
 * all three forms:
 *
 *   - useActionState, so the form still submits without client JS
 *   - an error summary that receives focus, because a message beside field 9
 *     of 12 is invisible to a screen-reader user who just pressed Submit
 *   - a success view that replaces the form and announces itself
 *   - renderedAt for the minimum-completion-time check
 *   - a submit button that reports its own pending state
 */

const initialState: EnquiryFormState = { status: "idle" };

export function EnquiryForm({
  intent,
  sourcePath,
  title,
  intro,
  submitLabel,
  children,
  tone,
}: {
  intent: string;
  sourcePath: string;
  title: string;
  intro: string;
  submitLabel: string;
  /** Fields receive the current error map so they can render inline messages. */
  children: (errors: Record<string, string>, values: Record<string, string>) => React.ReactNode;
  tone: "instrument" | "editorial";
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  /* The mount time, used for the minimum-completion-time check.

     Stamped onto the hidden input's DOM node from an effect. This is the one
     thing effects are actually for — pushing a value into something outside
     React — and it avoids both alternatives, which are worse: setState in an
     effect causes a cascading render, and reading a ref during render is
     unsound because React may not re-run the render that reads it.

     It must be a client-side timestamp. A server-rendered one would be the
     render time, which can be cached — and a cached timestamp would make every
     later submission look implausibly slow. If JavaScript never runs, the
     value stays empty and the server skips the timing check entirely, which is
     the correct degradation: an untimed submission is not a suspicious one. */
  const renderedAtInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renderedAtInputRef.current) {
      renderedAtInputRef.current.value = String(Date.now());
    }
  }, []);

  // Move focus to whichever outcome appeared. Without this the page looks
  // unchanged to anyone not watching the top of the viewport.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const isInstrument = tone === "instrument";
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="border border-signal/40 bg-surface-raised p-6 md:p-8"
      >
        <h2
          className={cn(
            "text-signal",
            isInstrument ? "label-instrument" : "text-step--1 tracking-[0.08em] uppercase",
          )}
        >
          Enquiry received
        </h2>

        <p
          className={cn(
            "mt-4",
            isInstrument
              ? "font-display text-step-4 uppercase"
              : "font-display text-step-4",
          )}
        >
          Your reference is{" "}
          <span className="text-accent" data-numeric>
            {state.reference}
          </span>
        </p>

        <p className="measure mt-5 text-step-0 leading-[1.6] text-ink-muted">
          Quote it if you follow up. Your requirements will be reviewed and you
          will get a reply by email &mdash; a real one, written after the parts
          or the scope have actually been looked at. No automated quote is
          coming, and there is no deadline being promised here that could not
          be met.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className={cn(
              "inline-flex min-h-12 items-center border border-border-control px-5 text-ink",
              "transition-colors duration-(--duration-micro) hover:border-ink",
              isInstrument ? "label-instrument" : "text-step-0",
            )}
          >
            Back to start
          </Link>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      {/* Populated on mount by the effect above. Empty without JavaScript,
          which the server treats as "no timing signal" rather than as suspect. */}
      <input ref={renderedAtInputRef} type="hidden" name="renderedAt" defaultValue="" />

      <div>
        <h2
          id={`${formId}-title`}
          className={cn(
            isInstrument
              ? "font-display text-step-3 uppercase"
              : "font-display text-step-3",
          )}
        >
          {title}
        </h2>
        <p className="measure mt-3 text-step-0 leading-[1.6] text-ink-muted">
          {intro}
        </p>
      </div>

      {/* Error summary. Focusable, announced, and every entry is a real link to
          the field that needs attention. */}
      {state.status === "error" ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border border-accent bg-surface-raised p-5"
        >
          <h3
            className={cn(
              "text-accent",
              isInstrument ? "label-instrument" : "text-step-0 font-medium",
            )}
          >
            {errorCount > 0
              ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention`
              : "This could not be sent"}
          </h3>

          {state.message ? (
            <p className="mt-2 text-step-0 text-ink">{state.message}</p>
          ) : null}

          {errorCount > 0 ? (
            <ul className="mt-3 flex flex-col gap-1.5">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    className="text-step--1 text-ink-muted underline decoration-accent decoration-1 underline-offset-4 transition-colors duration-(--duration-micro) hover:text-ink"
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {children(errors, values)}

      <div className="flex flex-col gap-4 border-t border-rule pt-6">
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-3 px-6",
            "bg-accent text-accent-contrast",
            "transition-[background-color,transform] duration-(--duration-micro)",
            "hover:bg-accent-strong active:scale-[0.99]",
            "disabled:cursor-progress disabled:opacity-70",
            "motion-reduce:active:scale-100",
            isInstrument ? "label-instrument" : "text-step-0 font-medium",
          )}
        >
          {pending ? "Sending…" : submitLabel}
        </button>

        {/* Pending state announced for anyone not watching the button. */}
        <p aria-live="polite" className="sr-only">
          {pending ? "Sending your enquiry." : ""}
        </p>

        <p className="text-step--1 leading-[1.5] text-ink-faint">
          No account needed. No marketing email. See{" "}
          <Link
            href="/privacy"
            className="underline decoration-1 underline-offset-2 hover:text-ink-muted"
          >
            privacy
          </Link>{" "}
          for what happens to this.
        </p>
      </div>
    </form>
  );
}

export { type EnquiryFormState };
