"use client";

import { useEffect, useRef, useState } from "react";
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
  placeholder?: string;
}

const CHARACTER_DEFAULTS: Record<
  MuseumCharacter,
  { avatarInitial: string; subtitle: string; placeholder: string }
> = {
  curator: {
    avatarInitial: "C",
    subtitle: "Curator · Foyer Museum",
    placeholder: "Ask about any exhibit...",
  },
  receptionist: {
    avatarInitial: "R",
    subtitle: "Receptionist · Foyer Museum",
    placeholder: "Ask for directions...",
  },
  cat: {
    avatarInitial: "\uD83D\uDC08",
    subtitle: "Museum Cat",
    placeholder: "Say hi...",
  },
};

function getTextFromParts(parts: unknown[]): string {
  if (!Array.isArray(parts)) return "";
  return (parts as Array<Record<string, unknown>>)
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("");
}

export function CuratorSpeechBubble({
  title,
  body,
  onClose,
  character = "curator",
  avatarInitial,
  subtitle,
  placeholder,
}: CuratorSpeechBubbleProps) {
  const defaults = CHARACTER_DEFAULTS[character];
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const greetingShown = messages.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Talk to the ${character}`}
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[70] flex justify-center px-4 pb-4 sm:bottom-6"
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-lg border border-[#2a2a30]/20 bg-[#efe9da]/97 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a30]/10 px-4 py-3">
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

        {/* Messages */}
        <div className="max-h-[280px] overflow-y-auto px-4 py-3 space-y-3">
          {/* Initial greeting from the character */}
          {greetingShown && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed bg-[#e9e4d6] text-[#2a2a30]">
                {body}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const text = getTextFromParts(msg.parts);
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#2a2a30] text-[#efe9da]"
                      : "bg-[#e9e4d6] text-[#2a2a30]"
                  }`}
                  data-role={isUser ? "visitor" : "speaker"}
                >
                  {text || (
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

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-[#2a2a30]/10 px-4 py-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isLoading
                ? "Responding..."
                : placeholder ?? defaults.placeholder
            }
            disabled={isLoading}
            className="flex-1 rounded-sm border border-[#2a2a30]/15 bg-white/60 px-3 py-2 text-sm text-[#2a2a30] placeholder-[#6f6c62]/50 outline-none transition-colors focus:border-[#d4a94c]/50 focus:ring-1 focus:ring-[#d4a94c]/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="min-h-[40px] rounded-sm bg-[#2a2a30] px-4 text-xs font-medium uppercase tracking-[0.15em] text-[#efe9da] transition-colors hover:bg-[#3a3a40] disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
