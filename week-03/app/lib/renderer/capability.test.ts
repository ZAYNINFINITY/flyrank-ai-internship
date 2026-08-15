import { afterEach, describe, expect, it, vi } from "vitest";
import {
  detectCapabilityInput,
  evaluateRendererCapability,
  type CapabilityInput,
} from "./capability";

const capableDesktop: CapabilityInput = {
  supportsWebGL2: true,
  prefersReducedMotion: false,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
};

describe("evaluateRendererCapability", () => {
  it("falls back to 2D when WebGL2 is unavailable", () => {
    const result = evaluateRendererCapability({ ...capableDesktop, supportsWebGL2: false });
    expect(result.mode).toBe("2d");
    expect(result.reason).toBe("unsupported-webgl");
    expect(result.quality).toEqual({ maxDpr: 1, shadows: false });
  });

  it("falls back to 2D when the user prefers reduced motion", () => {
    const result = evaluateRendererCapability({ ...capableDesktop, prefersReducedMotion: true });
    expect(result.mode).toBe("2d");
    expect(result.reason).toBe("reduced-motion");
  });

  it("falls back to 2D on very low-memory devices", () => {
    const result = evaluateRendererCapability({ ...capableDesktop, deviceMemory: 1 });
    expect(result.mode).toBe("2d");
    expect(result.reason).toBe("low-memory");
  });

  it("estimates a 2 GB baseline from a low thread count when deviceMemory is hidden, and renders low-tier 3D", () => {
    const result = evaluateRendererCapability({
      ...capableDesktop,
      deviceMemory: null,
      hardwareConcurrency: 2,
    });
    expect(result.mode).toBe("3d");
    expect(result.quality).toEqual({ maxDpr: 1.5, shadows: false });
  });

  it("renders 3D on capable desktop hardware with full quality", () => {
    const result = evaluateRendererCapability(capableDesktop);
    expect(result.mode).toBe("3d");
    expect(result.reason).toBe("webgl2-ok");
    expect(result.quality).toEqual({ maxDpr: 2, shadows: true });
  });

  it("caps DPR and disables shadows for touch/coarse-pointer devices", () => {
    const result = evaluateRendererCapability({ ...capableDesktop, coarsePointer: true });
    expect(result.mode).toBe("3d");
    expect(result.quality).toEqual({ maxDpr: 1.5, shadows: false });
  });

  it("caps DPR and disables shadows on mid-range memory (2-3 GB)", () => {
    const result = evaluateRendererCapability({ ...capableDesktop, deviceMemory: 3 });
    expect(result.quality).toEqual({ maxDpr: 1.5, shadows: false });
  });

  it("uses the estimated 4 GB baseline when memory and concurrency are both unknown", () => {
    const result = evaluateRendererCapability({
      ...capableDesktop,
      deviceMemory: null,
      hardwareConcurrency: null,
    });
    expect(result.mode).toBe("3d");
    expect(result.quality).toEqual({ maxDpr: 2, shadows: true });
  });
});

describe("detectCapabilityInput", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports no WebGL2 during SSR (no window)", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);
    const input = detectCapabilityInput();
    expect(input.supportsWebGL2).toBe(false);
    expect(input.deviceMemory).toBeNull();
  });

  it("detects WebGL2, reduced motion, memory, concurrency and pointer type in the browser", () => {
    vi.stubGlobal("document", {
      createElement: () => ({ getContext: () => ({}) }),
    });
    vi.stubGlobal("window", {
      matchMedia: vi.fn((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
      })),
    });
    vi.stubGlobal("navigator", { deviceMemory: 6, hardwareConcurrency: 4 });

    const input = detectCapabilityInput();
    expect(input.supportsWebGL2).toBe(true);
    expect(input.prefersReducedMotion).toBe(true);
    expect(input.deviceMemory).toBe(6);
    expect(input.hardwareConcurrency).toBe(4);
    expect(input.coarsePointer).toBe(false);
  });

  it("treats a throwing getContext as no WebGL support", () => {
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => {
          throw new Error("software renderer unavailable");
        },
      }),
    });
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal("navigator", { deviceMemory: 8, hardwareConcurrency: 8 });

    expect(detectCapabilityInput().supportsWebGL2).toBe(false);
  });

  it("treats a null getContext result as no WebGL support", () => {
    vi.stubGlobal("document", {
      createElement: () => ({ getContext: () => null }),
    });
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }) });
    vi.stubGlobal("navigator", { deviceMemory: 8, hardwareConcurrency: 8 });

    expect(detectCapabilityInput().supportsWebGL2).toBe(false);
  });
});
