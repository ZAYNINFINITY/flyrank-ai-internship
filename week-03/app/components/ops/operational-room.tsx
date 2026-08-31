"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

/* ── Palette (warm editorial) ─────────────────────────────── */
const S = {
  bg: "#F5F0E7",
  surface: "#F8F3E9",
  text: "#2E2821",
  accent: "#C94F0A",
  border: "rgba(46,40,33,0.12)",
  muted: "rgba(46,40,33,0.45)",
} as const;

/* ── Scroll-reveal hook ──────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setVisible(true));
          obs.disconnect();
        }
      },
      { threshold },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── Count-up hook ───────────────────────────────────────── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      requestAnimationFrame(() => setValue(target));
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          requestAnimationFrame(() => setStarted(true));
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target * 100) / 100);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);

  return { ref, value };
}

/* ── Reveal wrapper ──────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Hand-drawn line illustration ─────────────────────────
   The recurring corridor sketch used in "The Exhibits"
   section. Stroke-only SVG — no dependency on the 3D renderer.
──────────────────────────────────────────────────────────── */

function CorridorIllustration() {
  const figure = "#3A2E22";
  const frames = [
    { x: 46, tone: S.accent },
    { x: 106, tone: "#8B6F47" },
    { x: 166, tone: "#B89968" },
    { x: 226, tone: "#6B5636" },
  ];
  return (
    <svg viewBox="0 0 270 150" fill="none" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="corridorWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE4CD" />
          <stop offset="100%" stopColor="#DCC79A" />
        </linearGradient>
        <linearGradient id="corridorFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7AE82" />
          <stop offset="100%" stopColor="#9C7F52" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="270" height="96" fill="url(#corridorWall)" />
      <rect x="0" y="96" width="270" height="54" fill="url(#corridorFloor)" />

      {frames.map(({ x, tone }) => (
        <g key={x}>
          <rect x={x - 16} y="27" width="36" height="46" rx="1" fill="#3A2E22" opacity="0.15" />
          <rect x={x - 18} y="24" width="36" height="46" rx="1" fill="#F5EEDD" stroke="#3A2E22" strokeWidth="1.4" />
          <rect x={x - 12} y="30" width="24" height="34" rx="1" fill={tone} opacity="0.75" />
        </g>
      ))}

      {/* figure touring the corridor */}
      <circle cx="26" cy="86" r="8" fill={figure} />
      <path
        d="M26 94c-9 0-15 8-15 18v34h14l1-24 1 24h16l1-24 1 24h14v-34c0-10-6-18-15-18z"
        fill={figure}
      />
    </svg>
  );
}

function DoorwayIllustration() {
  const figure = "#3A2E22";
  return (
    <svg viewBox="0 0 160 170" fill="none" className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="nextGlow" cx="80%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#F7D9A0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F7D9A0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nextDoor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4D3AE" />
          <stop offset="100%" stopColor="#C7AE82" />
        </linearGradient>
      </defs>

      <circle cx="120" cy="75" r="70" fill="url(#nextGlow)" />
      <rect x="90" y="20" width="50" height="120" rx="2" fill="#3A2E22" opacity="0.85" />
      <path d="M115 22l25 10v96l-25 10z" fill="url(#nextDoor)" />

      {/* figure heading toward the light */}
      <circle cx="35" cy="112" r="8" fill={figure} />
      <path
        d="M35 120c-9 0-15 8-15 18v30h13l1-20 1 20h15l1-20 1 20h13v-30c0-10-6-18-15-18z"
        fill={figure}
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* ── Main component                                       */
/* ══════════════════════════════════════════════════════════ */

export function OperationalRoom() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() =>
      setPrefersReduced(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    );
  }, []);

  return (
    <main
      className="min-h-[100dvh]"
      style={{
        backgroundColor: S.bg,
        color: S.text,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      }}
    >
      {/* Switch to the full 3D museum experience. The 2D room is the
          accessible/fallback layer, so the escape hatch back to the
          walkable corridor is always one tap away. */}
      <Link
        href="/?view=3d"
        className="fixed bottom-5 right-5 z-40 min-h-[44px] rounded-sm border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] shadow-lg backdrop-blur-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{
          color: "#f5efe0",
          backgroundColor: "rgba(20,22,35,0.85)",
          borderColor: "rgba(245,240,224,0.25)",
        }}
      >
        View in 3D
      </Link>

      {/* ── 01 · Hero ─────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-28 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[640px]">
              {/* Dot + label */}
              <div
                className="flex items-center gap-3 mb-5"
                style={{
                  opacity: prefersReduced ? 1 : undefined,
                  animation: prefersReduced
                    ? undefined
                    : "fadeSlideUp 0.5s ease 0ms both",
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: S.accent }}
                />
                <p
                  className="text-[11px] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "monospace", color: S.muted }}
                >
                  Foyer · Engine Room
                </p>
              </div>

              {/* Name */}
              <h1
                className="text-[36px] font-medium md:text-[52px] leading-[1.1]"
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  animation: prefersReduced
                    ? undefined
                    : "fadeSlideUp 0.5s ease 120ms both",
                }}
              >
                Zain Ul Abideen
              </h1>

              {/* Subtitle */}
              <p
                className="mt-3 text-[17px]"
                style={{
                  fontFamily: "Georgia, serif",
                  color: S.muted,
                  animation: prefersReduced
                    ? undefined
                    : "fadeSlideUp 0.5s ease 240ms both",
                }}
              >
                CS Student @ PAF-IAST · MERN Stack Developer
              </p>

              {/* Intro — this page is the engine room under the 3D
                  museum, not a portfolio landing page. */}
              <p
                className="mt-8 text-[15px] leading-[1.75]"
                style={{
                  color: "rgba(46,40,33,0.55)",
                  animation: prefersReduced
                    ? undefined
                    : "fadeSlideUp 0.5s ease 360ms both",
                }}
              >
                Foyer is a 3D museum — a corridor of exhibit rooms where projects
                live as gallery spaces, not portfolio cards, with an AI curator
                guiding the tour. This page is the engine room: the same museum,
                the same exhibits, running in plain 2D for devices that
                can&apos;t render WebGL, for screen readers, and for anyone
                auditing how it was built. The 3D corridor is the real
                experience — step inside if your device supports it.
              </p>

              {/* Buttons */}
              <div
                className="mt-10 flex flex-wrap gap-4"
                style={{
                  animation: prefersReduced
                    ? undefined
                    : "fadeSlideUp 0.5s ease 480ms both",
                }}
              >
                <Link
                  href="/exhibit/zayn"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border px-6 py-2.5 text-sm transition-colors duration-200"
                  style={{
                    borderColor: "rgba(46,40,33,0.3)",
                    backgroundColor: "rgba(46,40,33,0.04)",
                    color: S.text,
                  }}
                >
                  Step Into the 3D Museum →
                </Link>
                <Link
                  href="/assistant"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border px-6 py-2.5 text-sm transition-colors duration-200"
                  style={{
                    borderColor: "rgba(201,79,10,0.3)",
                    backgroundColor: "rgba(201,79,10,0.05)",
                    color: S.accent,
                  }}
                >
                  Talk to AI Curator →
                </Link>
              </div>

              {/* Scroll cue — kept, with the real sketch below it */}
              {!prefersReduced && (
                <div
                  className="mt-16 flex flex-col items-start gap-2"
                  style={{ animation: "fadeSlideUp 0.5s ease 700ms both" }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.15em]"
                    style={{ fontFamily: "monospace", color: S.muted }}
                  >
                    Scroll ↓
                  </span>
                  <div
                    className="h-[1px] w-8"
                    style={{
                      backgroundColor: S.accent,
                      animation: "bobDown 2s ease-in-out infinite",
                    }}
                  />
                </div>
              )}
              <div className="mt-6 w-[170px] sm:w-[200px]">
                <div className="rounded-[4px] p-[3px]" style={{ backgroundColor: "rgba(46,40,33,0.06)" }}>
                  <img
                    src="/images/story/scroll.webp"
                    alt="Scroll cue — move through the museum"
                    className="block h-auto w-full rounded-[2px]"
                    style={{ aspectRatio: "1024 / 1240", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-[220px] flex-shrink-0 md:mx-0 md:mt-4 md:w-[260px]">
              {/* arched doorway frame — echoes the museum's arches — with a warm
                  paper mount beneath, and multiply blending so the sketch reads
                  as part of the page, not a pasted image */}
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: "180px 180px 14px 14px",
                  backgroundColor: "rgba(46,40,33,0.05)",
                  padding: "6px",
                }}
              >
                <img
                  src="/images/story/dev.webp"
                  alt="A developer at work in the engine room"
                  className="block h-auto w-full"
                  style={{
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                    borderRadius: "174px 174px 9px 9px",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · The Story ────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-16"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              The Story
            </p>
          </Reveal>

          {/* Beat 1 — The Problem: crossed-out card grid */}
          <Reveal>
            <div className="relative mb-20">
              <span
                className="absolute -left-2 -top-6 text-[120px] font-medium leading-none pointer-events-none select-none md:text-[160px]"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "rgba(46,40,33,0.04)",
                }}
              >
                01
              </span>
              <div className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                <div className="max-w-[620px]">
                  <p
                    className="text-[11px] uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "monospace", color: S.accent }}
                  >
                    The Problem
                  </p>
                  <h2
                    className="text-[24px] font-medium md:text-[30px] leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Every developer portfolio looks the same.
                  </h2>
                  <p
                    className="mt-5 max-w-[600px] text-[15px] leading-[1.75]"
                    style={{ color: "rgba(46,40,33,0.55)" }}
                  >
                    Card grids. Thumbnail clusters. Identical layouts. Projects
                    compressed into tiny boxes fighting for attention, with no room
                    to tell the story behind what was built. I had four real
                    projects — a real-time collab platform, a live e-commerce
                    site, a browser extension, a POS system — and they all
                    deserved better than a list.
                  </p>
                </div>
                <div className="mx-auto w-[170px] flex-shrink-0 md:mx-0 md:mt-2 md:w-[200px]">
                  <div className="rounded-[4px] p-[3px]" style={{ backgroundColor: "rgba(46,40,33,0.06)" }}>
                    <img
                      src="/images/story/problem.webp"
                      alt="Every developer portfolio looking identical — the same card grid, repeated"
                      className="block h-auto w-full rounded-[2px]"
                      style={{ aspectRatio: "527 / 713", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="mt-16 h-[1px]"
                style={{ backgroundColor: S.border }}
              />
            </div>
          </Reveal>

          {/* Beat 2 — The Idea: figure viewing a framed exhibit in an archway */}
          <Reveal>
            <div className="relative mb-20">
              <span
                className="absolute -left-2 -top-6 text-[120px] font-medium leading-none pointer-events-none select-none md:text-[160px]"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "rgba(46,40,33,0.04)",
                }}
              >
                02
              </span>
              <div className="relative flex flex-col gap-10 md:flex-row-reverse md:items-start md:justify-between">
                <div className="max-w-[620px]">
                  <p
                    className="text-[11px] uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "monospace", color: S.accent }}
                  >
                    The Idea
                  </p>
                  <h2
                    className="text-[24px] font-medium md:text-[30px] leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    What if projects had rooms, not cards?
                  </h2>
                  <p
                    className="mt-5 max-w-[600px] text-[15px] leading-[1.75]"
                    style={{ color: "rgba(46,40,33,0.55)" }}
                  >
                    A foyer is the entrance hall of a museum. It sets the tone for
                    everything that follows. I wanted to build that — a place where
                    each project gets a dedicated 3D space with architectural
                    presence. A scrollable corridor, exhibit frames with a
                    sketch-to-paint reveal shader, an AI curator that answers
                    questions about what&apos;s on display. Not a portfolio. A museum.
                  </p>
                </div>
                <div className="mx-auto w-[170px] flex-shrink-0 md:mx-0 md:mt-2 md:w-[200px]">
                  <div className="rounded-[4px] p-[3px]" style={{ backgroundColor: "rgba(46,40,33,0.06)" }}>
                    <img
                      src="/images/story/idea.webp"
                      alt="A figure stepping into an arched museum room"
                      className="block h-auto w-full rounded-[2px]"
                      style={{ aspectRatio: "541 / 731", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="mt-16 h-[1px]"
                style={{ backgroundColor: S.border }}
              />
            </div>
          </Reveal>

          {/* Beat 3 — What Broke: the 3D↔2D seam, shown wide */}
          <Reveal>
            <div className="relative mb-20">
              <span
                className="absolute -left-2 -top-6 text-[120px] font-medium leading-none pointer-events-none select-none md:text-[160px]"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "rgba(46,40,33,0.04)",
                }}
              >
                03
              </span>
              <div className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                <div className="max-w-[620px]">
                  <p
                    className="text-[11px] uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "monospace", color: S.accent }}
                  >
                    What Broke
                  </p>
                  <h2
                    className="text-[24px] font-medium md:text-[30px] leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    The 3D-to-2D seam nearly killed the project.
                  </h2>
                  <p
                    className="mt-5 max-w-[640px] text-[15px] leading-[1.75]"
                    style={{ color: "rgba(46,40,33,0.55)" }}
                  >
                    Getting a Three.js scene and a flat React component to render
                    the same content — same data, same interactions, same feel —
                    without one becoming a degraded copy of the other. The first
                    attempt was an orbit diorama that felt like a toy. The second
                    attempt worked because the 2D path became a first-class
                    citizen, not a fallback. Capability detection at mount time
                    decides which renderer to use. Both consume the same data
                    layer. Making that seam invisible was the hardest architectural
                    decision in the project.
                  </p>
                </div>
                <div className="mx-auto w-[170px] flex-shrink-0 md:mx-0 md:mt-2 md:w-[200px]">
                  <div className="rounded-[4px] p-[3px]" style={{ backgroundColor: "rgba(46,40,33,0.06)" }}>
                    <img
                      src="/images/story/what-broke.webp"
                      alt="The seam between the 3D scene and its flat 2D equivalent"
                      className="block h-auto w-full rounded-[2px]"
                      style={{ aspectRatio: "530 / 723", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="mt-16 h-[1px]"
                style={{ backgroundColor: S.border }}
              />
            </div>
          </Reveal>

          {/* Beat 4 — What Shipped: stamp/seal */}
          <Reveal>
            <div className="relative mb-20">
              <span
                className="absolute -left-2 -top-6 text-[120px] font-medium leading-none pointer-events-none select-none md:text-[160px]"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "rgba(46,40,33,0.04)",
                }}
              >
                04
              </span>
              <div className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
                <div className="max-w-[620px]">
                  <p
                    className="text-[11px] uppercase tracking-[0.15em] mb-3"
                    style={{ fontFamily: "monospace", color: S.accent }}
                  >
                    What shipped
                  </p>
                  <h2
                    className="text-[24px] font-medium md:text-[30px] leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    A working museum, not a demo.
                  </h2>
                  <p
                    className="mt-5 max-w-[600px] text-[15px] leading-[1.75]"
                    style={{ color: "rgba(46,40,33,0.55)" }}
                  >
                    74 tests passing. Lighthouse 99.25 average. AI curator powered
                    by Gemini Flash. Custom GLSL reveal shader. Accessible 2D
                    fallback for screen readers. Deployed on Vercel with CI/CD.
                    Rate limiting, input validation, error states verified,
                    rollback plan documented. This isn&apos;t a class artifact.
                    It&apos;s a product.
                  </p>
                </div>
                <div className="mx-auto w-[170px] flex-shrink-0 md:mx-0 md:mt-2 md:w-[200px]">
                  <div className="rounded-[4px] p-[3px]" style={{ backgroundColor: "rgba(46,40,33,0.06)" }}>
                    <img
                      src="/images/story/what-shipped.webp"
                      alt="The finished museum — a working product, not a demo"
                      className="block h-auto w-full rounded-[2px]"
                      style={{ aspectRatio: "509 / 660", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 03 · What AI Does ──────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <div className="mb-16 max-w-[600px]">
              <p
                className="text-[11px] uppercase tracking-[0.2em] mb-3"
                style={{ fontFamily: "monospace", color: S.muted }}
              >
                Where AI Does the Heavy Lifting
              </p>
              <p
                className="text-[14px]"
                style={{ color: "rgba(46,40,33,0.35)" }}
              >
                One thing AI did that I couldn&apos;t have done alone: it manages
                the museum experience — from curating exhibits to detecting
                device capability to generating the reveal effect.
              </p>
            </div>
          </Reveal>

          {/* AI 01 — left icon */}
          <Reveal>
            <div className="flex gap-8 items-start mb-16 md:gap-12">
              <div className="flex-shrink-0 mt-1">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  style={{ color: S.accent }}
                >
                  <circle
                    cx="20"
                    cy="14"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="17" cy="13" r="1.5" fill="currentColor" />
                  <circle cx="23" cy="13" r="1.5" fill="currentColor" />
                  <path
                    d="M16 17c1 1.5 3 2 4 2s3-.5 4-2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.15em] mb-2"
                  style={{ fontFamily: "monospace", color: S.accent }}
                >
                  01
                </p>
                <h3
                  className="text-[20px] font-medium mb-3"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  AI Curator
                </h3>
                <p
                  className="text-[15px] leading-[1.75] max-w-[600px]"
                  style={{ color: "rgba(46,40,33,0.55)" }}
                >
                  Gemini Flash via OpenRouter with a custom exhibitLookup tool.
                  Visitors ask questions — AI pulls live data from the repository
                  and responds. The engineering was in the tool schema, not the
                  prompt. A good schema means the model feels smart.
                </p>
                <Link
                  href="/assistant"
                  className="inline-block mt-4 text-[13px] transition-colors duration-200"
                  style={{ color: S.accent }}
                >
                  Try it →
                </Link>
              </div>
            </div>
          </Reveal>

          {/* AI 02 — right icon */}
          <Reveal>
            <div className="flex gap-8 items-start mb-16 md:gap-12 md:flex-row-reverse md:text-right md:justify-end">
              <div className="flex-shrink-0 mt-1">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  style={{ color: S.accent }}
                >
                  <circle cx="20" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="10" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="30" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="20" y1="13" x2="10" y2="21" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="20" y1="13" x2="30" y2="21" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="10" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.15em] mb-2"
                  style={{ fontFamily: "monospace", color: S.accent }}
                >
                  02
                </p>
                <h3
                  className="text-[20px] font-medium mb-3"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Capability Detection
                </h3>
                <p
                  className="text-[15px] leading-[1.75] max-w-[600px]"
                  style={{ color: "rgba(46,40,33,0.55)" }}
                >
                  Checks WebGL2, prefers-reduced-motion, memory, and pointer
                  type at mount time. Powerful devices get the 3D museum.
                  Everything else gets this 2D operational view — same data,
                  full access. No degraded fallback.
                </p>
                <a
                  href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/renderer/capability.ts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[13px] transition-colors duration-200"
                  style={{ color: S.accent }}
                >
                  View source →
                </a>
              </div>
            </div>
          </Reveal>

          {/* AI 03 — left icon */}
          <Reveal>
            <div className="flex gap-8 items-start md:gap-12">
              <div className="flex-shrink-0 mt-1">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  style={{ color: S.accent }}
                >
                  <path
                    d="M20 8l4 8h-3v10h-2V16h-3l4-8z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 30l4-4m12 4l-4-4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <line x1="20" y1="26" x2="20" y2="34" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.15em] mb-2"
                  style={{ fontFamily: "monospace", color: S.accent }}
                >
                  03
                </p>
                <h3
                  className="text-[20px] font-medium mb-3"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Reveal Shader
                </h3>
                <p
                  className="text-[15px] leading-[1.75] max-w-[600px]"
                  style={{ color: "rgba(46,40,33,0.55)" }}
                >
                  Custom GLSL injected into Three.js via onBeforeCompile.
                  Exhibits start as pencil sketches, dissolve into finished
                  pieces as you approach. 77 lines of shader code. The signature
                  visual effect.
                </p>
                <a
                  href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/three/reveal-material.ts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[13px] transition-colors duration-200"
                  style={{ color: S.accent }}
                >
                  View source →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 04 · The Exhibits ──────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-[600px]">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] mb-3"
                  style={{ fontFamily: "monospace", color: S.muted }}
                >
                  The Exhibits
                </p>
                <p
                  className="text-[14px]"
                  style={{ color: "rgba(46,40,33,0.35)" }}
                >
                  These four projects are what&apos;s currently on display inside
                  Foyer — real, shipped work, each with its own room in the
                  museum. Not a résumé. A collection.
                </p>
              </div>
              <div className="mx-auto w-[220px] flex-shrink-0 md:mx-0 md:w-[240px]">
                <CorridorIllustration />
              </div>
            </div>
          </Reveal>

          <ProjectBlock
            title="Collaborative Workspace"
            stack="MERN · Socket.io · OAuth 2.0"
            description="Real-time collaboration platform with live chat, Kanban boards, and multi-user document editing."
            museumHref="/exhibit/zayn#collaborative-workspace"
          />
          <ProjectBlock
            title="POS-it"
            stack="Electron · React · SQLite"
            description="Professional offline point-of-sale system with inventory, invoicing, and auto-updates."
            museumHref="/exhibit/zayn#pos-it"
          />
          <ProjectBlock
            title="ZSE Store"
            stack="React · Node.js · MySQL"
            description="Live e-commerce site with product catalog, brand filtering, and WhatsApp order integration."
            museumHref="/exhibit/zayn#zse-store"
          />
          <ProjectBlock
            title="ScrollStreak"
            stack="Chrome Extension · JavaScript"
            description="Instagram Reels tracker with friend duels, leaderboards, and weekly Wrapped stats."
            museumHref="/exhibit/zayn#scrollstreak"
          />
        </div>
      </section>

      {/* ── 05 · Honest Numbers ────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-16"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Honest Numbers
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4">
            <CountStat label="Exhibits" target={1} suffix="" note="1 developer, 4 projects" isInt />
            <CountStat label="Tests" target={74} suffix="/74" note="all passing" isInt />
            <CountStat label="Lighthouse" target={99.25} suffix="" note="average across 4 routes" isInt={false} />
            <CountStat label="Shader" target={77} suffix=" lines" note="custom GLSL" isInt />
          </div>
        </div>
      </section>

      {/* ── 06 · Honest Limitations ────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-12"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Honest Limitations
            </p>
          </Reveal>

          <div className="max-w-[720px] space-y-8">
            <LimitationRow
              index="01"
              text="3D canvas has no ARIA labels — screen readers can't navigate the museum. The 2D fallback provides full accessibility."
            />
            <LimitationRow
              index="02"
              text="No physical device testing — all testing done via DevTools mobile simulation. Real device testing is the next step."
            />
            <LimitationRow
              index="03"
              text="No external error tracking — Sentry not wired yet. Monitoring is manual via Vercel dashboard."
            />
            <LimitationRow
              index="04"
              text="Portfolio is on a Vercel subdomain, not a custom domain. Works, but a custom domain would feel more permanent."
            />
          </div>
        </div>
      </section>

      {/* ── 07 · What's Next ───────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="pt-16" style={{ borderTop: `1px solid ${S.border}` }}>
            <Reveal>
              <p
                className="text-[11px] uppercase tracking-[0.2em] mb-12"
                style={{ fontFamily: "monospace", color: S.muted }}
              >
                What&apos;s Next
              </p>
            </Reveal>

            <Reveal>
              <div className="flex flex-col gap-10 md:flex-row-reverse md:items-start md:justify-between">
                <div className="max-w-[600px]">
                  <p
                    className="text-[22px] font-medium"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Next case study: Collaborative Workspace
                  </p>
                  <p
                    className="mt-4 text-[15px] leading-[1.75]"
                    style={{ color: "rgba(46,40,33,0.55)" }}
                  >
                    It&apos;s already built — real-time MERN app with Socket.io,
                    Kanban, OAuth. Needs to be exhibited in Foyer. Steps
                    documented in the roadmap. Reminder set: September 15, 2026.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/plan-to-keep-building.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-5 py-2 text-[13px] transition-colors duration-200"
                      style={{
                        borderColor: "rgba(46,40,33,0.12)",
                        color: "rgba(46,40,33,0.6)",
                      }}
                    >
                      Read the Roadmap ↗
                    </a>
                    <a
                      href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/issues/17"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border bg-transparent px-5 py-2 text-[13px] transition-colors duration-200"
                      style={{
                        borderColor: "rgba(46,40,33,0.12)",
                        color: "rgba(46,40,33,0.6)",
                      }}
                    >
                      Issue #17 ↗
                    </a>
                  </div>
                </div>
                <div className="mx-auto w-[130px] flex-shrink-0 md:mx-0 md:w-[150px]">
                  <DoorwayIllustration />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 08 · Routes ────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-8"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Museum Routes
            </p>
          </Reveal>

          <div>
            <RouteRow tag="CATALOG" label="Exhibit Catalog" href="/explore" />
            <RouteRow tag="LIVE" label="My Exhibit" href="/exhibit/zayn" />
            <RouteRow tag="AI" label="AI Curator" href="/assistant" />
            <RouteRow tag="INFO" label="About Foyer" href="/about" />
            <RouteRow tag="3D" label="Museum Entrance" href="/entrance" />
            <RouteRow tag="3D" label="Collection" href="/collection" />
          </div>
        </div>
      </section>

      {/* ── 09 · Stack ─────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-8"
              style={{ fontFamily: "monospace", color: S.muted }}
            >
              Stack
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Tailwind CSS",
                "Vite",
                "Next.js",
                "Node.js",
                "Express.js",
                "Socket.io",
                "MongoDB",
                "MySQL",
                "SQLite",
                "Three.js",
                "GLSL",
                "React Three Fiber",
                "AI SDK",
                "OpenRouter",
                "Gemini Flash",
                "Git",
                "GitHub Actions",
                "Vercel",
                "OAuth 2.0",
                "JWT",
                "Zod",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-[3px] px-3 py-1.5 text-[12px]"
                  style={{
                    border: `1px solid ${S.border}`,
                    fontFamily: "monospace",
                    color: "rgba(46,40,33,0.5)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="px-6 pb-12 sm:px-8 md:px-12">
        <div
          className="mx-auto max-w-[1120px] pt-8"
          style={{ borderTop: `1px solid ${S.border}` }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-[13px]"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                Foyer · Open digital museum for developers
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.2)" }}
              >
                Built by ZAYNINFINITY · AI Fluency + Frontend AI Engineering
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com/ZAYNINFINITY/flyrank-ai-internship"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                GitHub
              </a>
              <a
                href="https://zainportfoli0.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                Portfolio
              </a>
              <Link
                href="/about"
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(46,40,33,0.3)" }}
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Keyframes ───────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bobDown {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════ */
/* ── Sub-components                                       */
/* ══════════════════════════════════════════════════════════ */

function ProjectBlock({
  title,
  stack,
  description,
  museumHref,
}: {
  title: string;
  stack: string;
  description: string;
  museumHref: string;
}) {
  return (
    <Reveal>
      <div className="mb-16">
        <h3
          className="text-[24px] font-medium md:text-[28px]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {title}
        </h3>
        <p
          className="mt-2 text-[11px] uppercase tracking-[0.2em]"
          style={{ fontFamily: "monospace", color: S.accent }}
        >
          {stack}
        </p>
        <p
          className="mt-4 text-[15px] leading-[1.75] max-w-[640px]"
          style={{ color: "rgba(46,40,33,0.55)" }}
        >
          {description}
        </p>
        <Link
          href={museumHref}
          className="group mt-4 inline-flex items-center gap-1 text-[13px] transition-colors duration-200"
          style={{ color: S.accent }}
        >
          Museum
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      <div className="h-[1px] mb-0" style={{ backgroundColor: S.border }} />
    </Reveal>
  );
}

function CountStat({
  label,
  target,
  suffix,
  note,
  isInt,
}: {
  label: string;
  target: number;
  suffix: string;
  note: string;
  isInt: boolean;
}) {
  const { ref, value } = useCountUp(target);
  const display = isInt ? Math.round(value) : value.toFixed(2);

  return (
    <div ref={ref}>
      <p
        className="text-[11px] uppercase tracking-[0.15em] mb-3"
        style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.4)" }}
      >
        {label}
      </p>
      <p
        className="text-[40px] font-medium leading-none md:text-[48px]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {display}
        <span className="text-[20px]">{suffix}</span>
      </p>
      <p
        className="mt-2 text-[12px]"
        style={{ color: "rgba(46,40,33,0.3)" }}
      >
        {note}
      </p>
    </div>
  );
}

function LimitationRow({
  index,
  text,
}: {
  index: string;
  text: string;
}) {
  return (
    <Reveal>
      <div className="flex gap-4">
        <span
          className="flex-shrink-0 text-[11px] uppercase tracking-[0.1em] mt-1"
          style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.2)" }}
        >
          {index}
        </span>
        <p
          className="text-[15px] leading-[1.75]"
          style={{ color: "rgba(46,40,33,0.5)" }}
        >
          {text}
        </p>
      </div>
    </Reveal>
  );
}

function RouteRow({
  tag,
  label,
  href,
}: {
  tag: string;
  label: string;
  href: string;
}) {
  return (
    <Reveal>
      <Link
        href={href}
        className="group flex items-center justify-between py-5 transition-colors duration-200"
        style={{ borderBottom: `1px solid ${S.border}` }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-[10px] uppercase tracking-[0.15em] w-16 flex-shrink-0"
            style={{ fontFamily: "monospace", color: "rgba(46,40,33,0.3)" }}
          >
            {tag}
          </span>
          <p
            className="text-[16px] font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {label}
          </p>
        </div>
        <span
          className="text-[14px] transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          style={{ color: S.accent }}
        >
          →
        </span>
      </Link>
    </Reveal>
  );
}
