export type RendererMode = "2d" | "3d";

export type RendererQuality = {
  maxDpr: number;
  shadows: boolean;
};

export type CapabilityInput = {
  supportsWebGL2: boolean;
  prefersReducedMotion: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  coarsePointer: boolean;
};

export type RendererCapability = {
  mode: RendererMode;
  reason: "webgl2-ok" | "unsupported-webgl" | "reduced-motion" | "low-memory";
  quality: RendererQuality;
};

const FALLBACK_QUALITY: RendererQuality = { maxDpr: 1, shadows: false };

export function evaluateRendererCapability(input: CapabilityInput): RendererCapability {
  if (!input.supportsWebGL2) {
    return { mode: "2d", reason: "unsupported-webgl", quality: FALLBACK_QUALITY };
  }
  if (input.prefersReducedMotion) {
    return { mode: "2d", reason: "reduced-motion", quality: FALLBACK_QUALITY };
  }

  const memory = input.deviceMemory ?? (input.hardwareConcurrency && input.hardwareConcurrency < 4 ? 2 : 4);
  if (memory < 2) {
    return { mode: "2d", reason: "low-memory", quality: FALLBACK_QUALITY };
  }

  const maxDpr = input.coarsePointer || memory < 4 ? 1.5 : 2;
  const shadows = !input.coarsePointer && memory >= 4;

  return { mode: "3d", reason: "webgl2-ok", quality: { maxDpr, shadows } };
}

export function detectCapabilityInput(): CapabilityInput {
  if (typeof window === "undefined") {
    return {
      supportsWebGL2: false,
      prefersReducedMotion: false,
      deviceMemory: null,
      hardwareConcurrency: null,
      coarsePointer: false,
    };
  }

  let supportsWebGL2 = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    supportsWebGL2 = !!gl;
  } catch {
    supportsWebGL2 = false;
  }

  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory ?? null;

  return {
    supportsWebGL2,
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
  };
}
