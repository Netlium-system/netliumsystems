/**
 * Numeric mirrors of the CSS motion tokens in styles/tokens.css (--motion-*).
 * Framer Motion configs run in JS and can't read CSS custom properties, so these
 * values must stay in sync with tokens.css by hand.
 */
export const MOTION_DURATION = {
  fast: 0.12,
  normal: 0.18,
  slow: 0.25
} as const;

export const MOTION_EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1]
} as const;
