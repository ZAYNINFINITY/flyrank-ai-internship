"use client";

// Module-level input state shared between DOM event handlers (outside the
// canvas) and the frame loop (inside it). Mutating a module object avoids
// re-rendering the whole scene for every input tick.

export const inputState = {
  move: { x: 0, z: 0 },
  look: { dx: 0, dy: 0 },
  locked: false,
  activate: false,
  sprint: false,
  joystick: { active: false, x: 0, y: 0, originX: 0, originY: 0 },
};

const MOVE_KEYS: Record<string, "forward" | "back" | "left" | "right"> = {
  w: "forward",
  W: "forward",
  arrowup: "forward",
  s: "back",
  S: "back",
  arrowdown: "back",
  a: "left",
  A: "left",
  arrowleft: "left",
  d: "right",
  D: "right",
  arrowright: "right",
};

const pressed = new Set<string>();

export function resetWalkableInput() {
  pressed.clear();
  inputState.move = { x: 0, z: 0 };
  inputState.look = { dx: 0, dy: 0 };
  inputState.locked = false;
  inputState.activate = false;
  inputState.joystick = { active: false, x: 0, y: 0, originX: 0, originY: 0 };
}

function computeMove() {
  let forward = 0;
  let right = 0;
  for (const key of pressed) {
    const dir = MOVE_KEYS[key];
    if (dir === "forward") forward += 1;
    else if (dir === "back") forward -= 1;
    else if (dir === "left") right -= 1;
    else if (dir === "right") right += 1;
  }
  const joystick = inputState.joystick;
  if (joystick.active) {
    const dx = joystick.x / 60;
    const dy = joystick.y / 60;
    right += Math.max(-1, Math.min(1, dx));
    forward += Math.max(-1, Math.min(1, -dy));
  }
  const len = Math.hypot(right, forward);
  if (len > 1) {
    right /= len;
    forward /= len;
  }
  inputState.move.x = right;
  inputState.move.z = forward;
}

export function attachWalkableKeyboard() {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

export function detachWalkableKeyboard() {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
}

function onKeyDown(event: KeyboardEvent) {
  if (event.repeat) return;
  if (event.key === "e" || event.key === "E") {
    inputState.activate = true;
    return;
  }
  if (event.key === "Shift") {
    inputState.sprint = true;
    return;
  }
  const dir = MOVE_KEYS[event.key.toLowerCase()] ?? MOVE_KEYS[event.key];
  if (dir) {
    pressed.add(event.key.toLowerCase());
    computeMove();
    event.preventDefault();
  }
}

function onKeyUp(event: KeyboardEvent) {
  if (event.key === "Shift") {
    inputState.sprint = false;
    return;
  }
  pressed.delete(event.key.toLowerCase());
  computeMove();
}

export function attachWalkablePointer(lockTarget: HTMLElement) {
  const target = lockTarget;
  document.addEventListener("pointerlockchange", onLockChange);
  window.addEventListener("mousemove", onMouseMove);
  target.addEventListener("click", onLockClick);
  return () => {
    document.removeEventListener("pointerlockchange", onLockChange);
    window.removeEventListener("mousemove", onMouseMove);
    target.removeEventListener("click", onLockClick);
  };
}

function onLockChange() {
  inputState.locked = document.pointerLockElement !== null;
}

function onMouseMove(event: MouseEvent) {
  if (inputState.locked) {
    inputState.look.dx += event.movementX;
    inputState.look.dy += event.movementY;
  }
}

function onLockClick() {
  const el = document.pointerLockElement;
  if (el) {
    document.exitPointerLock();
  } else {
    const canvas = document.querySelector("canvas");
    canvas?.requestPointerLock?.();
  }
}

export type WalkableTouchHandlers = {
  onPointerDown: (event: globalThis.PointerEvent) => void;
  onPointerMove: (event: globalThis.PointerEvent) => void;
  onPointerUp: () => void;
  isJoystickActive: () => boolean;
};

export function createWalkableTouch(
  container: () => HTMLElement | null
): WalkableTouchHandlers {
  let lastClientX = 0;
  let lastClientY = 0;
  return {
    onPointerDown(event: globalThis.PointerEvent) {
      if (event.pointerType !== "touch") return;
      const el = container();
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      if (x < rect.width * 0.4) {
        inputState.joystick = {
          active: true,
          x: 0,
          y: 0,
          originX: event.clientX,
          originY: event.clientY,
        };
      }
      lastClientX = event.clientX;
      lastClientY = event.clientY;
    },
    onPointerMove(event: globalThis.PointerEvent) {
      const js = inputState.joystick;
      if (js.active) {
        js.x = event.clientX - js.originX;
        js.y = event.clientY - js.originY;
        computeMove();
      } else if (event.pointerType === "touch") {
        inputState.look.dx += event.clientX - lastClientX;
        inputState.look.dy += event.clientY - lastClientY;
      }
      lastClientX = event.clientX;
      lastClientY = event.clientY;
    },
    onPointerUp() {
      inputState.joystick = { active: false, x: 0, y: 0, originX: 0, originY: 0 };
      computeMove();
    },
    isJoystickActive() {
      return inputState.joystick.active;
    },
  };
}
