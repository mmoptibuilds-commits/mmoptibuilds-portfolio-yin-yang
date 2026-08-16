/**
 * The site's motion vocabulary, in one place.
 *
 * Three tiers, per spec 15 and the build directive:
 *   micro     80–250ms   state settles: hover, press, focus, toggle
 *   interface 250–700ms  objects move: menus, reveals, media transitions
 *   cinematic 700ms+     rare, timeline driven: the gateway sequence only
 *
 * Durations mirror the CSS custom properties in globals.css so a component
 * animating in JS and a sibling animating in CSS stay in sync.
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

/**
 * Standard reveal. Content is already in the DOM and already readable; this
 * only resolves its arrival. Reduced motion is handled in CSS so that a
 * hydration failure can never leave content hidden.
 */
export const reveal = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.uiLg, ease: ease.outExpo },
} as const;

/** Staggered children. Keep stagger tight; long cascades read as slow. */
export function stagger(index: number, step = 0.055) {
  return { ...reveal.transition, delay: index * step };
}

export const viewportOnce = { once: true, amount: 0.35 } as const;
