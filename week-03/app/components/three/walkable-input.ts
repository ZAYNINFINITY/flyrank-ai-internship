"use client";

// Scroll-driven navigation input, itom-style: the wheel (or a vertical
// touch drag) glides the camera forward/back along the museum's single
// through-line — reception, into the corridor, into the exhibit room.
// Mouse position gently offsets the camera for a "looking around" parallax
// effect. There's no pointer lock and no WASD; scrolling further into the
// space IS the walking.

export const inputState = {
  // Accumulated wheel/drag delta since the last frame; the player consumes
  // and resets this every tick so input isn't tied to event frequency.
  scrollDelta: 0,
  // Normalized -1..1 mouse position, used for the parallax look-around on
  // desktop (mouse) and as a touch-drag fallback on mobile when the
  // gyroscope isn't enabled/available.
  mouse: { x: 0, y: 0 },
  // E key / tap-the-prompt-button to inspect whatever's nearest — kept as
  // an accessible fallback alongside direct click-to-inspect below.
  activate: false,
  // Set by a raycasted click/tap directly on an object in the scene (see
  // InteractiveHitboxes in walkable-world.tsx). This is the primary
  // interaction now: click what you want to inspect, instead of only
  // whatever happens to be nearest along the rail.
  clickedItemId: null as string | null,
  // Device-orientation look offset (mobile). Kept separate from `mouse` so
  // touch drag can stay dedicated to movement instead of double-booking as
  // both "walk" and "look" on the same single-finger gesture.
  gyro: { x: 0, y: 0 },
  gyroEnabled: false,
};

let gyroBase: { beta: number; gamma: number } | null = null;

function onDeviceOrientation(event: DeviceOrientationEvent) {
  if (event.beta == null || event.gamma == null) return;
  if (!gyroBase) {
    // Calibrate against the phone's resting angle at the moment motion
    // controls are enabled, so "look straight ahead" matches however the
    // person is actually holding the phone rather than dead flat/vertical.
    gyroBase = { beta: event.beta, gamma: event.gamma };
  }
  const dBeta = event.beta - gyroBase.beta; // tilt forward/back → look up/down
  const dGamma = event.gamma - gyroBase.gamma; // tilt left/right → look left/right
  inputState.gyro.x = Math.max(-1, Math.min(1, dGamma / 30));
  inputState.gyro.y = Math.max(-1, Math.min(1, -dBeta / 30));
}

/**
 * Requests device-orientation access (required by a user gesture on iOS
 * Safari) and starts feeding phone tilt into look direction. Returns false
 * if the device/browser doesn't support it or the person declines.
 */
export async function enableGyroscope(): Promise<boolean> {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return false;
  const DOE = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  try {
    if (typeof DOE.requestPermission === "function") {
      const result = await DOE.requestPermission();
      if (result !== "granted") return false;
    }
    gyroBase = null;
    window.addEventListener("deviceorientation", onDeviceOrientation);
    inputState.gyroEnabled = true;
    return true;
  } catch {
    return false;
  }
}

export function disableGyroscope() {
  window.removeEventListener("deviceorientation", onDeviceOrientation);
  inputState.gyroEnabled = false;
  inputState.gyro = { x: 0, y: 0 };
  gyroBase = null;
}

export function resetWalkableInput() {
  inputState.scrollDelta = 0;
  inputState.mouse = { x: 0, y: 0 };
  inputState.activate = false;
  inputState.clickedItemId = null;
}

function onWheel(event: WheelEvent) {
  event.preventDefault();
  inputState.scrollDelta += event.deltaY;
}

function onMouseMove(event: MouseEvent) {
  inputState.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  inputState.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
}

function onKeyDown(event: KeyboardEvent) {
  if (event.repeat) return;
  if (event.key === "e" || event.key === "E" || event.key === " ") {
    inputState.activate = true;
  }
}

export function attachWalkableKeyboard() {
  window.addEventListener("keydown", onKeyDown);
}

export function detachWalkableKeyboard() {
  window.removeEventListener("keydown", onKeyDown);
}

export function attachWalkablePointer(target: HTMLElement) {
  void target;
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("mousemove", onMouseMove);
  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("mousemove", onMouseMove);
  };
}

export type WalkableTouchHandlers = {
  onPointerDown: (event: globalThis.PointerEvent) => void;
  onPointerMove: (event: globalThis.PointerEvent) => void;
  onPointerUp: (event: globalThis.PointerEvent) => void;
};

// Touch: a vertical drag glides the camera the same way the wheel does
// (drag up = move forward, matching scroll-down-to-advance convention). A
// slight horizontal drag nudges the parallax look. Tapping to inspect is
// handled by the on-screen prompt button, not by gesture detection here.
export function createWalkableTouch(): WalkableTouchHandlers {
  let dragging = false;
  let lastY = 0;
  let lastX = 0;

  return {
    onPointerDown(event) {
      if (event.pointerType !== "touch") return;
      dragging = true;
      lastY = event.clientY;
      lastX = event.clientX;
    },
    onPointerMove(event) {
      if (event.pointerType !== "touch" || !dragging) return;
      const dy = event.clientY - lastY;
      const dx = event.clientX - lastX;
      // Tuned down from 2.6 — the old multiplier made a small drag move the
      // camera much further than it looked like it should, which is a big
      // part of why movement read as twitchy/"off" on touch.
      inputState.scrollDelta += -dy * 1.8;
      // Horizontal drag only drives look when the gyroscope isn't active —
      // once motion controls are on, tilt owns "look" and drag stays
      // dedicated to movement, so the two gestures stop fighting over the
      // same finger.
      if (!inputState.gyroEnabled) {
        inputState.mouse.x = Math.max(-1, Math.min(1, inputState.mouse.x + dx / 300));
      }
      lastY = event.clientY;
      lastX = event.clientX;
    },
    onPointerUp() {
      dragging = false;
    },
  };
}
