import { cn } from "@/lib/cn";

/**
 * First focusable element on every page. Visible only when focused, but
 * genuinely visible then — not a 1px offscreen trick that screen magnifier
 * users cannot see.
 */
export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only z-100 focus-visible:not-sr-only",
        "focus-visible:fixed focus-visible:top-3 focus-visible:left-3",
        "focus-visible:bg-accent focus-visible:text-accent-contrast",
        "focus-visible:px-4 focus-visible:py-3",
        "label-instrument",
      )}
    >
      Skip to content
    </a>
  );
}
