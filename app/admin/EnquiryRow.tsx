"use client";

import { useActionState, useState } from "react";
import { triageEnquiry, type TriageState } from "./actions";
import { INTENT_LABELS, BUDGET_LABELS, TIMING_LABELS } from "@/lib/enquiry-fields";
import { cn } from "@/lib/cn";
import type { StoredRow } from "@/lib/enquiry-store";

const STATUSES = ["new", "reviewing", "quoted", "won", "lost", "spam", "duplicate", "archived"];
const PRIORITIES = ["low", "normal", "high"];

const STATUS_TONE: Record<string, string> = {
  new: "text-accent",
  reviewing: "text-ink",
  quoted: "text-ink",
  won: "text-signal",
  lost: "text-ink-faint",
  spam: "text-ink-faint",
  duplicate: "text-ink-faint",
  archived: "text-ink-faint",
};

/** Turn a stored field key into a readable label without a lookup table. */
function humanise(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function readableValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "budgetRange" && typeof value === "string" && value in BUDGET_LABELS) {
    return BUDGET_LABELS[value as keyof typeof BUDGET_LABELS];
  }
  if (key === "timing" && typeof value === "string" && value in TIMING_LABELS) {
    return TIMING_LABELS[value as keyof typeof TIMING_LABELS];
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

/**
 * One enquiry, expandable.
 *
 * Collapsed by default so the inbox is scannable; the full submission and the
 * triage controls appear on demand. Uses a native <details> element, so it
 * works before hydration and is keyboard operable without any code from me.
 */
export function EnquiryRow({ row }: { row: StoredRow }) {
  const [state, action, pending] = useActionState<TriageState, FormData>(triageEnquiry, {});
  const [dirty, setDirty] = useState(false);

  const created = new Date(row.created_at);

  return (
    <details className="group border-b border-rule">
      <summary
        className={cn(
          "grid cursor-pointer list-none items-baseline gap-x-6 gap-y-2 px-(--spacing-gutter) py-4",
          "hover:bg-surface-raised md:grid-cols-[7rem_9rem_1fr_10rem_6rem]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
        )}
      >
        <span className="label-instrument text-ink-faint" data-numeric>
          {row.reference.replace("MOB-", "")}
        </span>

        <span className="label-instrument text-ink-muted">
          {INTENT_LABELS[row.intent] ?? row.intent}
        </span>

        <span className="text-step-0 text-ink">
          {row.contact_name}
          <span className="ml-2 text-ink-faint">{row.contact_email}</span>
        </span>

        <span className="label-instrument text-ink-faint" data-numeric>
          <time dateTime={row.created_at}>
            {created.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
          </time>
        </span>

        <span className={cn("label-instrument", STATUS_TONE[row.status] ?? "text-ink")}>
          {row.status}
          {row.priority === "high" ? (
            <span className="ml-1.5 text-accent" title="High priority">
              !
            </span>
          ) : null}
        </span>
      </summary>

      <div className="grid gap-x-12 gap-y-10 bg-surface-raised px-(--spacing-gutter) py-8 lg:grid-cols-[1.4fr_1fr]">
        {/* ── Submitted content. Read-only: it is immutable in the database. ── */}
        <div>
          <h3 className="label-instrument text-ink-faint">What they submitted</h3>

          <dl className="mt-5 flex flex-col">
            {Object.entries(row.payload).map(([key, value]) => (
              <div
                key={key}
                className="grid gap-x-6 gap-y-1 border-t border-rule py-3 sm:grid-cols-[minmax(0,14rem)_1fr]"
              >
                <dt className="label-instrument text-ink-faint">{humanise(key)}</dt>
                <dd className="text-step-0 leading-[1.55] whitespace-pre-wrap text-ink">
                  {readableValue(key, value)}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="label-instrument mt-8 text-ink-faint">Provenance</h3>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-4">
            {[
              ["Received", created.toLocaleString("en-IN")],
              ["From page", row.source_path ?? "—"],
              ["Phone", row.contact_phone ?? "—"],
              ["Consent version", row.consent_version],
              ["Browser check", row.turnstile_ok ? "Passed" : "Not verified"],
              [
                "Completion time",
                row.completion_ms ? `${Math.round(row.completion_ms / 1000)}s` : "—",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="label-instrument text-ink-faint">{label}</dt>
                <dd className="mt-0.5 text-step--1 text-ink" data-numeric>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Triage. The only writable columns. ── */}
        <form
          action={action}
          onChange={() => setDirty(true)}
          className="flex flex-col gap-5 lg:border-l lg:border-rule lg:pl-10"
        >
          <input type="hidden" name="id" value={row.id} />

          <h3 className="label-instrument text-ink-faint">Triage</h3>

          <div className="flex flex-col gap-2">
            <label htmlFor={`status-${row.id}`} className="label-instrument text-ink-muted">
              Status
            </label>
            <select
              id={`status-${row.id}`}
              name="status"
              defaultValue={row.status}
              className="min-h-11 border border-border-control bg-surface px-3 text-step-0 text-ink"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`priority-${row.id}`} className="label-instrument text-ink-muted">
              Priority
            </label>
            <select
              id={`priority-${row.id}`}
              name="priority"
              defaultValue={row.priority}
              className="min-h-11 border border-border-control bg-surface px-3 text-step-0 text-ink"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`quote-${row.id}`} className="label-instrument text-ink-muted">
                Quote (INR)
              </label>
              <input
                id={`quote-${row.id}`}
                name="quote_amount"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                defaultValue={row.quote_amount ?? ""}
                className="min-h-11 border border-border-control bg-surface px-3 text-step-0 text-ink"
                data-numeric
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`follow-${row.id}`} className="label-instrument text-ink-muted">
                Follow up
              </label>
              <input
                id={`follow-${row.id}`}
                name="follow_up_on"
                type="date"
                defaultValue={row.follow_up_on ?? ""}
                className="min-h-11 border border-border-control bg-surface px-3 text-step-0 text-ink"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`notes-${row.id}`} className="label-instrument text-ink-muted">
              Private notes
            </label>
            <textarea
              id={`notes-${row.id}`}
              name="owner_notes"
              rows={5}
              defaultValue={row.owner_notes ?? ""}
              className="min-h-28 resize-y border border-border-control bg-surface px-3 py-2 text-step-0 leading-[1.55] text-ink"
            />
            <p className="text-step--1 text-ink-faint">
              Never shown to the visitor. Not sent to analytics.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="label-instrument inline-flex min-h-11 items-center bg-accent px-5 text-accent-contrast transition-colors duration-(--duration-micro) hover:bg-accent-strong disabled:cursor-progress disabled:opacity-70"
            >
              {pending ? "Saving…" : "Save"}
            </button>

            <p aria-live="polite" className="label-instrument">
              {state.error ? (
                <span className="text-accent">{state.error}</span>
              ) : state.ok ? (
                <span className="text-signal">Saved</span>
              ) : dirty ? (
                <span className="text-ink-faint">Unsaved changes</span>
              ) : null}
            </p>
          </div>
        </form>
      </div>
    </details>
  );
}
