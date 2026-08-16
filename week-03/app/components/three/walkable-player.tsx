"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { InspectInfo, WalkableWorld, WorldDoor } from "@/lib/museum/walkable-model";
import { RAIL_END, RAIL_START } from "@/lib/museum/walkable-model";
import { inputState } from "./walkable-input";

const EYE_HEIGHT = 1.7;

const SCROLL_SPEED = 0.028;
const SCROLL_SMOOTHING = 0.09;
const PARALLAX_X = 1.1;
const PARALLAX_Y = 0.55;
const PARALLAX_SMOOTHING = 0.06;
const INTERACT_RANGE = 3.2;
const DOOR_TRIGGER_RANGE = 3.5;

export type PlayerProps = {
  world: WalkableWorld;
  openDoors: React.RefObject<Set<string>>;
  spawn: [number, number, number];
  onPrompt: (prompt: string | null) => void;
  onInspect: (info: InspectInfo) => void;
  onDoorOpened: (door: WorldDoor) => void;
  enabled: boolean;
};

export function WalkablePlayer({
  world,
  openDoors,
  spawn,
  onPrompt,
  onInspect,
  onDoorOpened,
  enabled,
}: PlayerProps) {
  const { camera } = useThree();
  const spawnZ = clamp(spawn[2], RAIL_END, RAIL_START);
  const targetZ = useRef(spawnZ);
  const currentZ = useRef(spawnZ);
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);
  const currentPrompt = useRef<string | null>(null);

  useFrame((_, delta) => {
    if (!enabled) return;
    const dt = Math.min(delta, 0.2);
    const rate = dt * 60;

    const scrollInput = inputState.scrollDelta;
    inputState.scrollDelta = 0;
    targetZ.current = clamp(targetZ.current - scrollInput * SCROLL_SPEED, RAIL_END, RAIL_START);
    currentZ.current = THREE.MathUtils.lerp(
      currentZ.current,
      targetZ.current,
      1 - Math.pow(1 - SCROLL_SMOOTHING, rate)
    );

    const parallaxLerp = 1 - Math.pow(1 - PARALLAX_SMOOTHING, rate);
    parallaxX.current = THREE.MathUtils.lerp(parallaxX.current, inputState.mouse.x * PARALLAX_X, parallaxLerp);
    parallaxY.current = THREE.MathUtils.lerp(parallaxY.current, inputState.mouse.y * PARALLAX_Y, parallaxLerp);

    camera.position.set(parallaxX.current, EYE_HEIGHT + parallaxY.current, currentZ.current);
    const yaw = parallaxX.current * -0.045;
    const pitch = parallaxY.current * 0.035;
    camera.rotation.set(pitch, yaw, 0);

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
      if (item) onInspect(item.inspect);
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
