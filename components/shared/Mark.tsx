import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * The brand mark.
 *
 * Drawn rather than typeset so it stays identical across two very different
 * type systems. Three stacked bars of decreasing width: a requirement being
 * resolved into a specification. `currentColor` lets each division tint it.
 */
export function Mark({
  className,
  title = `${site.legalDisplayName} home`,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2.5 transition-opacity duration-(--duration-micro)",
        "hover:opacity-80",
        className,
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0 overflow-visible"
      >
        <rect x="1" y="3" width="20" height="2.5" fill="currentColor" />
        <rect
          x="1"
          y="9.75"
          width="13"
          height="2.5"
          fill="currentColor"
          className="origin-left transition-transform duration-(--duration-ui) ease-(--ease-mech) group-hover:scale-x-[1.35] motion-reduce:transition-none motion-reduce:group-hover:scale-x-100"
        />
        <rect x="1" y="16.5" width="7" height="2.5" fill="currentColor" />
      </svg>
      <span className="font-display text-step-0 font-medium tracking-[-0.01em] lowercase">
        {site.brand}
      </span>
      <span className="sr-only">{title}</span>
    </Link>
  );
}
