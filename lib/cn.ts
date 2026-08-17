import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Class merger, taught about this project's custom token names.
 *
 * This is not cosmetic configuration — without it, tailwind-merge silently
 * deletes classes. It resolves `text-*` conflicts by guessing whether a value
 * is a colour or a font size, and it cannot guess for theme names it has never
 * seen. So `cn("text-accent-contrast", "text-step-0")` looked like two font
 * sizes and the colour was dropped, which shipped a near-black label on a rust
 * button at 3.17:1 contrast. The class was in the source and absent from the
 * DOM.
 *
 * Declaring both groups explicitly stops the two axes colliding. A new step or
 * colour added to the theme must be added here as well; that coupling is
 * deliberate, because the alternative is a class that vanishes without a trace.
 */

const TYPE_STEPS = [
  "step--1",
  "step-0",
  "step-1",
  "step-2",
  "step-3",
  "step-4",
  "step-5",
  "step-6",
  "step-7",
];

const THEME_COLOURS = [
  "ink",
  "ink-muted",
  "ink-faint",
  "accent",
  "accent-strong",
  "accent-contrast",
  "signal",
  "surface",
  "surface-raised",
  "surface-sunken",
  "rule",
  "rule-strong",
  "border-control",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPE_STEPS }],
      "text-color": [{ text: THEME_COLOURS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
