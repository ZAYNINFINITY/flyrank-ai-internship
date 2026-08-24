"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { InspectInfo, WalkableWorld, WorldDoor } from "@/lib/museum/walkable-model";
import { RAIL_END, RAIL_START } from "@/lib/museum/walkable-model";
import { inputState } from "./walkable-input";

const EYE_HEIGHT = 1.7;

const SCROLL_SPEED = 0.028;
// Bumped from 0.09 — the old smoothing made the camera visibly lag a beat
// behind input, which read as "movement feels off"/floaty. Snappier catch-up
// while still easing, not an instant snap.
const SCROLL_SMOOTHING = 0.14;
const PARALLAX_X = 1.1;
const PARALLAX_Y = 0.55;
const PARALLAX_SMOOTHING = 0.06;
const INTERACT_RANGE = 3.2;
const DOOR_TRIGGER_RANGE = 3.5;

// Door auto-glance, ported from the itom corridor: as you pass a wall-hung
// piece the camera eases toward it (slow to look) and lets go (fast to
// release) so the motion never drags behind you.
const GLANCE_START = 15;
const GLANCE_PEAK = 8;
const GLANCE_END = -2;
const MAX_GLANCE_YAW = 0.15;
const GLANCE_LOOK_SMOOTHING = 0.03;
const GLANCE_RELEASE_SMOOTHING = 0.08;
const MAX_FOCUS_YAW = 1.05;
const MAX_FOCUS_PITCH = 0.28;

export type GlanceTarget = { z: number; dir: 1 | -1 };

export type PlayerProps = {
  world: WalkableWorld;
  openDoors: React.RefObject<Set<string>>;
  spawn: [number, number, number];
  onPrompt: (prompt: string | null) => void;
  onInspect: (info: InspectInfo) => void;
  onDoorOpened: (door: WorldDoor) => void;
  enabled: boolean;
  glanceTargets?: GlanceTarget[];
};

export function WalkablePlayer({
  world,
  openDoors,
  spawn,
  onPrompt,
  onInspect,
  onDoorOpened,
  enabled,
  glanceTargets = [],
}: PlayerProps) {
  const { camera } = useThree();
  const spawnZ = clamp(spawn[2], RAIL_END, RAIL_START);
  const targetZ = useRef(spawnZ);
  const currentZ = useRef(spawnZ);
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);
  const glanceOffset = useRef(0);
  const targetGlance = useRef(0);
  const currentPrompt = useRef<string | null>(null);
  // Click-to-focus: itom-style, looking at a clicked wall item turns the
  // camera to actually face it instead of freezing wherever it happened to
  // be. Set on activate, cleared once `enabled` flips back to true (the
  // dialog closed). focusBlend eases the turn both in and out.
  const focusPos = useRef<[number, number, number] | null>(null);
  const focusBlend = useRef(0);
  const lastFocusYaw = useRef(0);
  const lastFocusPitch = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.2);
    const rate = dt * 60;

    if (enabled) {
      focusPos.current = null;

      const scrollInput = inputState.scrollDelta;
      inputState.scrollDelta = 0;
      targetZ.current = clamp(targetZ.current - scrollInput * SCROLL_SPEED, RAIL_END, RAIL_START);
      currentZ.current = THREE.MathUtils.lerp(
        currentZ.current,
        targetZ.current,
        1 - Math.pow(1 - SCROLL_SMOOTHING, rate)
      );

      const parallaxLerp = 1 - Math.pow(1 - PARALLAX_SMOOTHING, rate);
      // Gyroscope (phone tilt) drives look on mobile once enabled; mouse
      // position drives it on desktop and as the touch-drag fallback
      // otherwise. Never blended together — one or the other owns "look"
      // at any given time, so they don't fight.
      const lookX = inputState.gyroEnabled ? inputState.gyro.x : inputState.mouse.x;
      const lookY = inputState.gyroEnabled ? inputState.gyro.y : inputState.mouse.y;
      parallaxX.current = THREE.MathUtils.lerp(parallaxX.current, lookX * PARALLAX_X, parallaxLerp);
      parallaxY.current = THREE.MathUtils.lerp(parallaxY.current, lookY * PARALLAX_Y, parallaxLerp);

      targetGlance.current = computeGlance(currentZ.current, glanceTargets);
      const releasing = Math.abs(targetGlance.current) < Math.abs(glanceOffset.current);
      const glanceLerp = 1 - Math.pow(1 - (releasing ? GLANCE_RELEASE_SMOOTHING : GLANCE_LOOK_SMOOTHING), rate);
      glanceOffset.current = THREE.MathUtils.lerp(glanceOffset.current, targetGlance.current, glanceLerp);
    } else {
      inputState.scrollDelta = 0;
    }

    camera.position.set(parallaxX.current, EYE_HEIGHT + parallaxY.current, currentZ.current);

    const forwardYaw = parallaxX.current * -0.045 + glanceOffset.current;
    const forwardPitch = parallaxY.current * 0.035;

    const focusLerp = 1 - Math.pow(1 - 0.14, rate);
    focusBlend.current = THREE.MathUtils.lerp(focusBlend.current, focusPos.current ? 1 : 0, focusLerp);

    let yaw = forwardYaw;
    let pitch = forwardPitch;
    if (focusPos.current) {
      const dx = focusPos.current[0] - camera.position.x;
      const dy = focusPos.current[1] - camera.position.y;
      const dz = focusPos.current[2] - camera.position.z;
      // Three.js cameras look down local -Z. Positive yaw turns that
      // direction toward negative X, so the target angles use the inverse
      // signs from the usual screen-space bearing calculation.
      lastFocusYaw.current = THREE.MathUtils.clamp(-Math.atan2(dx, -dz), -MAX_FOCUS_YAW, MAX_FOCUS_YAW);
      lastFocusPitch.current = THREE.MathUtils.clamp(
        Math.atan2(dy, Math.hypot(dx, dz)),
        -MAX_FOCUS_PITCH,
        MAX_FOCUS_PITCH
      );
    }
    if (focusBlend.current > 0.001) {
      // Reuse the last computed focus angle while easing out too, not just
      // while easing in — otherwise the look-back-to-forward motion snaps
      // the instant the dialog closes instead of turning smoothly.
      yaw = THREE.MathUtils.lerp(forwardYaw, lastFocusYaw.current, focusBlend.current);
      pitch = THREE.MathUtils.lerp(forwardPitch, lastFocusPitch.current, focusBlend.current);
    }
    camera.rotation.set(pitch, yaw, 0);

    if (!enabled) return;

    for (const door of world.doors) {
      if (
        !openDoors.current?.has(door.id) &&
        Math.abs(currentZ.current - door.position[2]) < DOOR_TRIGGER_RANGE
      ) {
        openDoors.current?.add(door.id);
        onDoorOpened(door);
      }
    }

    const item = nearestByZ(currentZ.current, world.interactives);

    if (inputState.activate) {
      inputState.activate = false;
      if (item) {
        focusPos.current = item.position;
        onInspect(item.inspect);
      }
    }

    // Direct click/tap on an object (see InteractiveHitboxes in
    // walkable-world.tsx) — inspects exactly what was clicked, regardless
    // of whether it's the "nearest" item along the rail.
    if (inputState.clickedItemId) {
      const clickedId = inputState.clickedItemId;
      inputState.clickedItemId = null;
      const clicked = world.interactives.find((i) => i.id === clickedId);
      if (clicked) {
        focusPos.current = clicked.position;
        onInspect(clicked.inspect);
      }
    }

    setPrompt(onPrompt, currentPrompt, item ? item.prompt : null);
  });

  return null;
}

function nearestByZ<T extends { position: [number, number, number] }>(
  z: number,
  items: T[]
): T | null {
  let best: T | null = null;
  let bestDist = INTERACT_RANGE;
  for (const item of items) {
    const dist = Math.abs(item.position[2] - z);
    if (dist < bestDist) {
      bestDist = dist;
      best = item;
    }
  }
  return best;
}

// Same ramp as the itom glance: strength builds from 15 units out, peaks at 8
// (just before the piece), and drops off 2 units past it.
function computeGlance(z: number, targets: GlanceTarget[]): number {
  let best = 0;
  for (const target of targets) {
    const dist = z - target.z;
    let strength = 0;
    if (dist > GLANCE_PEAK && dist < GLANCE_START) {
      strength = (GLANCE_START - dist) / (GLANCE_START - GLANCE_PEAK);
    } else if (dist <= GLANCE_PEAK && dist > GLANCE_END) {
      strength = (dist - GLANCE_END) / (GLANCE_PEAK - GLANCE_END);
    }
    if (strength > 0) {
      const eased = strength * (2 - strength);
      const candidate = target.dir * eased * MAX_GLANCE_YAW;
      if (Math.abs(candidate) > Math.abs(best)) best = candidate;
    }
  }
  return best;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function setPrompt(
  onPrompt: (prompt: string | null) => void,
  ref: React.MutableRefObject<string | null>,
  value: string | null
) {
  if (ref.current !== value) {
    ref.current = value;
    onPrompt(value);
  }
}
