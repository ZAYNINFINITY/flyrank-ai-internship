"use client";

import { useEffect } from "react";

export default function AssistantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[assistant] route segment error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-text/30">
          Route error
        </p>
        <h1 className="mt-3 font-heading text-2xl tracking-tight text-text">
          The room couldn&apos;t be entered.
        </h1>
        <p className="mt-2 font-body text-sm text-text/40">
          Something went wrong loading the assistant. Try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-accent px-5 py-2.5 font-body text-[13px] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
