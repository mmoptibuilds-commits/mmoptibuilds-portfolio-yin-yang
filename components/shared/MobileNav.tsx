"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/content/navigation";

type MobileNavProps = {
  items: NavItem[];
  siblingLabel: string;
  siblingHref: string;
  /** Systems uses instrument labels; Studio uses editorial sentence case. */
  tone: "instrument" | "editorial";
};

/**
 * Mobile navigation for both divisions.
 *
 * Built on the native <dialog> element rather than a dialog library. That was a
 * measured decision, not a preference: @radix-ui/react-dialog and its
 * dependencies cost roughly 17KB compressed on every division route, and
 * showModal() already provides the behaviour that made a library attractive —
 * focus trapping, Escape to close, inert background content, implicit
 * aria-modal, and focus restoration to the invoking element. Scroll locking is
 * the one gap, handled with a single CSS rule in globals.css.
 *
 * Removing it took first-load JS from 177KB to under the 170KB budget while
 * keeping every accessibility behaviour verified in scripts/keyboard.mjs.
 */
export function MobileNav({ items, siblingLabel, siblingHref, tone }: MobileNavProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  /* Close on navigation, or the sheet covers the page it just opened.
     This is a DOM call rather than a state update — exactly what an effect is
     for, and it avoids the cascading render that setState here would cause. */
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const isInstrument = tone === "instrument";

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        className={cn(
          "flex min-h-11 min-w-11 items-center gap-2 px-2",
          "text-ink transition-colors duration-(--duration-micro) hover:text-accent",
          "lg:hidden",
          isInstrument ? "label-instrument" : "text-step-0",
        )}
      >
        Menu
        <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" fill="none">
          <path d="M0 1h16M0 9h16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Navigation"
        /* Clicking the backdrop closes. The check compares against the dialog
           itself because a modal dialog's ::backdrop reports the dialog as the
           event target, while clicks on the content report a descendant. */
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className={cn(
          "mobile-sheet",
          "border-b border-rule-strong bg-surface",
          "px-(--spacing-gutter) pt-5 pb-8 text-ink",
          "lg:hidden",
        )}
      >
        <div className="flex items-start justify-between">
          <p
            className={cn(
              "text-ink-muted",
              isInstrument ? "label-instrument" : "note-margin",
            )}
          >
            Navigation
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-end",
              "text-ink transition-colors duration-(--duration-micro) hover:text-accent",
              isInstrument ? "label-instrument" : "text-step-0",
            )}
          >
            Close
          </button>
        </div>

        <ul className="mt-6 flex flex-col">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href} className="border-t border-rule">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("block py-4", active ? "text-accent" : "text-ink")}
                >
                  <span
                    className={cn(
                      "block",
                      isInstrument
                        ? "font-display text-step-2 tracking-[0.02em] uppercase"
                        : "font-display text-step-3",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="mt-1 block text-step--1 text-ink-muted">
                    {item.description}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col gap-3 border-t border-rule-strong pt-6">
          <Link
            href="/contact"
            className={cn(
              "flex min-h-12 items-center justify-center bg-accent px-5",
              "text-accent-contrast",
              isInstrument ? "label-instrument" : "text-step-0 font-medium",
            )}
          >
            Start an enquiry
          </Link>
          <Link
            href={siblingHref}
            className={cn(
              "flex min-h-12 items-center justify-center",
              "border border-border-control px-5 text-ink",
              isInstrument ? "label-instrument" : "text-step-0",
            )}
          >
            {siblingLabel}
          </Link>
        </div>
      </dialog>
    </>
  );
}
