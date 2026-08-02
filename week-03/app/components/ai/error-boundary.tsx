"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Catches render-time crashes inside the chat surface so the rest of the
 * app (and the user's conversation intent) isn't lost to a white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex h-[100dvh] flex-col items-center justify-center gap-3 bg-background px-6"
          >
            <p className="font-heading text-[18px] font-medium text-text">
              This panel hit a snag
            </p>
            <p className="max-w-[380px] text-center font-body text-[13px] text-text/40">
              Something went wrong while rendering the assistant. Reload to
              start fresh.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 rounded-lg bg-accent px-4 py-2 font-body text-[13px] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
