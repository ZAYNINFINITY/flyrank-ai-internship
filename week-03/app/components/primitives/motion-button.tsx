"use client";

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import {
  MOTION_FEEDBACK_DURATION_MS,
  type MotionState,
} from "@/lib/motion/tokens";

type MotionButtonVariant = "solid" | "outline" | "ghost";

/**
 * Plinth's interaction primitive.
 *
 * A button that communicates its full lifecycle — idle, hover/focus, loading,
 * success, error — with choreographed, compositor-friendly transitions
 * (transform + opacity only; no layout thrash). Not tied to the current
 * website's look: the variant system plus the shared motion tokens are meant
 * to survive the future museum presentation pass unchanged.
 *
 * Two usage modes:
 *  - Uncontrolled: pass `onAsyncClick` and the button drives its own
 *    idle → loading → success/error → idle cycle.
 *  - Controlled: pass `state` and own the lifecycle (e.g. the Curator Send
 *    button binds to the chat stream status).
 */
export function MotionButton({
  variant = "solid",
  state,
  onAsyncClick,
  feedbackDuration = MOTION_FEEDBACK_DURATION_MS,
  label,
  loadingLabel = "Working…",
  successLabel = "Done",
  errorLabel = "Retry",
  icon,
  loadingIcon,
  successIcon,
  errorIcon,
  className,
  onClick,
  ...props
}: {
  variant?: MotionButtonVariant;
  state?: MotionState;
  onAsyncClick?: () => Promise<void>;
  feedbackDuration?: number;
  label: ReactNode;
  loadingLabel?: ReactNode;
  successLabel?: ReactNode;
  errorLabel?: ReactNode;
  icon?: ReactNode;
  loadingIcon?: ReactNode;
  successIcon?: ReactNode;
  errorIcon?: ReactNode;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">) {
  const [internalState, setInternalState] = useState<MotionState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlled = state !== undefined;
  const activeState = isControlled ? state : internalState;

  const isDisabled = props.disabled || activeState === "loading";
  const isBusy = activeState === "loading";

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const runAsyncCycle = async () => {
    setInternalState("loading");
    try {
      await onAsyncClick?.();
      setInternalState("success");
    } catch {
      setInternalState("error");
    } finally {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        setInternalState("idle");
        resetTimer.current = null;
      }, feedbackDuration);
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    if (!isControlled && onAsyncClick) {
      void runAsyncCycle();
    }
    onClick?.();
  };

  const activeLabel =
    activeState === "loading"
      ? loadingLabel
      : activeState === "success"
        ? successLabel
        : activeState === "error"
          ? errorLabel
          : label;

  const activeIcon =
    activeState === "loading"
      ? loadingIcon ?? <SpinnerIcon />
      : activeState === "success"
        ? successIcon ?? <CheckIcon />
        : activeState === "error"
          ? errorIcon ?? <AlertIcon />
          : icon;

  return (
    <button
      type="button"
      data-state={activeState}
      aria-busy={isBusy || undefined}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        "group/motion relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center overflow-hidden",
        "rounded-[3px] px-8 py-3",
        "font-body text-sm font-medium",
        "transition-opacity duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "solid" && "bg-accent text-white",
        variant === "outline" && "border border-text/25 text-text",
        variant === "ghost" && "border border-text/10 text-text/70",
        activeState === "error" &&
          "animate-[plinth-shake_500ms_var(--motion-ease-shake)]",
        className,
      )}
      {...props}
    >
      {/* Hover / focus feedback — a tint layer animated via opacity only. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "opacity-0 transition-opacity duration-200",
          "group-hover/motion:opacity-100 group-focus-visible/motion:opacity-100",
          variant === "solid" && "bg-white/10",
          variant === "outline" && "bg-text/5",
          variant === "ghost" && "bg-text/5",
          activeState === "success" && "bg-emerald-500/15 opacity-100",
          activeState === "error" && "bg-red-500/15 opacity-100",
        )}
      />

      <span className="relative z-10 inline-flex items-center gap-2">
        {/* Label crossfades by opacity + scale — same slot, no layout shift. */}
        <span
          aria-hidden={activeState !== "idle"}
          className={cn(
            "inline-flex items-center gap-2 transition-[opacity,transform] duration-[320ms] ease-[var(--motion-ease-standard)]",
            activeState === "idle"
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0",
          )}
        >
          {icon}
          {label}
        </span>
        <span
          aria-hidden={activeState === "idle"}
          className={cn(
            "inline-flex items-center gap-2 transition-[opacity,transform] duration-[320ms] ease-[var(--motion-ease-standard)]",
            activeState === "idle"
              ? "pointer-events-none absolute translate-y-1 opacity-0"
              : "absolute translate-y-0 opacity-100",
          )}
        >
          <span
            className={cn(
              "inline-flex items-center gap-2",
              activeState === "success" &&
                "animate-[plinth-pop_320ms_var(--motion-ease-enter)]",
              activeState === "loading" &&
                "animate-[plinth-spin_600ms_linear_infinite]",
            )}
          >
            {activeIcon}
            {activeLabel}
          </span>
        </span>
      </span>
    </button>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 5v4" />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
      <circle
        cx="8"
        cy="8"
        r="6.5"
        strokeOpacity="0.4"
      />
    </svg>
  );
}
