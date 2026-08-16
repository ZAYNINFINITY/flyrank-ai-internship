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
  // Normalized -1..1 mouse position, used for the parallax look-around.
  mouse: { x: 0, y: 0 },
  // E key / tap-the-prompt-button to inspect whatever's nearest.
  activate: false,
};

export function resetWalkableInput() {
  inputState.scrollDelta = 0;
  inputState.mouse = { x: 0, y: 0 };
  inputState.activate = false;
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
      inputState.scrollDelta += -dy * 2.6;
      inputState.mouse.x = Math.max(-1, Math.min(1, inputState.mouse.x + dx / 300));
      lastY = event.clientY;
      lastX = event.clientX;
    },
    onPointerUp() {
      dragging = false;
    },
  };
}
