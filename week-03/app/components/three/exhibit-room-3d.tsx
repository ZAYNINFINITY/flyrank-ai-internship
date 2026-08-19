"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  mockExhibits,
  MockExhibitRepository,
} from "@/lib/repository/mock-exhibit-repository";
import type { SurfaceLayout } from "@/lib/museum/queries";
import type { RendererQuality } from "@/lib/renderer/capability";
import { createPlacementMap, populateCorridor } from "@/lib/museum/placement";
import { getSurfaceLayout } from "@/lib/museum/queries";
import { SurfaceRenderer } from "@/components/renderer/surface-renderer";
import { ChatPanel } from "@/components/ai/chat-panel";
import { ErrorBoundary } from "@/components/ai/error-boundary";
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import type { InspectInfo } from "@/lib/museum/walkable-model";
import { resolveSpawnFromVia } from "@/lib/museum/walkable-model";
import { viaForRoom } from "@/lib/museum/via-entry";
import { WalkableWorldCanvas } from "./walkable-world";
import {
  attachWalkableKeyboard,
  attachWalkablePointer,
  createWalkableTouch,
  detachWalkableKeyboard,
  inputState,
  resetWalkableInput,
} from "./walkable-input";

const SOURCE_LABELS: Record<InspectInfo["source"], string> = {
  title: "Exhibit · title wall",
  notes: "Curator's note",
  artifact: "Artifact on display",
  projection: "Media projection",
  frame: "Corridor · exhibit wall",
  signage: "Wayfinding",
  curator: "Curator in the room",
};

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function ExhibitRoom3D({
  layout,
  exhibitId,
  portfolioRoute,
  quality,
  arrivedVia,
}: {
  layout: SurfaceLayout[];
  exhibitId: string;
  portfolioRoute?: string;
  quality: RendererQuality;
  arrivedVia?: string | null;
}) {
  const exhibit = mockExhibits.find((e) => e.id === exhibitId);
  const [showTextWalls, setShowTextWalls] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [inspect, setInspect] = useState<InspectInfo | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [corridorLayout, setCorridorLayout] = useState<SurfaceLayout[] | null>(null);
  const openDoors = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );
  // Portal target: rendered straight onto document.body so the fullscreen
  // layer is genuinely pinned to the viewport, immune to any ancestor
  // acquiring a transform (e.g. a finished CSS animation leaves a resting
  // `transform` value, which turns that ancestor into the containing block
  // for `position: fixed` descendants per spec).
  const [mounted] = useState(() => typeof window !== "undefined");
  const [arrivalIntro, setArrivalIntro] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const inspectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneReady) return;
    const t = window.setTimeout(() => setArrivalIntro(false), 2800);
    return () => window.clearTimeout(t);
  }, [sceneReady]);

  useEffect(() => {
    if (inspect && inspectRef.current) {
      inspectRef.current.focus();
    }
  }, [inspect]);

  useEffect(() => {
    let alive = true;
    populateCorridor(
      createPlacementMap(),
      "main-corridor",
      new MockExhibitRepository(),
      mockExhibits
    ).then((map) => {
      if (alive) setCorridorLayout(getSurfaceLayout("main-corridor", map));
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    attachWalkableKeyboard();
    const detachPointer = attachWalkablePointer(containerRef.current ?? document.body);
    const el = containerRef.current;
    const handlers = createWalkableTouch();
    el?.addEventListener("pointerdown", handlers.onPointerDown);
    el?.addEventListener("pointermove", handlers.onPointerMove);
    el?.addEventListener("pointerup", handlers.onPointerUp);
    el?.addEventListener("pointercancel", handlers.onPointerUp);
    return () => {
      detachWalkableKeyboard();
      detachPointer();
      el?.removeEventListener("pointerdown", handlers.onPointerDown);
      el?.removeEventListener("pointermove", handlers.onPointerMove);
      el?.removeEventListener("pointerup", handlers.onPointerUp);
      el?.removeEventListener("pointercancel", handlers.onPointerUp);
      resetWalkableInput();
    };
  }, []);

  const closeInspect = useCallback(() => setInspect(null), []);

  useEffect(() => {
    if (!inspect) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInspect();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inspect, closeInspect]);

  const handleInspect = useCallback((info: InspectInfo) => {
    setInspect(info);
  }, []);

  if (!exhibit || sceneFailed) {
    return <SurfaceRenderer layout={layout} entityComponents={defaultEntityRegistry} />;
  }

  if (showTextWalls) {
    return (
      <div>
        <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] opacity-40">
              Room · text walls
            </p>
            <p className="mt-1 text-sm opacity-60">
              Flat version of the same room for low-power devices and
              screen readers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTextWalls(false)}
            className="border border-[var(--color-text)]/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text)]/60 transition-all duration-500 hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View the room in 3D
          </button>
        </div>
        <SurfaceRenderer layout={layout} entityComponents={defaultEntityRegistry} />
      </div>
    );
  }

  // Rail spawn points: reception end (18) is the default front-door start;
  // a direct link from a corridor frame drops you just past that door,
  // further along the rail, near the room's own content.
  const validatedVia = viaForRoom(arrivedVia ?? null, "exhibit-room");
  const spawn = resolveSpawnFromVia(validatedVia);

  const scene = (
    <div
      ref={containerRef}
      className="walkable-scene fixed inset-0 z-40 h-[100dvh] w-screen touch-none select-none bg-[#e9e4d6]"
    >
      <SceneErrorBoundary onError={() => setSceneFailed(true)}>
        {corridorLayout && (
          <WalkableWorldCanvas
            corridorLayout={corridorLayout}
            roomLayout={layout}
            exhibits={mockExhibits}
            exhibit={exhibit}
            spawn={spawn}
            quality={quality}
            openDoors={openDoors}
            onPrompt={setPrompt}
            onInspect={handleInspect}
            onDoorOpened={() => undefined}
            onReady={() => setSceneReady(true)}
            enabled={!inspect}
          />
        )}
      </SceneErrorBoundary>

      {arrivalIntro && (
        <div
          className={`pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-[#efe9da]/95 ${
            sceneReady ? "motion-safe:animate-[fade-out_2.8s_ease_forwards]" : ""
          }`}
          aria-hidden="true"
        >
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#6f6c62]">Approaching</p>
            <p className="mt-2 font-heading text-xl tracking-tight text-[#2a2a30]">Plinth Museum</p>
          </div>
        </div>
      )}

      {/* Vignette + grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[45] bg-[radial-gradient(circle_at_center,transparent_65%,rgba(70,58,34,0.06)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[44] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      {/* Top-left identity chip — same pill/blur/border treatment as every
          other overlay element, instead of text floating bare on the canvas */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-0.5 rounded-sm border border-[#2a2a30]/15 bg-[#efe9da]/85 px-3 py-2 shadow-sm backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#2a2a30]/80">
          Plinth
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#2a2a30]/50">
          {isTouch ? "Swipe to move · Tap to inspect" : "Scroll to move · Click to inspect"}
        </p>
      </div>

      {/* Escape hatch for low-power devices / screen readers, tucked into a
          corner instead of a page-level button above the scene */}
      <button
        type="button"
        onClick={() => setShowTextWalls(true)}
        className="pointer-events-auto absolute right-4 top-4 min-h-[44px] rounded-sm border border-[#2a2a30]/20 bg-[#efe9da]/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#2a2a30]/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#2a2a30]/50 hover:text-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Text walls
      </button>

      {prompt && !inspect && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center px-4">
          <button
            type="button"
            data-testid="walkable-prompt"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              inputState.activate = true;
            }}
            className="pointer-events-auto rounded-sm border border-[#2a2a30]/25 bg-[#efe9da]/90 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#2a2a30]/90 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-[#2a2a30]/50"
          >
            {prompt}
            <span aria-hidden="true" className="ml-3 opacity-50">
              {isTouch ? "\u00A0Tap" : "\u00A0Click"}
            </span>
          </button>
        </div>
      )}

      {inspect && inspect.source === "curator" && (
        <div
          ref={inspectRef}
          role="dialog"
          aria-modal="true"
          aria-label="Curator chat"
          tabIndex={-1}
          className="absolute inset-x-3 bottom-3 h-[70vh] max-h-[640px] overflow-hidden rounded-sm border border-[#2a2a30]/15 bg-[#efe9da]/98 shadow-lg backdrop-blur-sm focus:outline-none sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-[26rem]"
        >
          <ErrorBoundary
            fallback={
              <div
                role="alert"
                className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
              >
                <p className="font-heading text-[15px] font-medium text-[#2a2a30]">
                  The curator hit a snag
                </p>
                <p className="max-w-[260px] text-[12px] text-[#2a2a30]/50">
                  Something went wrong loading the chat. Close and try again.
                </p>
                <button
                  type="button"
                  onClick={closeInspect}
                  className="mt-1 rounded-sm border border-[#2a2a30]/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#2a2a30]/60 hover:border-[#2a2a30]/50 hover:text-[#2a2a30]"
                >
                  Close
                </button>
              </div>
            }
          >
            <ChatPanel
              variant="panel"
              heading="Curator"
              subtitle="Ask about the museum"
              onClose={closeInspect}
            />
          </ErrorBoundary>
        </div>
      )}

      {inspect && inspect.source !== "curator" && (
        <div
          ref={inspectRef}
          role="dialog"
          aria-modal="true"
          aria-label="Inspect"
          tabIndex={-1}
          className="absolute inset-x-3 bottom-3 rounded-sm border border-[#2a2a30]/15 bg-[#efe9da]/95 p-5 shadow-lg backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-[22rem] focus:outline-none"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6f6c62]">
            {SOURCE_LABELS[inspect.source]}
          </p>
          <h4 className="mt-1 font-heading text-lg tracking-tight text-[#2a2a30]">
            {inspect.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-[#2a2a30]/70">
            {inspect.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {inspect.href && (
              <Link
                href={inspect.href}
                className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.2em] text-[#2a2a30]/60 transition-opacity duration-200 hover:text-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {inspect.hrefLabel ?? "Continue"} &rarr;
              </Link>
            )}
            {portfolioRoute && !inspect.href && (
              <Link
                href={portfolioRoute}
                className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.2em] text-[#2a2a30]/60 transition-opacity duration-200 hover:text-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Open full exhibit &rarr;
              </Link>
            )}
            <button
              type="button"
              onClick={closeInspect}
              className="rounded-sm border border-[#2a2a30]/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#2a2a30]/60 transition-all duration-200 hover:border-[#2a2a30]/50 hover:text-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Exit back to the flat museum. Shifted right of the corner (left-20,
          not left-4) so it doesn't collide with the site's own chat/profile
          widget, which lives in that exact bottom-left corner. */}
      <Link
        href={portfolioRoute ?? "/"}
        className="pointer-events-auto absolute bottom-4 left-20 min-h-[44px] rounded-sm border border-[#2a2a30]/20 bg-[#efe9da]/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#2a2a30]/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#2a2a30]/50 hover:text-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        &larr; Leave the room
      </Link>
    </div>
  );

  if (!mounted) return null;
  return createPortal(scene, document.body);
}
