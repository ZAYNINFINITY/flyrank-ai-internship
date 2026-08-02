import type { ReactNode } from "react";

export type ToolViewPart = {
  toolCallId: string;
  state: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function readableInput(input: unknown): string[] {
  if (!input || typeof input !== "object") return [];
  return Object.entries(input)
    .filter(([, value]) => typeof value === "string" && value.length > 0)
    .map(([key, value]) => `${key}: ${value}`);
}

/**
 * Renders the four AI tool lifecycle states as distinct UI.
 * Tool output is delegated to a caller-provided renderer so this component
 * stays generic across future tools.
 */
export function ToolStateViews({
  part,
  renderOutput,
}: {
  part: ToolViewPart;
  renderOutput?: (output: unknown) => ReactNode;
}) {
  switch (part.state) {
    case "input-streaming":
      return (
        <div
          className="flex items-center gap-3 border border-[var(--color-text)]/10 px-5 py-4"
          aria-live="polite"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-text)]/40" />
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">
            Asking the museum…
          </p>
        </div>
      );

    case "input-available": {
      const chips = readableInput(part.input);
      return (
        <div className="border border-[var(--color-text)]/10 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-2">
            Searching the collection
          </p>
          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="border border-[var(--color-text)]/15 px-2 py-1 text-[11px] opacity-60"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm opacity-50">Full collection</p>
          )}
        </div>
      );
    }

    case "output-available":
      return renderOutput ? (
        renderOutput(part.output)
      ) : (
        <div className="border border-[var(--color-text)]/10 px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-1">
            Result
          </p>
          <p className="text-sm opacity-60">
            The curator found what you asked for.
          </p>
        </div>
      );

    case "output-error":
      return (
        <div
          className="border border-red-900/40 bg-red-950/10 px-5 py-4"
          role="alert"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-300/70 mb-1">
            Museum search failed
          </p>
          <p className="text-sm opacity-70">
            The search hit a snag. Try asking in different words.
          </p>
          {part.errorText && (
            <p className="mt-2 text-[11px] opacity-40">{part.errorText}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}
