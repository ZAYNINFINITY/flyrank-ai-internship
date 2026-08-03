"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart, isToolUIPart } from "ai";
import { useEffect, useRef, useState } from "react";
import { ToolStateViews, type ToolViewPart } from "./tool-state-views";
import { ExhibitToolResult, isExhibitArray } from "./exhibit-tool-result";
import { ChatErrorBanner } from "./chat-error-banner";

const EXAMPLE_PROMPTS = [
  "Show me infrastructure exhibits",
  "What's in the visual design collection?",
  "List the experiments",
] as const;

function renderExhibitOutput(output: unknown) {
  if (isExhibitArray(output)) {
    return <ExhibitToolResult exhibits={output} />;
  }
  return (
    <div className="border border-[var(--color-text)]/10 px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-30 mb-1">
        Result
      </p>
      <p className="text-sm opacity-60">
        The curator found what you asked for.
      </p>
    </div>
  );
}

/**
 * Single reusable chat surface for Plinth.
 * Used by /assistant today and by the Curator in later milestones.
 */
export function ChatPanel({
  heading = "Assistant",
  subtitle = "AI interaction engine",
}: {
  heading?: string;
  subtitle?: string;
}) {
  const { messages, sendMessage, stop, regenerate, clearError, status, error } =
    useChat({
      transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);
    setShowJumpToLatest(!atBottom);
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const isThinking =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="flex items-center border-b border-text/10 px-6 py-4 sm:px-8">
        <h1 className="font-heading text-[18px] font-medium text-text">
          {heading}
        </h1>
        <span className="ml-3 font-body text-[12px] text-text/30">{subtitle}</span>
      </header>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 sm:px-8"
      >
        <div className="mx-auto max-w-[720px] space-y-6">
          {messages.length === 0 && (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">
                <p className="font-body text-[15px] text-text/30">
                  No conversations yet.
                </p>
                <p className="mt-1 font-body text-[13px] text-text/20">
                  Ask the curator about the museum&apos;s exhibits.
                </p>
                <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => {
                        sendMessage({ text: prompt });
                      }}
                      className="rounded-full border border-text/15 px-4 py-1.5 font-body text-[12px] text-text/40 transition-colors hover:border-text/30 hover:text-text/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            const textParts = message.parts.filter(isTextUIPart);
            const toolParts = message.parts.filter(isToolUIPart);

            if (isUser) {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg bg-accent px-4 py-3 font-body text-[14px] leading-relaxed text-white">
                    {textParts.map((p, i) => (
                      <span key={i}>{p.text}</span>
                    ))}
                  </div>
                </div>
              );
            }

            if (textParts.length === 0 && toolParts.length === 0) {
              return null;
            }

            return (
              <div key={message.id} className="flex justify-start">
                <div className="max-w-[85%] space-y-3">
                  {textParts.length > 0 && (
                    <div className="rounded-lg bg-text/5 px-4 py-3 font-body text-[14px] leading-relaxed text-text">
                      {textParts.map((p, i) => (
                        <span key={i}>{p.text}</span>
                      ))}
                    </div>
                  )}
                  {toolParts.map((part) => {
                    const viewPart: ToolViewPart = {
                      toolCallId: part.toolCallId,
                      state: part.state,
                      input: "input" in part ? part.input : undefined,
                      output: "output" in part ? part.output : undefined,
                      errorText: "errorText" in part ? part.errorText : undefined,
                    };
                    return (
                      <ToolStateViews
                        key={viewPart.toolCallId}
                        part={viewPart}
                        renderOutput={renderExhibitOutput}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-text/5 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text/30" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text/30 [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text/30 [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <ChatErrorBanner
              error={error}
              onRetry={() => void regenerate()}
              onDismiss={clearError}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Jump to latest */}
      {showJumpToLatest && (
        <button
          onClick={() => {
            scrollToBottom();
            setIsAtBottom(true);
            setShowJumpToLatest(false);
          }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full border border-text/10 bg-background px-4 py-1.5 font-body text-[12px] text-text/30 shadow-sm transition-colors hover:text-text/50"
        >
          Jump to latest
        </button>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-text/10 px-6 py-4 sm:px-8"
      >
        <div className="mx-auto flex max-w-[720px] items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-text/10 bg-transparent px-4 py-3 font-body text-[14px] text-text placeholder:text-text/30 focus:outline-2 focus:outline-offset-2 focus:outline-accent"
            disabled={isLoading}
          />
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-text/10 text-text/50 transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Stop generating"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="2" width="10" height="10" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white transition-opacity disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Send message"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 13V8h4M13 3L6 10l4 4 3-11z" />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
