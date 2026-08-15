"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler } from "three";
import * as THREE from "three";
import {
  nearestDoor,
  nearestItem,
  resolveCollision,
  type InspectInfo,
  type WalkableWorld,
  type WorldDoor,
} from "@/lib/museum/walkable-model";
import { inputState } from "./walkable-input";

const PLAYER_RADIUS = 0.4;
const EYE_HEIGHT = 1.7;
const WALK_SPEED = 4.4;
const SPRINT_SPEED = 6.6;
const LOOK_SENSITIVITY = 0.0022;
const PITCH_LIMIT = 1.15;

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
  const yaw = useRef(0);
  const pitch = useRef(0);
  const position = useRef(new THREE.Vector3(spawn[0], EYE_HEIGHT, spawn[2]));
  const currentPrompt = useRef<string | null>(null);
  const debugAttached = useRef(false);

  useEffect(() => {
    if (debugAttached.current) return;
    debugAttached.current = true;
    (window as unknown as Record<string, unknown>).__plinth = {
      camera: () => ({
        x: position.current.x,
        y: position.current.y,
        z: position.current.z,
        yaw: yaw.current,
      }),
      doors: () => Array.from(openDoors.current ?? []),
    };
  }, [openDoors]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const dt = Math.min(delta, 0.2);

    if (inputState.locked) {
      yaw.current -= inputState.look.dx * LOOK_SENSITIVITY;
      pitch.current -= inputState.look.dy * LOOK_SENSITIVITY;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    }
    inputState.look.dx = 0;
    inputState.look.dy = 0;

    const euler = new Euler(yaw.current, pitch.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    const move = inputState.move;
    const moving = Math.abs(move.x) > 0.01 || Math.abs(move.z) > 0.01;
    if (moving) {
      const sin = Math.sin(yaw.current);
      const cos = Math.cos(yaw.current);
      const forwardX = sin;
      const forwardZ = -cos;
      const rightX = cos;
      const rightZ = sin;
      let vx = forwardX * move.z + rightX * move.x;
      let vz = forwardZ * move.z + rightZ * move.x;
      const len = Math.hypot(vx, vz) || 1;
      vx /= len;
      vz /= len;
      const speed = inputState.sprint || inputState.joystick.active
        ? SPRINT_SPEED
        : WALK_SPEED;
      const next = resolveCollision(
        position.current.x + vx * speed * dt,
        position.current.z + vz * speed * dt,
        PLAYER_RADIUS,
        solidsForFrame(world, openDoors)
      );
      position.current.x = next.x;
      position.current.z = next.z;
    }

    camera.position.copy(position.current);

    if (inputState.activate) {
      inputState.activate = false;
      const door = nearestDoor(position.current.x, position.current.z, world.doors);
      if (door && !openDoors.current?.has(door.id)) {
        openDoors.current?.add(door.id);
        onDoorOpened(door);
        setPrompt(onPrompt, currentPrompt, null);
        return;
      }
      const item = nearestItem(
        position.current.x,
        position.current.z,
        cameraForwardX(yaw.current),
        cameraForwardZ(yaw.current),
        world.interactives
      );
      if (item) {
        onInspect(item.inspect);
        setPrompt(onPrompt, currentPrompt, null);
        return;
      }
    }

    const door = nearestDoor(position.current.x, position.current.z, world.doors);
    if (door && !openDoors.current?.has(door.id)) {
      setPrompt(onPrompt, currentPrompt, `Open — ${door.toLabel}`);
      return;
    }
    const item = nearestItem(
      position.current.x,
      position.current.z,
      cameraForwardX(yaw.current),
      cameraForwardZ(yaw.current),
      world.interactives
    );
    if (item) {
      setPrompt(onPrompt, currentPrompt, item.prompt);
      return;
    }
    setPrompt(onPrompt, currentPrompt, null);
  });

  return null;
}

function solidsForFrame(world: WalkableWorld, openDoors: React.RefObject<Set<string>>) {
  const closedDoorRects = world.doors
    .filter((door) => !openDoors.current?.has(door.id))
    .map((door) => door.rect);
  return [...world.solids, ...closedDoorRects];
}

function cameraForwardX(yaw: number) {
  return Math.sin(yaw);
}

function cameraForwardZ(yaw: number) {
  return -Math.cos(yaw);
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
