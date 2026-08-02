"use client";

export type ErrorKind = "offline" | "server" | "bad-request";

const KIND_CONTENT: Record<
  ErrorKind,
  { title: string; body: string; detail: string | null }
> = {
  offline: {
    title: "You appear to be offline",
    body: "Check your connection, then retry the last message.",
    detail: null,
  },
  server: {
    title: "The assistant couldn't respond",
    body: "The AI service hit a snag on its side. Try again in a moment.",
    detail: null,
  },
  "bad-request": {
    title: "The request couldn't be processed",
    body: "Something was wrong with the message. Try rephrasing it.",
    detail: null,
  },
};

/**
 * Classify a useChat error into a user-facing category.
 * Server errors we control come back as JSON bodies (the transport surfaces
 * response.text()), so we extract the friendly message from there instead of
 * ever leaking raw internals to the visitor.
 */
export function classifyError(error: Error | undefined): ErrorKind | null {
  if (!error) return null;
  const message = (error.message || "").toLowerCase();

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "offline";
  }
  if (
    message.includes("failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("networkerror") ||
    message.includes("network error")
  ) {
    return "offline";
  }
  if (message.includes("no messages provided")) {
    return "bad-request";
  }
  return "server";
}

/**
 * Pull the server's friendly message out of a JSON error body, if present.
 * Non-JSON raw errors (e.g. browser fetch errors) are deliberately not shown.
 */
export function serverErrorDetail(error: Error | undefined): string | null {
  if (!error) return null;
  try {
    const parsed = JSON.parse(error.message) as { error?: unknown };
    return typeof parsed.error === "string" ? parsed.error : null;
  } catch {
    return null;
  }
}

export function ChatErrorBanner({
  error,
  onRetry,
  onDismiss,
}: {
  error: Error | undefined;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const kind = classifyError(error);
  if (!kind) return null;

  const content = KIND_CONTENT[kind];
  const detail = serverErrorDetail(error);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="border border-red-900/40 bg-red-950/10 px-5 py-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-300/70 mb-1">
            Connection to the assistant failed
          </p>
          <p className="font-body text-[13px] font-medium text-text/90">
            {content.title}
          </p>
          <p className="font-body text-[12px] leading-relaxed opacity-60">
            {content.body}
          </p>
          {detail && (
            <p className="font-body text-[11px] opacity-40">{detail}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="border border-red-900/40 px-2.5 py-1 font-body text-[11px] opacity-80 transition-colors hover:bg-red-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="border border-red-900/20 px-2.5 py-1 font-body text-[11px] opacity-50 transition-colors hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
