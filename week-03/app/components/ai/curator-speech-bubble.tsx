"use client";

import { useEffect, useRef, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export type MuseumCharacter = "curator" | "receptionist" | "cat";

interface CuratorSpeechBubbleProps {
  title: string;
  body: string;
  onClose: () => void;
  character?: MuseumCharacter;
  avatarInitial?: string;
  subtitle?: string;
}

const CHARACTER_DEFAULTS: Record<
  MuseumCharacter,
  { avatarInitial: string; subtitle: string }
> = {
  curator: {
    avatarInitial: "C",
    subtitle: "Curator · Foyer Museum",
  },
  receptionist: {
    avatarInitial: "R",
    subtitle: "Receptionist · Foyer Museum",
  },
  cat: {
    avatarInitial: "\uD83D\uDC08",
    subtitle: "Museum Cat",
  },
};

function getTextFromParts(parts: unknown[]): string {
  if (!Array.isArray(parts)) return "";
  return (parts as Array<Record<string, unknown>>)
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("");
}

const OPTIONS_REGEX = /\[OPTIONS:\s*(.+?)\]\s*$/;

function parseOptions(text: string): { cleanText: string; options: string[] } {
  const match = text.match(OPTIONS_REGEX);
  if (!match) return { cleanText: text, options: [] };
  const cleanText = text.slice(0, match.index).trim();
  const options = match[1].split("|").map((o) => o.trim()).filter(Boolean);
  return { cleanText, options };
}

function parseInitialOptions(body: string): { cleanBody: string; options: string[] } {
  const match = body.match(OPTIONS_REGEX);
  if (!match) return { cleanBody: body, options: [] };
  const cleanBody = body.slice(0, match.index).trim();
  const options = match[1].split("|").map((o) => o.trim()).filter(Boolean);
  return { cleanBody, options };
}

export function CuratorSpeechBubble({
  title,
  body,
  onClose,
  character = "curator",
  avatarInitial,
  subtitle,
}: CuratorSpeechBubbleProps) {
  const defaults = CHARACTER_DEFAULTS[character];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ character }),
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse initial greeting options
  const { cleanBody, options: initialOptions } = useMemo(
    () => parseInitialOptions(body),
    [body]
  );

  // Get the latest AI message and its options
  const lastAssistantMsg = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        return messages[i];
      }
    }
    return null;
  }, [messages]);

  const lastAssistantText = lastAssistantMsg
    ? getTextFromParts(lastAssistantMsg.parts)
    : "";
  const { options: lastOptions } = useMemo(
    () => parseOptions(lastAssistantText),
    [lastAssistantText]
  );

  const handleOptionClick = (option: string) => {
    if (isLoading) return;
    sendMessage({ text: option });
  };

  const showInitialGreeting = messages.length === 0;
  const currentOptions = showInitialGreeting ? initialOptions : lastOptions;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Talk to the ${character}`}
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[70] flex justify-center px-3 pb-3 sm:bottom-4 sm:px-4 sm:pb-4"
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-lg border border-[#2a2a30]/20 bg-[#efe9da]/97 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a30]/10 px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a30] text-[11px] font-medium text-[#efe9da]">
              {avatarInitial ?? defaults.avatarInitial}
            </div>
            <div>
              <p className="font-heading text-sm font-medium text-[#2a2a30]">
                {title}
              </p>
              <p className="text-[10px] text-[#6f6c62]">
                {subtitle ?? defaults.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-sm text-[11px] uppercase tracking-[0.2em] text-[#6f6c62] transition-colors hover:text-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a94c]"
          >
            Close
          </button>
        </div>

        {/* Messages area */}
        <div className="max-h-[320px] overflow-y-auto px-3 py-3 sm:px-4">
          {/* Initial greeting */}
          {showInitialGreeting && (
            <div className="mb-3 flex justify-start">
              <div className="max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed bg-[#e9e4d6] text-[#2a2a30]">
                {cleanBody}
              </div>
            </div>
          )}

          {/* Conversation history */}
          {messages.map((msg) => {
            const text = getTextFromParts(msg.parts);
            const isUser = msg.role === "user";
            if (!text && !isUser) return null;

            // For assistant messages, strip the OPTIONS tag from display
            const displayText = isUser ? text : (() => {
              const { cleanText } = parseOptions(text);
              return cleanText;
            })();

            return (
              <div
                key={msg.id}
                className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#2a2a30] text-[#efe9da]"
                      : "bg-[#e9e4d6] text-[#2a2a30]"
                  }`}
                >
                  {displayText || (
                    <span className="inline-block animate-pulse text-[#6f6c62]">
                      thinking...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-4 pb-2 text-[11px] text-red-600">
            Connection interrupted. Try again.
          </div>
        )}

        {/* Options */}
        {currentOptions.length > 0 && !isLoading && (
          <div className="flex flex-wrap gap-1.5 border-t border-[#2a2a30]/10 px-3 py-2.5 sm:px-4">
            {currentOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
                className="min-h-[36px] rounded-sm border border-[#2a2a30]/15 bg-white/60 px-2.5 py-1.5 text-[11px] leading-tight text-[#2a2a30] transition-all hover:border-[#d4a94c]/40 hover:bg-[#d4a94c]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a94c] sm:text-xs"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="border-t border-[#2a2a30]/10 px-4 py-2.5">
            <span className="inline-block animate-pulse text-xs text-[#6f6c62]">
              thinking...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
