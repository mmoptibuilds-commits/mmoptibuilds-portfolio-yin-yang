import { cn } from "@/lib/cn";

/**
 * The Studio signature motif: an editorial margin note.
 *
 * On wide viewports it hangs in the outer margin beside the main column,
 * numbered like a printed annotation. On narrow viewports it becomes an
 * indented aside beneath the text it annotates, because a margin that
 * narrow is not a margin.
 *
 * Rendered as <aside> so assistive technology can skip it, and the number is
 * hidden from the accessibility tree since it is a visual reference only.
 */
export function MarginNote({
  n,
  children,
  className,
}: {
  n?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "note-margin relative mt-4 border-l border-rule-strong pl-4",
        "lg:mt-0 lg:border-l-0 lg:pl-0",
        className,
      )}
    >
      {typeof n === "number" ? (
        <span
          aria-hidden="true"
          className="mr-1.5 align-super text-[0.7em] text-accent"
          data-numeric
        >
          {n}
        </span>
      ) : null}
      {children}
    </aside>
  );
}
