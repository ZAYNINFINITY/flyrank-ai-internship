"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
import { defaultEntityRegistry } from "@/components/renderer/entities/default-registry";
import type { InspectInfo } from "@/lib/museum/walkable-model";
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
    const handlers = createWalkableTouch(() => containerRef.current);
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
    if (document.pointerLockElement) document.exitPointerLock();
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

  const spawn: [number, number, number] =
    arrivedVia === "door-exhibit-from-corridor" ? [0, 1.7, -9.5] : [0, 1.7, 9];

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] opacity-40">
            Room · walkable 3D
          </p>
          <p className="mt-1 text-sm opacity-60">
            {isTouch
              ? "Left side: drag to walk · Right side: drag to look"
              : "Click to look · WASD to walk · E to interact · Esc to release"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTextWalls(true)}
          className="border border-[var(--color-text)]/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-text)]/60 transition-all duration-500 hover:border-[var(--color-text)]/40 hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View as text walls
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative h-[62vh] min-h-[440px] cursor-crosshair touch-none select-none border border-[var(--color-text)]/10 bg-[#0b0d1c]"
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
              enabled={!inspect}
            />
          )}
        </SceneErrorBoundary>

        <p className="pointer-events-none absolute left-3 top-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
          Plinth · walkable corridor
        </p>

        {prompt && !inspect && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                inputState.activate = true;
              }}
              className="pointer-events-auto border border-white/20 bg-black/55 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm transition-colors duration-300 hover:border-white/40"
            >
              {prompt}
              <span className="ml-3 opacity-50">{isTouch ? "Tap" : "E"}</span>
            </button>
          </div>
        )}

        {inspect && (
          <div
            role="dialog"
            aria-modal="false"
            aria-label="Inspect"
            className="absolute inset-x-3 bottom-3 border border-[var(--color-text)]/15 bg-[color-mix(in_srgb,var(--color-background)_92%,transparent)] p-5 backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-[22rem]"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-40">
              {SOURCE_LABELS[inspect.source]}
            </p>
            <h4 className="mt-1 font-heading text-lg tracking-tight">
              {inspect.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed opacity-70">
              {inspect.body}
            </p>
            <div className="mt-4 flex items-center justify-between gap-4">
              {portfolioRoute && (
                <Link
                  href={portfolioRoute}
                  className="text-xs uppercase tracking-[0.2em] opacity-60 transition-opacity duration-300 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Open full exhibit &rarr;
                </Link>
              )}
              <button
                type="button"
                onClick={closeInspect}
                className="border border-[var(--color-text)]/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] opacity-60 transition-all duration-300 hover:border-[var(--color-text)]/40 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
