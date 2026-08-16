import { cn } from "@/lib/cn";

/**
 * The Systems signature motif: a measurement datum with tick marks.
 *
 * Used as a section divider and as the underline beneath headings, so the
 * whole division reads as a calibrated instrument rather than a set of
 * cards. Pure CSS — the ticks are a repeating gradient, so this costs no
 * JavaScript and no extra DOM per tick.
 *
 * Decorative by definition: it is hidden from assistive technology and
 * deliberately below 3:1 contrast, because it never carries meaning on its
 * own. Anything meaningful gets a real label.
 */
export function DatumRule({
  label,
  value,
  className,
}: {
  label?: string;
  value?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-4", className)}>
      {label ? (
        <span className="label-instrument shrink-0 text-ink-muted">{label}</span>
      ) : null}

      <span
        aria-hidden="true"
        className={cn(
          "relative top-[-0.28em] h-2 min-w-8 flex-1",
          // Baseline rule.
          "border-t border-rule-strong",
          // Ticks hang below the rule every 8px, with a taller tick every 40px.
          "before:absolute before:inset-x-0 before:top-0 before:h-1",
          "before:bg-[repeating-linear-gradient(to_right,var(--rule)_0_1px,transparent_1px_8px)]",
          "after:absolute after:inset-x-0 after:top-0 after:h-2",
          "after:bg-[repeating-linear-gradient(to_right,var(--rule-strong)_0_1px,transparent_1px_40px)]",
        )}
      />

      {value ? (
        <span className="label-instrument shrink-0 text-ink" data-numeric>
          {value}
        </span>
      ) : null}
    </div>
  );
}
