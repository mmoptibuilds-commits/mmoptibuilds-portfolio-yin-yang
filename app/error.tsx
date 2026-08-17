"use client";

import Link from "next/link";

/**
 * Global error boundary.
 *
 * A client component by necessity — it receives the error and a reset
 * function. Deliberately styled with inline-safe token classes only, because
 * whatever failed might be the thing that renders a division shell.
 *
 * The error message itself is not shown to the visitor: it can contain
 * internal detail. It is logged, and the visitor gets a digest they can quote.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="division-systems flex min-h-dvh flex-col items-start justify-center gap-6 bg-surface px-(--spacing-gutter) py-16 text-ink">
      <p className="label-instrument text-accent">Something broke</p>

      <h1 className="max-w-[26ch] font-display text-step-5 leading-[1.0] tracking-[-0.025em] uppercase">
        This page failed to render.
      </h1>

      <p className="measure text-step-1 leading-[1.55] text-ink-muted">
        That is a fault at this end, not yours. Trying again often works, since
        most failures of this kind are transient.
      </p>

      {error.digest ? (
        <p className="label-instrument text-ink-faint">
          Reference <span data-numeric>{error.digest}</span>
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={reset}
          className="label-instrument inline-flex min-h-12 items-center bg-accent px-6 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong"
        >
          Try again
        </button>
        <Link
          href="/"
          className="label-instrument inline-flex min-h-12 items-center border border-border-control px-6 text-ink transition-colors duration-(--duration-micro) hover:border-ink"
        >
          Back to start
        </Link>
      </div>
    </div>
  );
}
