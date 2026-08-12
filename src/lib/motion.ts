/**
 * The JS half of the timing source of truth. The CSS half lives in
 * globals.css (@theme --ease-* and :root --duration-*). Any value used by a
 * GSAP or framer-motion animation must come from here, so that a change to the
 * house style is a one-file change.
 */
export const EASE = {
  /** Drawers, panels, slide-ups. Fast out, long settle. */
  expo: [0.22, 1, 0.36, 1],
  /** Buttons, borders, colour swaps. */
  brand: [0.645, 0.045, 0.355, 1],
} as const;

export const DUR = {
  xfade: 0.15,
  ui: 0.25,
  panel: 0.35,
  zoom: 0.5,
  reveal: 0.6,
  hero: 0.9,
} as const;
