"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Foyer's front door ────────────────────────────────────
   A clean `/` link lands here and hands the visitor a real choice of
   how to step inside — the 3D museum or the flat 2D view — immediately.
   The short opening story is still there, behind a "Read the story"
   button, for anyone who wants the framing before they pick.
   No per-session gate: coming back to the front door always asks
   how you'd like to enter.                                            */

type StoryCard = {
  eyebrow: string;
  title: string;
  line: string;
};

const CARDS: StoryCard[] = [
  {
    eyebrow: "Foyer",
    title: "An open digital museum for developers.",
    line: "Projects get rooms, not cards — a place to be walked through, not scrolled past.",
  },
  {
    eyebrow: "Walk through",
    title: "A real 3D corridor.",
    line: "Scroll to move. Every exhibit hangs on the walls, ready to inspect.",
  },
  {
    eyebrow: "Ask",
    title: "The AI curator knows every exhibit.",
    line: "Ask about any project on display and get a streamed answer, pulled live from the room.",
  },
  {
    eyebrow: "Beyond the corridor",
    title: "A flat view for everyone.",
    line: "2D keeps the same content accessible on any device, screen reader or reduced motion.",
  },
];

const CARD_DURATION_MS = 2600;

export function StoryIntro() {
  // Start on the choice card — the visitor picks a mode as soon as the page
  // appears. The story is opt-in via "Read the story".
  const [index, setIndex] = useState<number>(CARDS.length);
  const timedOutRef = useRef<boolean>(false);

  useEffect(() => {
    timedOutRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Auto-advance only while in the story (index < CARDS.length).
  useEffect(() => {
    if (timedOutRef.current) return;
    if (index >= CARDS.length) return;
    const t = window.setTimeout(() => {
      setIndex((i) => {
        if (i + 1 >= CARDS.length) return i; // stay on the last story card
        return i + 1;
      });
    }, CARD_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  const inStory = index < CARDS.length;
  const card = CARDS[Math.min(index, CARDS.length - 1)];

  const choiceButton =
    "flex-1 rounded-full px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a94c]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enter Foyer"
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#0a0b16] px-6 py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,169,76,0.10),transparent_55%)]" />
      <div className="relative w-full max-w-[600px] text-center">
        {inStory ? (
          <>
            {/* progress dots */}
            <div className="mb-8 flex items-center justify-center gap-1.5" aria-hidden="true">
              {CARDS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === index ? "w-6 bg-[#d4a94c]" : i < index ? "w-2 bg-[#d4a94c]/50" : "w-2 bg-[#f5efe0]/25"
                  }`}
                />
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4a94c]">{card.eyebrow}</p>
            <h1 className="mt-3 font-heading text-[42px] leading-[1.05] tracking-tight text-[#f5efe0] sm:text-[54px]">
              {card.title}
            </h1>
            <p className="mx-auto mt-5 max-w-[440px] text-base leading-relaxed text-[#f5efe0]/65">
              {card.line}
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIndex(CARDS.length)}
                className="min-h-[44px] rounded-full border border-[#f5efe0]/25 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#f5efe0]/70 transition-colors hover:border-[#f5efe0]/50 hover:text-[#f5efe0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5efe0]/50"
              >
                Skip story
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4a94c]">Step inside</p>
            <h1 className="mt-3 font-heading text-[36px] leading-[1.05] tracking-tight text-[#f5efe0] sm:text-[48px]">
              How do you want to explore?
            </h1>
            <p className="mx-auto mt-5 max-w-[460px] text-base leading-relaxed text-[#f5efe0]/65">
              Both lead into the same museum — same exhibits, same curator.
              Pick the way that fits your device and how you like to move.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link href="/?view=3d" className={`${choiceButton} bg-[#d4a94c] text-[#0a0b16] hover:bg-[#e2bc6a]`}>
                Enter in 3D&nbsp;&rarr;
              </Link>
              <Link
                href="/?view=2d"
                className={`${choiceButton} border border-[#f5efe0]/30 text-[#f5efe0]/90 hover:border-[#f5efe0]/60 hover:text-[#f5efe0]`}
              >
                Explore in 2D&nbsp;&rarr;
              </Link>
            </div>

            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#f5efe0]/40">
              3D — WebGL required · 2D — works everywhere
            </p>

            <button
              type="button"
              onClick={() => setIndex(0)}
              className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-[#f5efe0]/45 underline-offset-4 transition-colors hover:text-[#f5efe0]/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a94c]"
            >
              Read the story
            </button>
          </>
        )}
      </div>
    </div>
  );
}
