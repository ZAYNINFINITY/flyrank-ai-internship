export type MotionState = "idle" | "loading" | "success" | "error";

/**
 * Plinth's motion language.
 *
 * Every animated surface in Plinth (buttons today, doors/exhibits/room
 * transitions later) reads from these tokens so the whole museum shares one
 * timing and easing vocabulary. The values here mirror the CSS custom
 * properties defined in app/globals.css (--motion-*). Keeping both in sync is
 * intentional: the CSS vars drive the actual animation via Tailwind arbitrary
 * values, and the TS constants exist for code that needs the values at runtime
 * (tests, demo-page copy, duration math).
 */
export const motionTokens = {
  duration: {
    /** Feedback that should feel immediate — hover tints, focus. */
    fast: "120ms",
    /** The default for state crossfades — label/icon swaps. */
    base: "320ms",
    /** Bigger reveals that should breathe — success pop, entrances. */
    slow: "600ms",
  },
  easing: {
    /** Neutral in/out — most UI transitions. */
    standard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    /** Eases in, settles out — things entering. */
    enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    /** Fast out, long tail — things leaving. */
    exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
    /** Springy snap used for the error shake. */
    shake: "cubic-bezier(0.36, 0.07, 0.19, 0.97)",
  },
  animation: {
    spin: "plinth-spin 600ms linear infinite",
    shake: "plinth-shake 500ms var(--motion-ease-shake)",
    pop: "plinth-pop 320ms var(--motion-ease-enter)",
  },
} as const;

/** How long success/error feedback stays visible before resetting to idle. */
export const MOTION_FEEDBACK_DURATION_MS = 1600;

/**
 * True when the user has requested reduced motion.
 * Only used for JS-driven timing decisions; the CSS side is handled by the
 * prefers-reduced-motion block in globals.css, which collapses animation and
 * transition durations to ~0 while keeping every state change (feedback).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
