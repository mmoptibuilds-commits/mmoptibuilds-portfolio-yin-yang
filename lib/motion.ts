/**
 * The site's motion vocabulary, in one place.
 *
 * Three tiers, per spec 15 and the build directive:
 *   micro     80–250ms   state settles: hover, press, focus, toggle
 *   interface 250–700ms  objects move: menus, drawers, media transitions
 *   cinematic 700ms+     rare, timeline driven
 *
 * Durations mirror the CSS custom properties in globals.css so a component
 * animating in JS and a sibling animating in CSS stay in sync.
 *
 * Section reveals are deliberately NOT here. They are CSS-only, driven by a
 * scroll-driven timeline on `[data-reveal]`, and animate transform without
 * opacity so that content is never hidden by an animation that fails to run.
 * See components/shared/Reveal.tsx.
 */

export const duration = {
  micro: 0.14,
  microLg: 0.22,
  ui: 0.38,
  uiLg: 0.62,
  cine: 1.1,
} as const;

/** Matches the cubic-beziers declared in globals.css. */
export const ease = {
  /** Systems: mechanical, decisive arrival. */
  mech: [0.2, 0, 0, 1],
  /** Studio: editorial, unhurried settle. */
  editorial: [0.33, 1, 0.68, 1],
  /** Entrances from offscreen. */
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;
