"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
 * Radix Dialog is used rather than hand-rolled state because it gives us the
 * parts that are genuinely difficult and easy to get wrong: focus trapping,
 * focus restoration to the trigger, Escape to close, scroll locking, and
 * aria-modal semantics.
 */
export function MobileNav({ items, siblingLabel, siblingHref, tone }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A route change must close the sheet, or it covers the page it navigated to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isInstrument = tone === "instrument";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          "flex min-h-11 min-w-11 items-center gap-2 px-2",
          "text-ink transition-colors duration-(--duration-micro) hover:text-accent",
          "md:hidden",
          isInstrument ? "label-instrument" : "text-step-0",
        )}
      >
        Menu
        <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" fill="none">
          <path d="M0 1h16M0 9h16" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-90 bg-surface-sunken/80 backdrop-blur-[2px] md:hidden" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 top-0 z-100 md:hidden",
            "border-b border-rule-strong bg-surface",
            "px-(--spacing-gutter) pt-5 pb-8",
          )}
          aria-describedby={undefined}
        >
          <div className="flex items-start justify-between">
            <Dialog.Title
              className={cn(
                "text-ink-muted",
                isInstrument ? "label-instrument" : "note-margin",
              )}
            >
              Navigation
            </Dialog.Title>
            <Dialog.Close
              className={cn(
                "flex min-h-11 min-w-11 items-center justify-end",
                "text-ink transition-colors duration-(--duration-micro) hover:text-accent",
                isInstrument ? "label-instrument" : "text-step-0",
              )}
            >
              Close
            </Dialog.Close>
          </div>

          <ul className="mt-6 flex flex-col">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="border-t border-rule">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block py-4",
                      active ? "text-accent" : "text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "block",
                        isInstrument
                          ? "font-display text-step-2 uppercase tracking-[0.02em]"
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
