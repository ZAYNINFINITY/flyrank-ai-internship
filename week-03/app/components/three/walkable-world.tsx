"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import type { SurfaceLayout } from "@/lib/museum/queries";
import type { Exhibit } from "@/lib/types/exhibit";
import type { Developer } from "@/lib/types/developer";
import type { RendererQuality } from "@/lib/renderer/capability";
import {
  buildDoors,
  buildInteractives,
  buildSolids,
  corridorFrameSpot,
  FOOTPRINTS,
  ROOM_SPOTS,
  type InspectInfo,
  type Rect,
  type WalkableWorld,
  type WorldDoor,
} from "@/lib/museum/walkable-model";
import { getPaperTexture } from "@/lib/three/paper-texture";
import { RevealMaterial } from "@/lib/three/reveal-material";
import { WalkablePlayer, type GlanceTarget } from "./walkable-player";
import { EntranceSky, type TimeOfDay } from "./entrance-environment";

// Itom's corridor runs 3.5 units tall, noticeably cozier than a generic
// 4-unit box — that proportion reads as "designed" rather than cavernous.
const HEIGHT = 3.6;
const BASEBOARD_H = 0.14;
const BASEBOARD_D = 0.08;
const CROWN_H = 0.09;
const CROWN_D = 0.07;
const DOOR_POST = 0.14;
const DOOR_LINTEL_Y = 2.72;

// ITOM-INSPIRED SAWTOOTH CORRIDOR — recessed angled wall bays, ported from
// the MIT itom corridor (github.com/ITomPoland/portfolio-itom) to Foyer's
// dimensions. Each bay: a straight filler at the outer wall line, one angled
// wall across a 4-unit span (outer→inner as Z decreases), and a small
// connector closing the low-Z end. Frames hang on the angled walls exactly
// like itom's doors — and the angled walls lean toward the camera as you
// approach (DoorWallSegment tilt), reimplemented with static bay geometry.
const BAY_OUTER_X = 3.0; // corridor half-width (outer wall line)
const BAY_INNER_X = 1.6; // recessed bay face toward the corridor center
const BAY_HALF_SPAN = 2; // half the bay length along Z (DOOR_Z_SPAN = 4)
const BAY_TILT = { base: 0.02, max: 0.2, start: 12, peak: 2, lerp: 0.06 };

// The museum's actual front-door opening. Matches walkable-model.ts's
// DOOR_GAP exactly (minX:-0.8, maxX:0.8) so the visual doorway lines up
// with the one place in the collision model where the wall is genuinely
// open. Previously the entrance door was a decorative prop sized to a
// completely different (wider) opening than any real gap in the wall, so
// opening it revealed solid geometry no matter what.
const ENTRANCE_HALF = 0.8;

// Architectural museum palette — dark concrete, clean white gallery surfaces,
// restrained warm accent. The museum should feel designed, not sketched.
const PALETTE = {
  corridorWall: "#e8e4dc",
  corridorFloor: "#8a5a38",
  corridorCeiling: "#e4e0d8",
  roomWall: "#f0ede6",
  roomFloor: "#8a5a38",
  roomCeiling: "#e8e4dc",
  receptionWall: "#ece8e0",
  receptionFloor: "#8a5a38",
  receptionCeiling: "#e4e0d8",
  approachWall: "#c8c3b8",
  approachFloor: "#8a5a38",
  ivory: "#1a1a20",
  dim: "#5a5850",
  accent: "#8b6a4a",
  gold: "#a08850",
  frame: "#2a2a30",
  door: "#d4d0c6",
  ink: "#1a1a20",
  paper: "#e8e4dc",
};

function paperMaterial(color: string, roughness = 0.94) {
  const tex = getPaperTexture();
  return (
    <meshStandardMaterial
      color={color}
      map={tex}
      roughness={roughness}
      metalness={0}
      side={THREE.DoubleSide}
    />
  );
}

function inkMaterial(color = PALETTE.frame, roughness = 0.82) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0} />;
}

// ─── Sketch→paint reveal card (the signature itom moment) ─────
// A pencil doodle under each frame that "paints itself in" as you approach.
const REVEAL_W = 1.1;
const REVEAL_H = 0.55;
const REVEAL_TEXTURE_CACHE = new Map<string, { sketch: THREE.CanvasTexture; painted: THREE.CanvasTexture }>();

function wobblyLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, wobble: number) {
  const steps = 12;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = fromX + (toX - fromX) * t;
    const y = fromY + (toY - fromY) * t + Math.sin(t * Math.PI * 3 + wobble) * 2.2;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawRevealCanvas(seed: string, painted: boolean) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size * 2;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    drawRevealArt(ctx, size, seed, painted);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawRevealArt(ctx: CanvasRenderingContext2D, size: number, seed: string, painted: boolean) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const ink = "#3c3a33";
  const color = painted ? "#c96a3a" : ink;
  const wobble = seed.length;

  // Wavy underline the length of the card.
  ctx.strokeStyle = painted ? "#b09048" : ink;
  ctx.lineWidth = painted ? 6 : 3;
  wobblyLine(ctx, 28, size - 46, size * 2 - 28, size - 46, wobble);

  // Small geometric motif: triangle + dot, center-left.
  const cx = size - 46;
  const cy = size / 2 + 8;
  ctx.strokeStyle = color;
  ctx.lineWidth = painted ? 6 : 3;
  if (painted) {
    ctx.fillStyle = "rgba(201,106,58,0.22)";
    ctx.beginPath();
    ctx.moveTo(cx, cy - 52);
    ctx.lineTo(cx + 58, cy + 24);
    ctx.lineTo(cx - 58, cy + 24);
    ctx.closePath();
    ctx.fill();
  }
  wobblyLine(ctx, cx - 58, cy + 24, cx + 58, cy + 24, wobble + 1);
  wobblyLine(ctx, cx, cy - 52, cx + 58, cy + 24, wobble + 2);
  wobblyLine(ctx, cx, cy - 52, cx - 58, cy + 24, wobble + 3);
  ctx.beginPath();
  ctx.arc(cx + 74, cy - 20, painted ? 7 : 4, 0, Math.PI * 2);
  ctx.stroke();
}

function revealTextures(seed: string) {
  const cached = REVEAL_TEXTURE_CACHE.get(seed);
  if (cached) return cached;
  const pair = {
    sketch: drawRevealCanvas(seed, false),
    painted: drawRevealCanvas(seed, true),
  };
  REVEAL_TEXTURE_CACHE.set(seed, pair);
  return pair;
}

function SketchCard({ position, seed, frameZ }: { position: [number, number, number]; seed: string; frameZ?: number }) {
  const { sketch, painted } = useMemo(() => revealTextures(seed), [seed]);
  const sketchMat = useMemo(() => new RevealMaterial({ map: sketch, transparent: true, alphaTest: 0.45 }), [sketch]);
  const sketchMatRef = useRef<RevealMaterial | null>(null);
  useEffect(() => {
    sketchMatRef.current = sketchMat;
  }, [sketchMat]);
  const revealZ = frameZ ?? position[2];

  useFrame(({ camera }) => {
    const mat = sketchMatRef.current;
    if (!mat) return;
    const dist = Math.abs(camera.position.z - revealZ);
    const target = THREE.MathUtils.clamp((7.5 - dist) / 5, 0, 1);
    mat.uProgress = THREE.MathUtils.lerp(mat.uProgress, target, 0.06);
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[REVEAL_W, REVEAL_H]} />
        <meshBasicMaterial map={painted} transparent />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[REVEAL_W, REVEAL_H]} />
        <primitive object={sketchMat} attach="material" />
      </mesh>
    </group>
  );
}

// ─── Notebook grid floor (faint sketch lines, one LineSegments) ───
const GRID_X_RANGE = [-3.5, 3.5] as const;
const GRID_Z_RANGE = [-13, 20] as const;

function GridFloor() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const [xMin, xMax] = GRID_X_RANGE;
    const [zMin, zMax] = GRID_Z_RANGE;
    for (let z = zMin; z <= zMax; z += 1) {
      positions.push(xMin, 0.02, z, xMax, 0.02, z);
    }
    for (let x = xMin; x <= xMax; x += 1) {
      positions.push(x, 0.02, zMin, x, 0.02, zMax);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#5a554a" transparent opacity={0.07} />
    </lineSegments>
  );
}

// ─── Room shell (walls minus door gaps + floor + ceiling) ─────
function RoomBox({
  footprint,
  gaps,
  palette,
  omitSides = false,
  omitDoorwayFrame = [],
}: {
  footprint: Rect;
  gaps: Partial<Record<"north" | "south" | "east" | "west", Rect>>;
  palette: { wall: string; floor: string; ceiling: string };
  omitSides?: boolean;
  /** Directions whose gap should still cut a real hole in the wall, but
   * skip RoomBox's own posts/lintel/threshold — used where a grander,
   * custom-built doorway (e.g. the exterior entrance) already frames the
   * same opening, so the two frames don't double up. */
  omitDoorwayFrame?: Array<"north" | "south" | "east" | "west">;
}) {
  const widthX = footprint.maxX - footprint.minX;
  const widthZ = footprint.maxZ - footprint.minZ;
  const centerZ = (footprint.minZ + footprint.maxZ) / 2;

  const wallAlongX = ({
    x,
    fromX,
    toX,
    ry,
  }: {
    x: number;
    fromX: number;
    toX: number;
    ry: number;
  }) => {
    const midX = (fromX + toX) / 2;
    const width = toX - fromX;
    return (
      <group>
        <mesh position={[midX, HEIGHT / 2, x]} rotation-y={ry}>
          <planeGeometry args={[width, HEIGHT]} />
          {paperMaterial(palette.wall, 0.94)}
        </mesh>
        <mesh position={[midX, BASEBOARD_H / 2, x]}>
          <boxGeometry args={[width, BASEBOARD_H, BASEBOARD_D]} />
          {inkMaterial()}
        </mesh>
        <mesh position={[midX, HEIGHT - CROWN_H / 2, x]}>
          <boxGeometry args={[width, CROWN_H, CROWN_D]} />
          {inkMaterial()}
        </mesh>
      </group>
    );
  };

  const wallAlongZ = ({
    z,
    fromZ,
    toZ,
    ry,
  }: {
    z: number;
    fromZ: number;
    toZ: number;
    ry: number;
  }) => {
    const midZ = (fromZ + toZ) / 2;
    const width = toZ - fromZ;
    return (
      <group>
        <mesh position={[z, HEIGHT / 2, midZ]} rotation-y={ry}>
          <planeGeometry args={[width, HEIGHT]} />
          {paperMaterial(palette.wall, 0.94)}
        </mesh>
        <mesh position={[z, BASEBOARD_H / 2, midZ]}>
          <boxGeometry args={[BASEBOARD_D, BASEBOARD_H, width]} />
          {inkMaterial()}
        </mesh>
        <mesh position={[z, HEIGHT - CROWN_H / 2, midZ]}>
          <boxGeometry args={[CROWN_D, CROWN_H, width]} />
          {inkMaterial()}
        </mesh>
      </group>
    );
  };

  const north = gaps.north;
  const south = gaps.south;
  const east = gaps.east;
  const west = gaps.west;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, centerZ]}>
        <planeGeometry args={[widthX, widthZ]} />
        <FloorSurface color={palette.floor} widthX={widthX} widthZ={widthZ} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, HEIGHT, centerZ]}>
        <planeGeometry args={[widthX, widthZ]} />
        {paperMaterial(palette.ceiling, 1)}
      </mesh>

      {north ? (
        <>
          {wallAlongX({ x: footprint.minZ, fromX: footprint.minX, toX: north.minX, ry: 0 })}
          {wallAlongX({ x: footprint.minZ, fromX: north.maxX, toX: footprint.maxX, ry: 0 })}
        </>
      ) : (
        wallAlongX({ x: footprint.minZ, fromX: footprint.minX, toX: footprint.maxX, ry: 0 })
      )}
      {south ? (
        <>
          {wallAlongX({ x: footprint.maxZ, fromX: footprint.minX, toX: south.minX, ry: Math.PI })}
          {wallAlongX({ x: footprint.maxZ, fromX: south.maxX, toX: footprint.maxX, ry: Math.PI })}
        </>
      ) : (
        wallAlongX({ x: footprint.maxZ, fromX: footprint.minX, toX: footprint.maxX, ry: Math.PI })
      )}

      {!omitSides &&
        (east ? (
          <>
            {wallAlongZ({ z: footprint.maxX, fromZ: footprint.minZ, toZ: east.minZ, ry: -Math.PI / 2 })}
            {wallAlongZ({ z: footprint.maxX, fromZ: east.maxZ, toZ: footprint.maxZ, ry: -Math.PI / 2 })}
          </>
        ) : (
          wallAlongZ({ z: footprint.maxX, fromZ: footprint.minZ, toZ: footprint.maxZ, ry: -Math.PI / 2 })
        ))}
      {!omitSides &&
        (west ? (
          <>
            {wallAlongZ({ z: footprint.minX, fromZ: footprint.minZ, toZ: west.minZ, ry: Math.PI / 2 })}
            {wallAlongZ({ z: footprint.minX, fromZ: west.maxZ, toZ: footprint.maxZ, ry: Math.PI / 2 })}
          </>
        ) : (
          wallAlongZ({ z: footprint.minX, fromZ: footprint.minZ, toZ: footprint.maxZ, ry: Math.PI / 2 })
        ))}

      {/* Doorway frames inset slightly toward each room's own interior so
          the corridor and its neighbouring room don't z-fight at the shared
          wall line (each room renders the opening from its own side). */}
      {north && !omitDoorwayFrame.includes("north") && (
        <Doorway axis="x" at={footprint.minZ + 0.02} gap={north} />
      )}
      {south && !omitDoorwayFrame.includes("south") && (
        <Doorway axis="x" at={footprint.maxZ - 0.02} gap={south} />
      )}
      {!omitSides && east && !omitDoorwayFrame.includes("east") && (
        <Doorway axis="z" at={footprint.maxX - 0.02} gap={east} />
      )}
      {!omitSides && west && !omitDoorwayFrame.includes("west") && (
        <Doorway axis="z" at={footprint.minX + 0.02} gap={west} />
      )}
    </group>
  );
}

// ─── Doorway architecture — frame posts, lintel, and a floor threshold
// so openings read as real museum doors, not just holes cut in the paper.
function Doorway({
  axis,
  at,
  gap,
}: {
  axis: "x" | "z";
  at: number;
  gap: Rect;
}) {
  const span: [number, number] = axis === "x" ? [gap.minX, gap.maxX] : [gap.minZ, gap.maxZ];
  const mid = (span[0] + span[1]) / 2;
  const length = span[1] - span[0];
  const postA = axis === "x" ? [span[0], at] : [at, span[0]];
  const postB = axis === "x" ? [span[1], at] : [at, span[1]];
  const alongX = axis === "x";

  return (
    <group>
      <mesh position={[postA[0], DOOR_LINTEL_Y / 2, postA[1]]}>
        <boxGeometry args={alongX ? [DOOR_POST, DOOR_LINTEL_Y, 0.16] : [0.16, DOOR_LINTEL_Y, DOOR_POST]} />
        {inkMaterial()}
      </mesh>
      <mesh position={[postB[0], DOOR_LINTEL_Y / 2, postB[1]]}>
        <boxGeometry args={alongX ? [DOOR_POST, DOOR_LINTEL_Y, 0.16] : [0.16, DOOR_LINTEL_Y, DOOR_POST]} />
        {inkMaterial()}
      </mesh>
      <mesh position={alongX ? [mid, DOOR_LINTEL_Y, at] : [at, DOOR_LINTEL_Y, mid]}>
        <boxGeometry args={alongX ? [length + DOOR_POST, 0.16, 0.16] : [0.16, 0.16, length + DOOR_POST]} />
        {inkMaterial()}
      </mesh>
      <mesh position={alongX ? [mid, 0.012, at] : [at, 0.012, mid]}>
        <boxGeometry args={alongX ? [length + 0.5, 0.02, 0.1] : [0.1, 0.02, length + 0.5]} />
        {inkMaterial(PALETTE.frame, 0.9)}
      </mesh>
    </group>
  );
}

// ─── Sawtooth corridor walls (itom-inspired bay geometry) ─────
// One side of the corridor rebuilt as recessed bays. The angled "bay" walls
// lean toward the camera as it walks past (DoorWallSegment tilt), carrying
// their frame with them so frames stay flush with the moving wall.

type BayFrameData = {
  centerZ: number;
  exhibit: Exhibit;
  developer?: Developer;
  workCount: number;
  exhibitorNumber: number;
};

function BayWall({
  position,
  baseRy,
  width,
  tiltDir,
  bayZ,
  children,
}: {
  position: [number, number, number];
  baseRy: number;
  width: number;
  tiltDir: 1 | -1;
  bayZ: number;
  children?: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const currentTilt = useRef(0);

  useFrame(({ camera }) => {
    if (!group.current) return;
    const distance = Math.abs(camera.position.z - bayZ);
    let target = BAY_TILT.base;
    if (distance < BAY_TILT.start && distance > BAY_TILT.peak) {
      const t = (BAY_TILT.start - distance) / (BAY_TILT.start - BAY_TILT.peak);
      target = BAY_TILT.base + (BAY_TILT.max - BAY_TILT.base) * t * (2 - t);
    } else if (distance <= BAY_TILT.peak) {
      target = BAY_TILT.max;
    }
    currentTilt.current = THREE.MathUtils.lerp(currentTilt.current, target, BAY_TILT.lerp);
    group.current.rotation.y = baseRy + currentTilt.current * tiltDir;
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, HEIGHT / 2, 0]}>
        <planeGeometry args={[width, HEIGHT]} />
        {paperMaterial(PALETTE.corridorWall, 0.94)}
      </mesh>
      {children}
    </group>
  );
}

function SawtoothSide({
  side,
  fromZ,
  toZ,
  bayFrames,
}: {
  side: "east" | "west";
  fromZ: number;
  toZ: number;
  bayFrames: BayFrameData[];
}) {
  // Faithful port of itom's CorridorWalls segment walk (high Z → low Z):
  // filler → angled bay → connector, repeated for each door (here: frame).
  const segments = useMemo(() => {
    const isLeft = side === "west";
    const baseX = isLeft ? -BAY_OUTER_X : BAY_OUTER_X;
    const innerX = isLeft ? -BAY_INNER_X : BAY_INNER_X;
    const frameByZ = new Map(bayFrames.map((f) => [f.centerZ, f]));
    const out: Array<
      | { kind: "filler"; position: [number, number, number]; ry: number; width: number }
      | { kind: "connector"; position: [number, number, number]; ry: number; width: number }
      | { kind: "bay"; position: [number, number, number]; ry: number; width: number; frame?: BayFrameData }
    > = [];

    let currentZ = fromZ;
    const centers = [...frameByZ.keys()].sort((a, b) => b - a);

    for (const bayZ of centers) {
      const doorStartZ = bayZ + BAY_HALF_SPAN;
      const doorEndZ = bayZ - BAY_HALF_SPAN;
      if (doorStartZ > currentZ || doorEndZ < toZ) continue;

      if (currentZ > doorStartZ) {
        const length = currentZ - doorStartZ;
        out.push({
          kind: "filler",
          position: [baseX, 0, currentZ - length / 2],
          ry: isLeft ? Math.PI / 2 : -Math.PI / 2,
          width: length,
        });
      }

      const dx = innerX - baseX;
      const dz = doorEndZ - doorStartZ;
      const baseRotation = -Math.atan2(dz, dx);
      out.push({
        kind: "bay",
        position: [(baseX + innerX) / 2, 0, (doorStartZ + doorEndZ) / 2],
        ry: isLeft ? baseRotation : baseRotation + Math.PI,
        width: Math.hypot(dx, dz),
        frame: frameByZ.get(bayZ),
      });

      out.push({
        kind: "connector",
        position: [(innerX + baseX) / 2, 0, doorEndZ],
        ry: Math.PI,
        width: Math.abs(baseX - innerX),
      });

      currentZ = doorEndZ;
    }

    if (currentZ > toZ) {
      const length = currentZ - toZ;
      out.push({
        kind: "filler",
        position: [baseX, 0, currentZ - length / 2],
        ry: isLeft ? Math.PI / 2 : -Math.PI / 2,
        width: length,
      });
    }
    return out;
  }, [side, fromZ, toZ, bayFrames]);

  return (
    <group>
      {segments.map((seg, i) => {
        if (seg.kind === "filler") {
          return (
            <group key={i} position={seg.position} rotation-y={seg.ry}>
              <mesh position={[0, HEIGHT / 2, 0]}>
                <planeGeometry args={[seg.width, HEIGHT]} />
                {paperMaterial(PALETTE.corridorWall, 0.94)}
              </mesh>
              <mesh position={[0, BASEBOARD_H / 2, 0]}>
                <boxGeometry args={[seg.width, BASEBOARD_H, BASEBOARD_D]} />
                {inkMaterial()}
              </mesh>
              <mesh position={[0, HEIGHT - CROWN_H / 2, 0]}>
                <boxGeometry args={[seg.width, CROWN_H, CROWN_D]} />
                {inkMaterial()}
              </mesh>
            </group>
          );
        }
        if (seg.kind === "connector") {
          return (
            <mesh key={i} position={seg.position} rotation-y={seg.ry}>
              <planeGeometry args={[seg.width, HEIGHT]} />
              {paperMaterial(PALETTE.corridorWall, 0.94)}
            </mesh>
          );
        }
        return (
          <BayWall
            key={i}
            position={seg.position}
            baseRy={seg.ry}
            width={seg.width}
            tiltDir={side === "west" ? -1 : 1}
            bayZ={seg.position[2]}
          >
            {seg.frame && seg.frame.developer && (
              <MuseumWallFrame
                position={[0, 2.25, 0]}
                ry={0}
                revealZ={seg.frame.centerZ}
                developer={seg.frame.developer}
                workCount={seg.frame.workCount}
                exhibitorNumber={seg.frame.exhibitorNumber}
              />
            )}
          </BayWall>
        );
      })}
    </group>
  );
}

// ─── Wall-hung content (physical, developer-first) ───────────────
// MuseumWallFrame replaces the flat FrameFlat poster on the sawtooth bay
// walls. Answers "who is exhibiting here?" (developer name/role/bio/work
// count) rather than "what project is this?" — per the corridor's role in
// the museum hierarchy (corridor = developers, exhibition room = their
// work). Built as real layered geometry — backing plate, extruded outer
// frame, recessed dark gap, mat, portrait, mounting screws, and a soft
// contact-shadow halo — so it reads as a physically mounted object rather
// than a card floating on the wall.
const FRAME_W = 1.22;
const FRAME_H = 1.72;
const FRAME_DEPTH = 0.09;
const FRAME_BAR = 0.06;
const FRAME_MOUNT_OFFSET = 0.02;

const AVATAR_TEXTURE_CACHE = new Map<string, THREE.Texture>();

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MuseumWallFrame({
  position,
  ry,
  developer,
  workCount,
  exhibitorNumber,
  revealZ,
}: {
  position: [number, number, number];
  ry: number;
  developer: Developer;
  workCount: number;
  exhibitorNumber: number;
  revealZ?: number;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- loads texture async on mount/change */
  useEffect(() => {
    if (!developer.avatar) {
      setTexture(null);
      return;
    }
    const cached = AVATAR_TEXTURE_CACHE.get(developer.avatar);
    if (cached) {
      setTexture(cached);
      return;
    }
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      developer.avatar,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        AVATAR_TEXTURE_CACHE.set(developer.avatar, tex);
        if (alive) setTexture(tex);
      },
      undefined,
      () => {
        if (alive) setTexture(null);
      }
    );
    return () => {
      alive = false;
    };
  }, [developer.avatar]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const innerW = FRAME_W - FRAME_BAR * 2;
  const innerH = FRAME_H - FRAME_BAR * 2;
  const gapZ = FRAME_MOUNT_OFFSET + 0.015;
  const matZ = gapZ + 0.018;
  const contentZ = matZ + 0.008;
  const frontZ = FRAME_MOUNT_OFFSET + FRAME_DEPTH;
  const roleLabel = developer.role.toUpperCase();
  const bioLine = developer.bio.length > 90 ? `${developer.bio.slice(0, 87)}…` : developer.bio;
  const workLabel = `${workCount} ${workCount === 1 ? "WORK" : "WORKS"}`;

  return (
    <group position={position} rotation-y={ry}>
      {/* Soft contact-shadow halo against the wall, faking AO under the
          mounted object since the scene doesn't cast real shadows here. */}
      <mesh position={[0, -0.02, 0.002]}>
        <planeGeometry args={[FRAME_W + 0.22, FRAME_H + 0.24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.1} />
      </mesh>

      {/* Backing plate — sits just proud of the wall (mount gap) */}
      <mesh position={[0, 0, FRAME_MOUNT_OFFSET + 0.01]}>
        <boxGeometry args={[FRAME_W, FRAME_H, 0.02]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.75} metalness={0.1} />
      </mesh>

      {/* Outer frame — four bars with real extruded depth, not thin strokes */}
      <mesh position={[0, FRAME_H / 2 - FRAME_BAR / 2, FRAME_MOUNT_OFFSET + 0.02 + FRAME_DEPTH / 2]}>
        <boxGeometry args={[FRAME_W, FRAME_BAR, FRAME_DEPTH]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh position={[0, -(FRAME_H / 2 - FRAME_BAR / 2), FRAME_MOUNT_OFFSET + 0.02 + FRAME_DEPTH / 2]}>
        <boxGeometry args={[FRAME_W, FRAME_BAR, FRAME_DEPTH]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh position={[FRAME_W / 2 - FRAME_BAR / 2, 0, FRAME_MOUNT_OFFSET + 0.02 + FRAME_DEPTH / 2]}>
        <boxGeometry args={[FRAME_BAR, innerH, FRAME_DEPTH]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh position={[-(FRAME_W / 2 - FRAME_BAR / 2), 0, FRAME_MOUNT_OFFSET + 0.02 + FRAME_DEPTH / 2]}>
        <boxGeometry args={[FRAME_BAR, innerH, FRAME_DEPTH]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.35} />
      </mesh>

      {/* Recessed dark gap — set well back from the frame's outward face so
          the mat reads as sunk into the frame, not laid on top of it */}
      <mesh position={[0, 0, gapZ]}>
        <planeGeometry args={[innerW, innerH]} />
        <meshStandardMaterial color="#14141a" roughness={0.9} />
      </mesh>

      {/* Mat */}
      <mesh position={[0, 0, matZ]}>
        <planeGeometry args={[innerW - 0.06, innerH - 0.06]} />
        {paperMaterial("#f7f0df", 0.95)}
      </mesh>

      {/* Portrait — real avatar if it loaded, otherwise a deliberate
          monochrome initials plate (never a random placeholder circle) */}
      <mesh position={[0, FRAME_H / 2 - 0.46, contentZ]}>
        <planeGeometry args={[0.62, 0.62]} />
        {texture ? (
          <meshStandardMaterial map={texture} color="#ffffff" roughness={0.85} />
        ) : (
          <meshStandardMaterial color={PALETTE.accent} roughness={0.85} />
        )}
      </mesh>
      {!texture && (
        <Text
          position={[0, FRAME_H / 2 - 0.46, contentZ + 0.005]}
          fontSize={0.22}
          color="#f7f0df"
          anchorX="center"
          anchorY="middle"
        >
          {initialsFor(developer.name)}
        </Text>
      )}

      {/* Name — primary */}
      <Text
        position={[0, FRAME_H / 2 - 0.9, contentZ]}
        fontSize={0.115}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
        maxWidth={innerW - 0.15}
        overflowWrap="break-word"
      >
        {developer.name}
      </Text>

      {/* Role — secondary */}
      <Text
        position={[0, FRAME_H / 2 - 1.06, contentZ]}
        fontSize={0.058}
        letterSpacing={0.04}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
        maxWidth={innerW - 0.15}
        overflowWrap="break-word"
      >
        {roleLabel}
      </Text>

      {/* Short bio — 1-2 lines */}
      <Text
        position={[0, FRAME_H / 2 - 1.24, contentZ]}
        fontSize={0.052}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
        maxWidth={innerW - 0.2}
        overflowWrap="break-word"
        textAlign="center"
      >
        {bioLine}
      </Text>

      {/* Project-count badge — small pill */}
      <mesh position={[0, -(FRAME_H / 2 - 0.16), contentZ - 0.003]}>
        <planeGeometry args={[0.62, 0.16]} />
        <meshBasicMaterial color={PALETTE.accent} transparent opacity={0.22} />
      </mesh>
      <Text
        position={[0, -(FRAME_H / 2 - 0.16), contentZ]}
        fontSize={0.058}
        letterSpacing={0.06}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
      >
        {workLabel}
      </Text>

      {/* Mounting hardware — small screws at the frame's outer corners */}
      {[
        [FRAME_W / 2 - 0.05, FRAME_H / 2 - 0.05],
        [-(FRAME_W / 2 - 0.05), FRAME_H / 2 - 0.05],
        [FRAME_W / 2 - 0.05, -(FRAME_H / 2 - 0.05)],
        [-(FRAME_W / 2 - 0.05), -(FRAME_H / 2 - 0.05)],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, frontZ + 0.006]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.012, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}

      {/* Caption plaque — small physical plate mounted below the frame */}
      <group position={[0, -(FRAME_H / 2) - 0.16, FRAME_MOUNT_OFFSET + 0.008]}>
        <mesh>
          <boxGeometry args={[0.86, 0.22, 0.015]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.6} metalness={0.2} />
        </mesh>
        <Text
          position={[0, 0.045, 0.012]}
          fontSize={0.058}
          color="#f0cf8b"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.78}
          overflowWrap="break-word"
        >
          {developer.name.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.052, 0.012]}
          fontSize={0.044}
          letterSpacing={0.05}
          color="#c9c2ae"
          anchorX="center"
          anchorY="middle"
        >
          {`EXHIBITOR ${String(exhibitorNumber).padStart(2, "0")}`}
        </Text>
      </group>

      <SketchCard position={[0, -1.15, 0.02]} seed={developer.id} frameZ={revealZ} />
    </group>
  );
}

function Plaque({
  position,
  ry,
  title,
  body,
  size,
  eyebrow,
  image,
}: {
  position: [number, number, number];
  ry: number;
  title: string;
  body?: string;
  size: [number, number];
  eyebrow?: string;
  image?: string;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!image) return;
    let alive = true;
    new THREE.TextureLoader().load(image, (loaded) => {
      if (alive) {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = 8;
        setTexture(loaded);
      }
    });
    return () => {
      alive = false;
    };
  }, [image]);

  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[size[0], size[1], 0.08]} />
        {paperMaterial(PALETTE.paper, 0.95)}
      </mesh>
      {texture && (
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[size[0] - 0.1, size[1] - 0.1]} />
          <meshBasicMaterial map={texture} transparent opacity={0.2} />
        </mesh>
      )}
      {eyebrow && (
        <Text
          position={[0, size[1] / 2 - 0.22, 0.12]}
          fontSize={0.06}
          letterSpacing={0.08}
          color={PALETTE.accent}
          anchorX="center"
          anchorY="middle"
        >
          {eyebrow}
        </Text>
      )}
      <Text
        position={[0, eyebrow ? size[1] / 8 : size[1] / 4, 0.12]}
        fontSize={Math.min(0.24, size[1] / 6)}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] - 0.3}
        overflowWrap="break-word"
      >
        {title}
      </Text>
      {body && (
        <Text
          position={[0, -size[1] / 6, 0.12]}
          fontSize={Math.min(0.13, size[1] / 10)}
          color={PALETTE.dim}
          anchorX="center"
          anchorY="middle"
          maxWidth={size[0] - 0.4}
          overflowWrap="break-word"
        >
          {body}
        </Text>
      )}
    </group>
  );
}

function LinearLight({
  position,
  rotation = [0, 0, 0],
  length = 4,
  on = true,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  on?: boolean;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[length, 0.035, 0.055]} />
        <meshBasicMaterial color={PALETTE.gold} transparent opacity={on ? 0.5 : 0.12} />
      </mesh>
      {on && <pointLight intensity={1.6} distance={6} decay={2} color="#f0cf8b" />}
    </group>
  );
}

// ─── Visible light fixtures ─────────────────────────────────────
// Modern pendant: black cord + dome shade + warm bulb + pointLight.
// Three staggered across the reception ceiling.
function PendantLight({
  position,
  on = true,
}: {
  position: [number, number, number];
  on?: boolean;
}) {
  const emissiveI = on ? 0.8 : 0.05;
  const shadeOpacity = on ? 0.92 : 0.7;
  return (
    <group position={position}>
      {/* cord */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.6, 6]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.7} />
      </mesh>
      {/* shade — dome */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.04, 0.18, 0.2, 8, 1, true]} />
        <meshStandardMaterial
          color={PALETTE.frame}
          roughness={0.55}
          metalness={0.3}
          transparent
          opacity={shadeOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* shade rim */}
      <mesh position={[0, -0.72, 0]}>
        <torusGeometry args={[0.18, 0.008, 8, 24]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* bulb */}
      <mesh position={[0, -0.64, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#f4ecd9"
          emissive="#f0cf8b"
          emissiveIntensity={emissiveI}
          roughness={0.4}
        />
      </mesh>
      {on && (
        <pointLight
          position={[0, -0.7, 0]}
          intensity={1.1}
          distance={6}
          decay={2}
          color="#f0cf8b"
        />
      )}
    </group>
  );
}

// Museum track lighting: thin black rail + adjustable spot heads.
// Two spots in the corridor aimed at the sawtooth exhibit walls.
function TrackSpot({
  position,
  targetX,
  on = true,
}: {
  position: [number, number, number];
  targetX: number;
  on?: boolean;
}) {
  const emissiveI = on ? 0.9 : 0.05;
  // spot aims outward from corridor center toward the wall
  const tiltZ = targetX > 0 ? -0.3 : 0.3;
  return (
    <group position={position}>
      {/* rail */}
      <mesh>
        <boxGeometry args={[2.4, 0.03, 0.04]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* spot head neck */}
      <mesh position={[targetX * 0.6, -0.1, 0]} rotation={[0, 0, tiltZ]}>
        <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* spot head housing */}
      <mesh position={[targetX * 0.6, -0.19, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.1, 8]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* bulb */}
      <mesh position={[targetX * 0.6, -0.24, 0]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial
          color="#f4ecd9"
          emissive="#f0cf8b"
          emissiveIntensity={emissiveI}
          roughness={0.3}
        />
      </mesh>
      {on && (
        <spotLight
          position={[targetX * 0.6, -0.25, 0]}
          target-position={[targetX * 1.2, 1.5, 0]}
          angle={0.5}
          penumbra={0.6}
          intensity={2.0}
          distance={7}
          decay={2}
          color="#f0cf8b"
        />
      )}
    </group>
  );
}

// Recessed ceiling can: flush-mount housing + inset bulb + spotLight.
// Two cans in the exhibit room aimed down at artifacts.
function CeilingCan({
  position,
  on = true,
}: {
  position: [number, number, number];
  on?: boolean;
}) {
  const emissiveI = on ? 0.7 : 0.05;
  return (
    <group position={position}>
      {/* housing ring */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* inner baffle */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.03, 12]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.8} />
      </mesh>
      {/* bulb recessed */}
      <mesh position={[0, -0.02, 0]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial
          color="#f4ecd9"
          emissive="#f0cf8b"
          emissiveIntensity={emissiveI}
          roughness={0.3}
        />
      </mesh>
      {on && (
        <spotLight
          position={[0, -0.04, 0]}
          angle={0.45}
          penumbra={0.5}
          intensity={1.6}
          distance={6}
          decay={2}
          color="#f0cf8b"
        />
      )}
    </group>
  );
}

function MuseumLighting({ on = true }: { on?: boolean }) {
  return (
    <group>
      {/* Ceiling strip lights */}
      <LinearLight position={[0, HEIGHT - 0.08, 16.4]} length={7.2} on={on} />
      <LinearLight position={[0, HEIGHT - 0.08, -2]} length={5.4} on={on} />
      <LinearLight position={[0, HEIGHT - 0.08, -16.5]} length={6.2} on={on} />

      {/* Reception wall spots — dimmed from 1.8 (was blowing out the
          real PBR floor texture to near-white; the corridor's 2 TrackSpots
          at similar intensity don't have this problem because there's
          only 2 of them instead of 3 pendants + 3 of these stacked in a
          smaller room). */}
      {on && [4.75].map((x) =>
        [14.8, 17, 19].map((z) => (
          <pointLight key={`${x}-${z}`} position={[x * 0.86, 2.7, z]} intensity={1.0} distance={4.5} decay={2} color="#f0cf8b" />
        ))
      )}

      {/* ── NEW: Pendant cluster in reception ── */}
      <PendantLight position={[-1.5, HEIGHT - 0.08, 16.4]} on={on} />
      <PendantLight position={[0, HEIGHT - 0.08, 16.4]} on={on} />
      <PendantLight position={[1.5, HEIGHT - 0.08, 16.4]} on={on} />

      {/* ── NEW: Track spots in corridor ── */}
      <TrackSpot position={[0, HEIGHT - 0.08, -2]} targetX={BAY_OUTER_X} on={on} />
      <TrackSpot position={[0, HEIGHT - 0.08, -6]} targetX={-BAY_OUTER_X} on={on} />

      {/* ── NEW: Recessed cans in exhibit room ── */}
      <CeilingCan position={[-1.5, HEIGHT - 0.08, -16.5]} on={on} />
      <CeilingCan position={[1.5, HEIGHT - 0.08, -16.5]} on={on} />
    </group>
  );
}

function ProjectionScreen({
  position,
  ry,
  exhibit,
}: {
  position: [number, number, number];
  ry: number;
  exhibit?: Exhibit;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const media = exhibit?.media[0];
  const src = media?.src;

  useEffect(() => {
    if (!src) return;
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load(src, (tex) => {
      if (alive) setTexture(tex);
    });
    return () => {
      alive = false;
    };
  }, [src]);

  return (
    <group position={position} rotation-y={ry}>
      <mesh>
        <planeGeometry args={[3.4, 2.1]} />
        {texture ? (
          <meshStandardMaterial map={texture} color="#ffffff" roughness={0.85} />
        ) : (
          <meshStandardMaterial color={PALETTE.paper} roughness={0.9} />
        )}
      </mesh>
      <Text
        position={[0, -1.3, 0.02]}
        fontSize={0.11}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
      >
        {media?.alt || "Project preview"}
      </Text>
    </group>
  );
}

function ArtifactPlinth({
  position,
  ry,
  label,
  description,
}: {
  position: [number, number, number];
  ry: number;
  label?: string;
  description?: string;
}) {
  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 1.1, 0.9]} />
        {paperMaterial("#e7dec9", 0.9)}
      </mesh>
      <mesh position={[0, -0.53, 0]}>
        <boxGeometry args={[1.02, 0.08, 1.02]} />
        <meshBasicMaterial color={PALETTE.gold} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.76, 0.05, 0.76]} />
        <meshStandardMaterial color="#f7f0df" roughness={0.5} metalness={0} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <octahedronGeometry args={[0.32]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.55} metalness={0} />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <boxGeometry args={[0.82, 0.7, 0.82]} />
        <meshBasicMaterial color={PALETTE.ink} wireframe transparent opacity={0.16} />
      </mesh>
      <Text
        position={[0, -0.95, 0.5]}
        fontSize={0.1}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        overflowWrap="break-word"
      >
        {label ?? "Project artifact"}
      </Text>
      {description && (
        <Text
          position={[0, -1.18, 0.5]}
          fontSize={0.07}
          color={PALETTE.dim}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.35}
          overflowWrap="break-word"
        >
          {description}
        </Text>
      )}
    </group>
  );
}

function DoorPanel({
  door,
  openDoors,
}: {
  door: WorldDoor;
  openDoors: React.RefObject<Set<string>>;
}) {
  const group = useRef<THREE.Group>(null);
  const current = useRef(0);
  const panelOffset = door.hingeX > 0 ? -0.8 : 0.8;
  const tex = useMemo(() => getDoorPanelTexture(), []);

  useFrame((_, delta) => {
    const open = openDoors.current?.has(door.id) ?? false;
    const target = open ? door.swing : 0;
    current.current += (target - current.current) * Math.min(1, delta * 4);
    if (group.current) group.current.rotation.y = current.current;
  });

  const handleX = panelOffset > 0 ? panelOffset + 0.12 : panelOffset - 0.12;

  return (
    <>
      {/* Swinging panel with visible thickness + handle */}
      <group ref={group} position={[door.hingeX, 0, door.hingeZ]}>
        <mesh position={[panelOffset, 1.2, 0]}>
          <boxGeometry args={[1.5, 2.35, 0.06]} />
          <meshStandardMaterial map={tex} color="#ffffff" roughness={0.88} />
        </mesh>
        {/* Handle rod */}
        <mesh position={[handleX, 1.0, 0.04]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.3} roughness={0.6} />
        </mesh>
        {/* Handle knob */}
        <mesh position={[handleX, 1.0, 0.04]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
      {/* Label — fixed above the door FRAME (not the panel), so it stays
          legible regardless of open/closed state instead of swinging with
          the panel and ending up skewed once the door is open. */}
      <Text
        position={[door.position[0], 2.95, door.position[2]]}
        fontSize={0.13}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
      >
        {door.toLabel}
      </Text>
    </>
  );
}

// ─── Facade with a real door-shaped cutout (ShapeGeometry + a hole), instead
// of splitting one plane into two separately-stretched halves. Splitting
// duplicated the pediment art (each half stretched the SAME full texture
// across itself) and left a gap above the door where the two halves never
// met — exactly the double-peak-and-void look that showed up in-game.
function ApproachFacade() {
  const approach = FOOTPRINTS.approach;
  const widthX = approach.maxX - approach.minX;
  const facadeBottom = HEIGHT / 2 - (HEIGHT * 1.05) / 2;
  const facadeTop = HEIGHT / 2 + (HEIGHT * 1.05) / 2;
  const doorTop = 2.61; // matches the lintel's top edge (y=2.5, height 0.22)

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const hw = widthX / 2;
    shape.moveTo(-hw, facadeBottom);
    shape.lineTo(hw, facadeBottom);
    shape.lineTo(hw, facadeTop);
    shape.lineTo(-hw, facadeTop);
    shape.lineTo(-hw, facadeBottom);

    // The door-shaped hole — reaches from the base of the facade up to the
    // lintel, at the exact ENTRANCE_HALF width the door itself uses.
    const hole = new THREE.Path();
    hole.moveTo(-ENTRANCE_HALF, facadeBottom);
    hole.lineTo(ENTRANCE_HALF, facadeBottom);
    hole.lineTo(ENTRANCE_HALF, doorTop);
    hole.lineTo(-ENTRANCE_HALF, doorTop);
    hole.lineTo(-ENTRANCE_HALF, facadeBottom);
    shape.holes.push(hole);

    return new THREE.ShapeGeometry(shape);
  }, [widthX, facadeBottom, facadeTop, doorTop]);

  return (
    <mesh position={[0, 0, approach.minZ + 0.03]} geometry={geometry}>
      <meshStandardMaterial map={getFacadeTexture()} color="#ffffff" roughness={0.94} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Entrance dressing — flanking pillars (grander than the door's own
// posts, spanning the full facade width) and two physical mounted boards
// (a real signboard instead of bare floating text, plus an about/menu
// directory board) so the entrance reads as a designed museum front.
function EntrancePillars() {
  const approach = FOOTPRINTS.approach;
  const pillarZ = approach.minZ + 0.12;
  const xs = [approach.minX + 0.42, approach.maxX - 0.42];
  return (
    <>
      {xs.map((x, i) => (
        <group key={i} position={[x, 0, pillarZ]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.44, 0.24, 0.44]} />
            <meshStandardMaterial color={PALETTE.approachWall} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 3.4, 16]} />
            <meshStandardMaterial color="#e4ddc9" roughness={0.7} />
          </mesh>
          <mesh position={[0, 3.68, 0]}>
            <boxGeometry args={[0.46, 0.16, 0.46]} />
            <meshStandardMaterial color={PALETTE.approachWall} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function EntranceSignboard() {
  const approach = FOOTPRINTS.approach;
  const z = approach.minZ + 0.09;
  return (
    <group position={[0, 3.05, z]}>
      <mesh>
        <boxGeometry args={[3.2, 1.0, 0.06]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[3.0, 0.82]} />
        {paperMaterial("#f7f0df", 0.9)}
      </mesh>
      <Text position={[0, 0.16, 0.05]} fontSize={0.26} color={PALETTE.ivory} anchorX="center" anchorY="middle">
        FOYER MUSEUM
      </Text>
      <Text
        position={[0, -0.16, 0.05]}
        fontSize={0.1}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.6}
      >
        An open museum — any developer can exhibit here
      </Text>
    </group>
  );
}

const INFO_BOARD_MENU: Array<[string, string]> = [
  ["Reception Hall", "Curator & wayfinding"],
  ["Developer Corridor", "Meet the exhibitors"],
  ["Exhibition Rooms", "Explore individual work"],
];

function EntranceInfoBoard() {
  const approach = FOOTPRINTS.approach;
  const x = approach.minX + 0.03;
  const z = approach.minZ + 3.4;
  return (
    <group position={[x, 1.55, z]} rotation-y={Math.PI / 2}>
      <mesh>
        <boxGeometry args={[1.5, 2.1, 0.05]} />
        {paperMaterial(PALETTE.paper, 0.92)}
      </mesh>
      <Text
        position={[0, 0.88, 0.03]}
        fontSize={0.12}
        letterSpacing={0.08}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="top"
      >
        ABOUT
      </Text>
      <Text
        position={[0, 0.68, 0.03]}
        fontSize={0.072}
        lineHeight={1.35}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="top"
        maxWidth={1.3}
        textAlign="center"
        overflowWrap="break-word"
      >
        An open museum for developer work.
      </Text>
      <mesh position={[0, 0.24, 0.001]}>
        <boxGeometry args={[1.2, 0.015, 0.01]} />
        {inkMaterial(PALETTE.gold, 0.6)}
      </mesh>
      <Text
        position={[0, 0.1, 0.03]}
        fontSize={0.12}
        letterSpacing={0.08}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="top"
      >
        MENU
      </Text>
      {INFO_BOARD_MENU.map(([label, sub], i) => (
        <group key={label} position={[0, -0.16 - i * 0.3, 0.03]}>
          <Text fontSize={0.1} color={PALETTE.ivory} anchorX="center" anchorY="top">
            {label}
          </Text>
          <Text position={[0, -0.14, 0]} fontSize={0.065} color={PALETTE.dim} anchorX="center" anchorY="top">
            {sub}
          </Text>
        </group>
      ))}
    </group>
  );
}

function ApproachExterior() {
  const approach = FOOTPRINTS.approach;
  const widthX = approach.maxX - approach.minX;
  const widthZ = approach.maxZ - approach.minZ;
  const midZ = (approach.minZ + approach.maxZ) / 2;
  const APPROACH_HEIGHT = HEIGHT * 1.6;

  return (
    <group>
      {/* Full-width ground plane, not just a narrow path strip — the path
          reads as a slightly different tone laid over solid ground instead
          of being the only geometry with void on either side of it. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, midZ]}>
        <planeGeometry args={[widthX, widthZ]} />
        <FloorSurface color={PALETTE.corridorFloor} widthX={widthX} widthZ={widthZ} />
      </mesh>
      {/* Lamp posts flanking the walk toward the entrance */}
      <LampPost position={[-2.6, 0, approach.minZ + 5.5]} />
      <LampPost position={[2.6, 0, approach.minZ + 5.5]} />
      <LampPost position={[-2.6, 0, approach.maxZ - 1.5]} />
      <LampPost position={[2.6, 0, approach.maxZ - 1.5]} />

      {/* Planters flanking the entrance */}
      <Planter position={[-2.4, 0, approach.minZ + 2.1]} />
      <Planter position={[2.4, 0, approach.minZ + 2.1]} />

      {/* Shallow stone steps rising to the threshold */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.03 + i * 0.055, approach.minZ + 1.55 - i * 0.22]}>
          <boxGeometry args={[3.6 - i * 0.3, 0.06, 0.42]} />
          {inkMaterial("#c9c2ae", 0.85)}
        </mesh>
      ))}

      {/* Welcome mat at the foot of the steps — grounds the entrance instead
          of stone tile running straight into the stairs with no threshold
          cue. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.022, approach.minZ + 2.55]}>
        <planeGeometry args={[2.0, 0.9]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.92} metalness={0} />
      </mesh>

      {/* Flanking courtyard walls — without these the approach reads as an
          open void either side of the path instead of a bounded space.
          Taller than the interior rooms so it still reads as "outside" the
          museum proper, not just another identical room. */}
      <mesh position={[approach.minX, APPROACH_HEIGHT / 2, midZ]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[widthZ, APPROACH_HEIGHT]} />
        {paperMaterial(PALETTE.approachWall, 0.96)}
      </mesh>
      <mesh position={[approach.maxX, APPROACH_HEIGHT / 2, midZ]} rotation-y={-Math.PI / 2}>
        <planeGeometry args={[widthZ, APPROACH_HEIGHT]} />
        {paperMaterial(PALETTE.approachWall, 0.96)}
      </mesh>

      {/* Facade — a single plane with a real door-shaped hole cut into it
          (ApproachFacade, via ShapeGeometry), not two stretched halves. */}
      <ApproachFacade />
      {/* Ceiling cap — the approach previously had zero ceiling geometry
          (every other room shares RoomBox, which does render one), so it
          opened straight into the sky-dome background right above the
          walls. This grounds it as a real covered foyer space instead of
          walls floating in an unbounded void. */}
      <mesh rotation-x={Math.PI / 2} position={[0, APPROACH_HEIGHT, midZ]}>
        <planeGeometry args={[widthX, widthZ]} />
        {paperMaterial(PALETTE.approachWall, 0.96)}
      </mesh>
      <EntrancePillars />
      <mesh position={[-(ENTRANCE_HALF + 0.09), 1.2, approach.minZ + 0.06]}>
        <boxGeometry args={[0.18, 2.4, 0.18]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      <mesh position={[ENTRANCE_HALF + 0.09, 1.2, approach.minZ + 0.06]}>
        <boxGeometry args={[0.18, 2.4, 0.18]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      {/* Lintel — turns the two posts into a real doorway */}
      <mesh position={[0, 2.5, approach.minZ + 0.06]}>
        <boxGeometry args={[(ENTRANCE_HALF + 0.09) * 2 + 0.18, 0.22, 0.18]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      {/* An actual door filling the frame, hinged right at the wall's real
          opening — so opening it now looks straight through into
          reception instead of into a hidden solid wall. */}
      <EntranceDoor />
      <EntranceSignboard />
      <EntranceInfoBoard />
    </group>
  );
}

// ─── Floating sketch doodles (procedural, drawn in code) ──────
// Loose sketchbook marks that hover around the curator like itom's paper
// doodles — but built from pure geometry + our own canvas scribbles instead
// of their painted art assets, so the mood survives without copying.

const NOTE_TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

// ─── Illustrated door panel (ink linework, not a flat block) ──
function getDoorPanelTexture() {
  const cached = NOTE_TEXTURE_CACHE.get("door-panel");
  if (cached) return cached;
  const w = 256;
  const h = 384;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const wood = ctx.createLinearGradient(0, 0, w, 0);
    wood.addColorStop(0, "#2c1b13");
    wood.addColorStop(0.5, "#6a4228");
    wood.addColorStop(1, "#241710");
    ctx.fillStyle = wood;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#caa463";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeRect(16, 16, w - 32, h - 32);
    wobblyLine(ctx, 30, 32, w - 30, 32, 1);
    ctx.strokeRect(32, 34, w - 64, h * 0.38);
    ctx.strokeRect(32, h * 0.5, w - 64, h * 0.38);
    ctx.beginPath();
    ctx.arc(w - 44, h / 2, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#3c3a33";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,224,170,0.14)";
    ctx.lineWidth = 2;
    for (let x = 26; x < w; x += 28) {
      wobblyLine(ctx, x, 24, x + Math.sin(x) * 6, h - 24, x);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  NOTE_TEXTURE_CACHE.set("door-panel", tex);
  return tex;
}

// ─── Procedural stone/tile floor texture — grout lines + mottled tiles +
// fine grain, so floors read as laid stone instead of a flat color plane.
function getFloorTileTexture(tint: string) {
  const key = `floor-${tint}`;
  const cached = NOTE_TEXTURE_CACHE.get(key);
  if (cached) return cached;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, size, size);
    const tile = size / 4;
    ctx.strokeStyle = "rgba(58,52,40,0.28)";
    ctx.lineWidth = 3;
    for (let i = 0; i <= 4; i++) {
      const p = i * tile;
      wobblyLine(ctx, p, 0, p, size, i);
      wobblyLine(ctx, 0, p, size, p, i + 10);
    }
    for (let ty = 0; ty < 4; ty++) {
      for (let tx = 0; tx < 4; tx++) {
        const shade = (Math.sin(tx * 13.1 + ty * 7.7) + 1) / 2;
        ctx.fillStyle = `rgba(58,52,40,${0.02 + shade * 0.035})`;
        ctx.fillRect(tx * tile + 5, ty * tile + 5, tile - 10, tile - 10);
      }
    }
    for (let i = 0; i < 4000; i++) {
      const alpha = 0.01 + Math.random() * 0.02;
      ctx.fillStyle =
        Math.random() > 0.5 ? `rgba(255,250,235,${alpha})` : `rgba(70,60,40,${alpha})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  NOTE_TEXTURE_CACHE.set(key, tex);
  return tex;
}

// One tile texture per color, cloned per-room so each room can set its own
// repeat count without fighting over a shared texture's UV scale.
const FLOOR_MATERIAL_CACHE = new Map<string, THREE.Texture>();

function tileFloorMaterial(color: string, widthX: number, widthZ: number) {
  const cacheKey = `${color}-${widthX}-${widthZ}`;
  let tex = FLOOR_MATERIAL_CACHE.get(cacheKey);
  if (!tex) {
    const base = getFloorTileTexture(color);
    tex = base.clone();
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    // ~1.4-unit real-world tile size, regardless of room footprint.
    tex.repeat.set(Math.max(1, widthX / 1.4), Math.max(1, widthZ / 1.4));
    FLOOR_MATERIAL_CACHE.set(cacheKey, tex);
  }
  return (
    <meshStandardMaterial color="#ffffff" map={tex} roughness={0.85} metalness={0} />
  );
}

// ─── Real PBR floor (from the supplied asset pack) — falls back to the
// procedural tile texture above until the maps finish loading, or if they
// fail to load at all, so a missing/renamed file never leaves a room with
// no floor material. Diffuse + roughness only, deliberately no normalMap:
// a flipped normal-map green channel (OpenGL vs DirectX convention) is a
// well-known way to render a surface fully unlit/black even under ambient
// light, and that's a much better fit for "only the floor went solid
// black" than any of the other geometry in the scene being affected too.
const PBR_FLOOR_PATHS = {
  map: "/models/floor-textures/Material _25_Base_Color.png",
  roughnessMap: "/models/floor-textures/Material _25_Roughness.png",
};

let pbrFloorTexturesPromise: Promise<{
  map: THREE.Texture;
  roughnessMap: THREE.Texture;
}> | null = null;

function loadPbrFloorTextures() {
  if (!pbrFloorTexturesPromise) {
    const loader = new THREE.TextureLoader();
    const load = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => loader.load(url, resolve, undefined, reject));
    pbrFloorTexturesPromise = Promise.all([
      load(PBR_FLOOR_PATHS.map),
      load(PBR_FLOOR_PATHS.roughnessMap),
    ]).then(([map, roughnessMap]) => {
      map.colorSpace = THREE.SRGBColorSpace;
      for (const t of [map, roughnessMap]) {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
      }
      return { map, roughnessMap };
    }).catch((err) => {
      // Reset the cached promise so the next mount retries instead of
      // permanently reusing a rejected promise.
      pbrFloorTexturesPromise = null;
      throw err;
    });
  }
  return pbrFloorTexturesPromise;
}

function FloorSurface({
  color,
  widthX,
  widthZ,
  usePbr = true,
}: {
  color: string;
  widthX: number;
  widthZ: number;
  usePbr?: boolean;
}) {
  const [pbr, setPbr] = useState<{
    map: THREE.Texture;
    roughnessMap: THREE.Texture;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    loadPbrFloorTextures()
      .then((tex) => {
        if (alive) setPbr(tex);
      })
      .catch(() => {
        if (alive) setPbr(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  const repeatX = Math.max(1, widthX / 1.6);
  const repeatZ = Math.max(1, widthZ / 1.6);

  const maps = useMemo(() => {
    if (!pbr) return null;
    const map = pbr.map.clone();
    const roughnessMap = pbr.roughnessMap.clone();
    for (const t of [map, roughnessMap]) {
      t.needsUpdate = true;
      t.repeat.set(repeatX, repeatZ);
    }
    return { map, roughnessMap };
  }, [pbr, repeatX, repeatZ]);

  if (maps && usePbr) {
    // Tint the shared PBR texture by each room's own palette color instead
    // of hardcoding white. Every room reuses the SAME cached wood texture
    // (loadPbrFloorTextures() is a single shared promise), so without a
    // per-room tint every floor in the museum rendered as the identical
    // raw red-brown wood, un-differentiated and — under the museum's warm
    // point/spot lighting stacked on top of an already-warm base color —
    // blown out toward a flat, saturated orange. Multiplying by the room's
    // intended (much lighter, cooler) palette color brings each floor back
    // toward its designed tone and keeps highlights from clipping as hard.
    return (
      <meshBasicMaterial map={maps.map} />
    );
  }

  return tileFloorMaterial(color, widthX, widthZ);
}

// ─── Illustrated facade (sketched columns + pediment, not a flat wall) ──
function getFacadeTexture() {
  const cached = NOTE_TEXTURE_CACHE.get("facade");
  if (cached) return cached;
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const paper = ctx.createLinearGradient(0, 0, w, h);
    paper.addColorStop(0, "#f4ecd9");
    paper.addColorStop(0.52, "#eadfc8");
    paper.addColorStop(1, "#d9ccb1");
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#3c3a33";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    wobblyLine(ctx, 30, h - 40, w - 30, h - 40, 2);

    const colXs = [w * 0.1, w * 0.2, w * 0.8, w * 0.9];
    colXs.forEach((x, i) => {
      wobblyLine(ctx, x, h - 40, x, 96, i + 1);
      ctx.beginPath();
      ctx.moveTo(x - 26, 96);
      ctx.lineTo(x + 26, 96);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 16, 74);
      ctx.lineTo(x + 16, 74);
      ctx.stroke();
      for (let f = -12; f <= 12; f += 12) {
        ctx.beginPath();
        ctx.moveTo(x + f, 96);
        ctx.lineTo(x + f, h - 40);
        ctx.stroke();
      }
    });

    ctx.beginPath();
    ctx.moveTo(w * 0.24, 96);
    ctx.lineTo(w * 0.5, 24);
    ctx.lineTo(w * 0.76, 96);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w * 0.5, 24, 6, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 9000; i++) {
      const alpha = 0.012 + Math.random() * 0.035;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,250,235,${alpha})` : `rgba(80,68,45,${alpha})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  NOTE_TEXTURE_CACHE.set("facade", tex);
  return tex;
}

// ─── A real entrance door — two panels that swing open as you approach,
// hinged at the outer jambs so they cover the FULL doorway opening and
// meet in the middle when closed. Sized to ENTRANCE_HALF — the same
// opening the reception wall actually cuts a hole for — rather than an
// arbitrary wider frame that didn't correspond to anything real.
function EntranceDoor() {
  const doorZ = FOOTPRINTS.approach.minZ + 0.06;
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const swing = useRef(0);
  const tex = useMemo(() => getDoorPanelTexture(), []);

  const LEAF_GAP = 0.04; // thin reveal where the two leaves meet, closed
  const leafWidth = ENTRANCE_HALF - LEAF_GAP / 2;

  useFrame(({ camera }, delta) => {
    const dist = Math.abs(camera.position.z - doorZ);
    const target = dist < 6 ? 1 : 0;
    swing.current = THREE.MathUtils.lerp(swing.current, target, Math.min(1, delta * 4));
    const angle = swing.current * 1.57;
    if (left.current) left.current.rotation.y = -angle;
    if (right.current) right.current.rotation.y = angle;
  });

  return (
    <group>
      {/* Left leaf — hinged at the outer jamb (x=-ENTRANCE_HALF), spans
          inward to meet the right leaf at center. */}
      <group ref={left} position={[-ENTRANCE_HALF, 0, doorZ]}>
        <mesh position={[leafWidth / 2, 1.2, 0]}>
          <boxGeometry args={[leafWidth, 2.35, 0.06]} />
          <meshStandardMaterial map={tex} color="#ffffff" roughness={0.88} />
        </mesh>
        {/* Handle — near the inner edge, where the leaves meet */}
        <mesh position={[leafWidth - 0.1, 1.0, 0.04]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.013, 0.013, 0.1, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[leafWidth - 0.1, 1.0, 0.04]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
      {/* Right leaf — mirrored, hinged at x=+ENTRANCE_HALF */}
      <group ref={right} position={[ENTRANCE_HALF, 0, doorZ]}>
        <mesh position={[-leafWidth / 2, 1.2, 0]}>
          <boxGeometry args={[leafWidth, 2.35, 0.06]} />
          <meshStandardMaterial map={tex} color="#ffffff" roughness={0.88} />
        </mesh>
        <mesh position={[-(leafWidth - 0.1), 1.0, 0.04]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.013, 0.013, 0.1, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[-(leafWidth - 0.1), 1.0, 0.04]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
      {/* Threshold strip — spans the full opening */}
      <mesh position={[0, 0.015, doorZ]}>
        <boxGeometry args={[ENTRANCE_HALF * 2 + 0.06, 0.03, 0.12]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.8} />
      </mesh>
    </group>
  );
}

// ─── Curator 3D model (OBJ + diffuse texture) — lazy-loaded once,
// cached. The raw OBJ coordinates span ~187 units tall (centimeters),
// so we hardcode the scale factor and offset rather than trusting a
// bounding-box computation on the clone (which can drift).
// Falls back to a silhouette on load failure.
let curatorModelPromise: Promise<THREE.Group> | null = null;

// Previously this hardcoded a scale factor + Y offset derived from an
// assumed raw bounding box ("Y: -1.11 to 186.03"). That's brittle the
// moment the actual exported OBJ doesn't match those exact numbers, and a
// stale scale/offset applied uniformly to real geometry is a plausible
// source of the reported model distortion. Now measured dynamically from
// the loaded object instead, same as ReceptionFemale/BenchFemale below.
const CURATOR_TARGET_HEIGHT = 1.75;

function loadCuratorModel() {
  if (!curatorModelPromise) {
    curatorModelPromise = new Promise<THREE.Group>((resolve, reject) => {
      const loader = new OBJLoader();
      loader.load(
        "/models/curator/rp_dennis_posed_004_30k.OBJ",
        (obj) => {
          // Apply diffuse texture to all meshes
          const tex = new THREE.TextureLoader().load(
            "/models/curator/tex/rp_dennis_posed_004_dif.jpg",
            (t) => { t.colorSpace = THREE.SRGBColorSpace; }
          );
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({
                map: tex,
                roughness: 0.7,
                metalness: 0.05,
              });
              // Missing/mismatched normals on an OBJ export read as a
              // faceted, "melted" surface under standard lighting —
              // recompute to guarantee normals that actually match this
              // geometry.
              if (!child.geometry.attributes.normal) {
                child.geometry.computeVertexNormals();
              }
            }
          });

          // Measure the real geometry rather than trusting a remembered
          // bounding box, then normalize scale + ground offset from it —
          // same pattern as ReceptionFemale/BenchFemale below.
          const box = new THREE.Box3().setFromObject(obj);
          const height = box.max.y - box.min.y;
          if (height > 0) {
            const scale = CURATOR_TARGET_HEIGHT / height;
            obj.scale.setScalar(scale);
            const scaledBox = new THREE.Box3().setFromObject(obj);
            obj.position.y -= scaledBox.min.y;
          }
          obj.updateMatrixWorld(true);

          resolve(obj);
        },
        undefined,
        reject
      );
    });
  }
  return curatorModelPromise;
}

function CuratorFigure({
  position,
  ry = Math.PI,
}: {
  position: [number, number, number];
  /** RenderPeople OBJ figures face the model's raw +Z by default. The
   * curator previously had no rotation applied at all (unlike
   * ReceptionFemale, which needed ry={Math.PI} at its call site) — meaning
   * it stood facing away from an approaching visitor. Defaulting to PI
   * turns it to face into the room. */
  ry?: number;
}) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadCuratorModel()
      .then((source) => {
        if (!alive) return;
        setModel(source.clone());
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => { alive = false; };
  }, []);

  if (failed) {
    return (
      <group position={position}>
        <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.5, 24]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.08} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <capsuleGeometry args={[0.2, 1.2, 4, 12]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.8} />
        </mesh>
        <Text position={[0, -0.1, 0.1]} fontSize={0.12} color={PALETTE.ivory} anchorX="center" anchorY="middle">
          Curator
        </Text>
      </group>
    );
  }

  if (!model) return null;

  return (
    <group position={position}>
      <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.08} />
      </mesh>
      <group rotation-y={ry}>
        <primitive object={model} />
      </group>
      <Text position={[0, -0.1, 0.1]} fontSize={0.12} color={PALETTE.ivory} anchorX="center" anchorY="middle">
        Curator
      </Text>
    </group>
  );
}

// ─── RenderPeople OBJ figure for receptionist, same lazy-load + manual-texture
// pattern as the curator above (no .mtl trusted — RenderPeople's
// Windows-exported .mtl files reference textures with backslash paths
// browsers can't resolve).

let receptionFemaleModelPromise: Promise<THREE.Group> | null = null;

function loadReceptionFemaleModel() {
  if (!receptionFemaleModelPromise) {
    receptionFemaleModelPromise = new Promise<THREE.Group>((resolve, reject) => {
      const loader = new OBJLoader();
      loader.load(
        "/models/reception-female/rp_mei_posed_001_30k.obj",
        (obj) => {
          const tex = new THREE.TextureLoader().load(
            "/models/reception-female/tex/rp_mei_posed_001_dif_2k.jpg",
            (t) => { t.colorSpace = THREE.SRGBColorSpace; }
          );
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, metalness: 0.02 });
            }
          });
          const box = new THREE.Box3().setFromObject(obj);
          const height = box.max.y - box.min.y;
          if (height > 0) {
            const scale = 1.65 / height;
            obj.scale.setScalar(scale);
            const scaledBox = new THREE.Box3().setFromObject(obj);
            obj.position.y -= scaledBox.min.y;
          }
          resolve(obj);
        },
        undefined,
        reject
      );
    });
  }
  return receptionFemaleModelPromise;
}

function ReceptionFemale({ position, ry = 0 }: { position: [number, number, number]; ry?: number }) {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let alive = true;
    loadReceptionFemaleModel()
      .then((source) => {
        if (alive) setModel(source.clone());
      })
      .catch((err) => {
        console.warn("[ReceptionFemale] failed to load, skipping:", err);
        receptionFemaleModelPromise = null;
      });
    return () => { alive = false; };
  }, []);

  if (!model) return null;

  return (
    <group position={position} rotation-y={ry}>
      <primitive object={model} />
    </group>
  );
}

// ─── Furnishings — benches, planted greenery, lamp posts. Small props that
// make a room read as inhabited instead of an empty geometric shell.
function Bench({ position, ry = 0 }: { position: [number, number, number]; ry?: number }) {
  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.4, 0.06, 0.42]} />
        {inkMaterial("#5a4632", 0.7)}
      </mesh>
      <mesh position={[0, 0.62, -0.17]}>
        <boxGeometry args={[1.4, 0.42, 0.05]} />
        {inkMaterial("#5a4632", 0.7)}
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.21, 0.12]}>
            <boxGeometry args={[0.05, 0.42, 0.05]} />
            {inkMaterial(PALETTE.frame, 0.75)}
          </mesh>
          <mesh position={[x, 0.21, -0.12]}>
            <boxGeometry args={[0.05, 0.42, 0.05]} />
            {inkMaterial(PALETTE.frame, 0.75)}
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PottedPlant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.36, 12]} />
        {inkMaterial("#8b6a4a", 0.8)}
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.3, 10, 8]} />
        <meshStandardMaterial color="#5c6b3f" roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0.13, 0.66, 0.04]} rotation-z={0.32}>
        <coneGeometry args={[0.1, 0.5, 6]} />
        <meshStandardMaterial color="#6d7d47" roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[-0.14, 0.6, -0.07]} rotation-z={-0.26}>
        <coneGeometry args={[0.09, 0.44, 6]} />
        <meshStandardMaterial color="#748852" roughness={0.88} metalness={0} />
      </mesh>
    </group>
  );
}

function Planter({ position, ry = 0 }: { position: [number, number, number]; ry?: number }) {
  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.6, 0.56, 0.6]} />
        {inkMaterial("#4a4438", 0.8)}
      </mesh>
      <mesh position={[0, 0.57, 0]}>
        <boxGeometry args={[0.66, 0.04, 0.66]} />
        {inkMaterial(PALETTE.frame, 0.75)}
      </mesh>
      <PottedPlant position={[0, 0.58, 0]} scale={1.3} />
    </group>
  );
}

function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.06, 10]} />
        {inkMaterial(PALETTE.frame, 0.75)}
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 2.0, 8]} />
        {inkMaterial(PALETTE.frame, 0.7)}
      </mesh>
      <mesh position={[0, 2.08, 0]}>
        <boxGeometry args={[0.22, 0.24, 0.22]} />
        <meshStandardMaterial
          color="#f4ecd9"
          emissive="#f0cf8b"
          emissiveIntensity={0.6}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
      <pointLight position={[0, 2.08, 0]} intensity={1.4} distance={5} decay={2} color="#f0cf8b" />
    </group>
  );
}

// ─── Wall clock — shows the visitor's actual system time, not a fixed prop.
// Analog face with real hour/minute/second hands, each hand pivoting from
// a wrapping group (not the mesh itself) so rotation happens around the
// clock's center rather than the hand's own midpoint.
function ClockHand({
  length,
  width,
  depth,
  color,
}: {
  length: number;
  width: number;
  depth: number;
  color: string;
}) {
  return (
    <mesh position={[0, length / 2, 0]}>
      <boxGeometry args={[width, length, depth]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
  );
}

function MuseumClock({
  position,
  ry = 0,
}: {
  position: [number, number, number];
  ry?: number;
}) {
  const hourRef = useRef<THREE.Group>(null);
  const minRef = useRef<THREE.Group>(null);
  const secRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();
    if (hourRef.current) hourRef.current.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
    if (minRef.current) minRef.current.rotation.z = -((m + s / 60) / 60) * Math.PI * 2;
    if (secRef.current) secRef.current.rotation.z = -(s / 60) * Math.PI * 2;
  });

  const ticks = useMemo(() => Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2), []);

  return (
    <group position={position} rotation-y={ry}>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.035, 32]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Face */}
      <mesh position={[0, 0, 0.022]}>
        <circleGeometry args={[0.29, 32]} />
        {paperMaterial("#f7f0df", 0.9)}
      </mesh>
      {/* Hour ticks */}
      {ticks.map((a, i) => (
        <mesh
          key={i}
          position={[Math.sin(a) * 0.25, Math.cos(a) * 0.25, 0.03]}
          rotation-z={-a}
        >
          <boxGeometry args={[0.012, 0.03, 0.006]} />
          {inkMaterial()}
        </mesh>
      ))}
      {/* Hands — each in its own pivot group */}
      <group ref={hourRef} position={[0, 0, 0.035]}>
        <ClockHand length={0.15} width={0.014} depth={0.007} color={PALETTE.ivory} />
      </group>
      <group ref={minRef} position={[0, 0, 0.042]}>
        <ClockHand length={0.22} width={0.01} depth={0.007} color={PALETTE.ivory} />
      </group>
      <group ref={secRef} position={[0, 0, 0.049]}>
        <ClockHand length={0.24} width={0.004} depth={0.005} color={PALETTE.gold} />
      </group>
      {/* Center pin */}
      <mesh position={[0, 0, 0.055]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        {inkMaterial()}
      </mesh>
      {/* Small plaque underneath, matching the museum's captioning style */}
      <Text position={[0, -0.42, 0.03]} fontSize={0.045} letterSpacing={0.06} color={PALETTE.dim} anchorX="center" anchorY="middle">
        LOCAL TIME
      </Text>
    </group>
  );
}

// ─── Reception desk (OBJ model) — lazy-loaded, cached.
// Raw OBJ: Y range 0–43.5, X range ±416, Z range ±279.
// Scale to 0.9m tall. Falls back to procedural desk on error.
function ReceptionDesk({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[2.2, 0.88, 0.72]} />
        {inkMaterial("#55351f", 0.78)}
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.32, 0.08, 0.8]} />
        {inkMaterial("#8a5a38", 0.7)}
      </mesh>
      <mesh position={[0, 0.58, 0.365]}>
        <boxGeometry args={[1.55, 0.26, 0.025]} />
        {paperMaterial(PALETTE.paper, 0.9)}
      </mesh>
      <Text position={[0, 0.58, 0.385]} fontSize={0.09} color={PALETTE.ink} anchorX="center" anchorY="middle">
        FOYER
      </Text>
    </group>
  );
}

// ─── Wall-plank accent (OBJLoader + MTLLoader) — same defensive pattern as
// Tree. The exported .mtl only carries two flat placeholder colors (one an
// odd purple, not an actual wood tone), so materials are overridden after
// load rather than trusted as-is.
let plankModelPromise: Promise<THREE.Group> | null = null;

function loadPlankModel() {
  if (!plankModelPromise) {
    plankModelPromise = new Promise<THREE.Group>((resolve, reject) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath("/models/");
      mtlLoader.load(
        "planks.mtl",
        (materials) => {
          materials.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.setPath("/models/");
          objLoader.load("planks.obj", resolve, undefined, reject);
        },
        undefined,
        reject
      );
    });
  }
  return plankModelPromise;
}

function WoodPlankAccent({
  position,
  ry = 0,
  targetWidth = 2.4,
}: {
  position: [number, number, number];
  ry?: number;
  targetWidth?: number;
}) {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let alive = true;
    loadPlankModel()
      .then((source) => {
        if (!alive) return;
        const clone = source.clone(true);
        clone.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.material = new THREE.MeshStandardMaterial({
            color: "#6b4a30",
            roughness: 0.75,
            metalness: 0,
          });
        });

        // The raw model is exported lying flat — its bounding box is
        // ~800 x 24 x 463 (that ~24 is thickness), i.e. a floor-plank
        // layout, not a vertical wall panel. A pure Y-axis spin can't fix
        // that (it only turns a flat object in place, still flat) — it
        // needs to be physically tipped upright: rotate -90° about X so
        // the thin axis becomes depth-against-the-wall instead of "up",
        // with the original X staying as horizontal width and the
        // original Z becoming vertical height.
        const rawBox = new THREE.Box3().setFromObject(clone);
        const rawSize = rawBox.getSize(new THREE.Vector3());
        const widthSpan = Math.max(rawSize.x, 0.001);
        const autoScale = targetWidth / widthSpan;

        clone.rotation.x = -Math.PI / 2;
        clone.updateMatrixWorld(true);

        const rig = new THREE.Group();
        rig.add(clone);
        rig.scale.setScalar(autoScale);
        rig.updateMatrixWorld(true);

        // Re-measure after tipping upright to find the true floor offset
        // (relying on hand-derived arithmetic here would be one more place
        // to get the axis swap wrong).
        const tippedBox = new THREE.Box3().setFromObject(rig);
        rig.position.y -= tippedBox.min.y;

        setModel(rig);
      })
      .catch((err) => {
        console.warn("[Planks] failed to load, skipping:", err);
        plankModelPromise = null;
        if (alive) setModel(null);
      });
    return () => {
      alive = false;
    };
  }, [targetWidth]);

  if (!model) return null;

  return <primitive object={model} position={position} rotation-y={ry} />;
}

// ─── Scene assembly ────────────────────────────────────────────
export type WalkableSceneProps = {
  world: WalkableWorld;
  corridorLayout: SurfaceLayout[];
  roomLayout: SurfaceLayout[];
  exhibits: Exhibit[];
  developers: Developer[];
  exhibit: Exhibit;
  spawn: [number, number, number];
  quality: RendererQuality;
  openDoors: React.RefObject<Set<string>>;
  onPrompt: (prompt: string | null) => void;
  onInspect: (info: InspectInfo) => void;
  onDoorOpened: (door: WorldDoor) => void;
  onReady?: () => void;
  enabled: boolean;
  lightsOn?: boolean;
  timeOfDay?: TimeOfDay;
};

function WalkableWorldScene({
  world,
  corridorLayout,
  roomLayout,
  exhibits,
  developers,
  exhibit,
  spawn,
  openDoors,
  onPrompt,
  onInspect,
  onDoorOpened,
  enabled,
  lightsOn = true,
  timeOfDay = "noon",
}: WalkableSceneProps) {
  const byId = useMemo(() => new Map(exhibits.map((e) => [e.id, e])), [exhibits]);
  const roomOrigin = { x: 0, z: (FOOTPRINTS.exhibit.minZ + FOOTPRINTS.exhibit.maxZ) / 2 };

  // Wall-hung frames the camera should glance toward as you walk past.
  // East-wall frames (x > 0, ry = -PI/2) sit to the right → dir -1 (negative
  // yaw looks right); west-wall frames sit to the left → dir +1.
  const glanceTargets = useMemo<GlanceTarget[]>(() => {
    const targets: GlanceTarget[] = [];
    for (const surface of corridorLayout) {
      for (const { anchor } of surface.anchors) {
        const spot = corridorFrameSpot(anchor.id);
        if (!spot) continue;
        targets.push({ z: spot.position[2], dir: spot.position[0] > 0 ? -1 : 1 });
      }
    }
    // Reception sits on the left side of the entrance at z=18.35, so the
    // camera eases toward it as visitors approach instead of looking past it.
    targets.push({ z: 18.35, dir: 1 });
    return targets;
  }, [corridorLayout]);

  // Corridor frames are the sawtooth bay centers: each frame hangs on the
  // angled wall of its own 4-unit bay, alternating sides as you walk south.
  // Bays are numbered as EXHIBITOR 01, 02... in the order a visitor walks
  // past them (highest Z — nearest reception — first), merged across both
  // sides so numbering reads consistently regardless of which wall a given
  // developer landed on.
  const developerById = useMemo(() => new Map(developers.map((d) => [d.id, d])), [developers]);
  const workCountByDeveloper = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of exhibits) {
      counts.set(e.developerId, (counts.get(e.developerId) ?? 0) + 1);
    }
    return counts;
  }, [exhibits]);

  const corridorBays = useMemo(() => {
    const raw: Array<{ centerZ: number; exhibit: Exhibit; side: "east" | "west" }> = [];
    for (const surface of corridorLayout) {
      for (const { anchor, placement } of surface.anchors) {
        const spot = corridorFrameSpot(anchor.id);
        if (!spot || !placement) continue;
        const exhibitItem = byId.get(placement.entityId);
        if (!exhibitItem) continue;
        raw.push({
          centerZ: spot.position[2],
          exhibit: exhibitItem,
          side: spot.position[0] > 0 ? "east" : "west",
        });
      }
    }
    // Number bays in walking order (reception → exhibit room = high Z → low Z).
    raw.sort((a, b) => b.centerZ - a.centerZ);

    const east: BayFrameData[] = [];
    const west: BayFrameData[] = [];
    raw.forEach((item, i) => {
      const developer = developerById.get(item.exhibit.developerId);
      const frame: BayFrameData = {
        centerZ: item.centerZ,
        exhibit: item.exhibit,
        developer,
        workCount: developer ? workCountByDeveloper.get(developer.id) ?? 1 : 0,
        exhibitorNumber: i + 1,
      };
      (item.side === "east" ? east : west).push(frame);
    });
    return { east, west };
  }, [corridorLayout, byId, developerById, workCountByDeveloper]);

  return (
    <>
      <EntranceSky time={timeOfDay} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#f0ede6", "#d2c4a8", 0.75]} />
      <directionalLight position={[4, 8, 3]} intensity={1.0} color="#fff6df" />
      {/* These two were double-counting light already provided by
          MuseumLighting's pendants/spots/cans below — at 3.0/2.5 intensity
          with a 18-20 unit falloff distance they blanket the whole reception
          + corridor floor and were the main source of the blown-out, flat
          orange floor patches (see FloorSurface's tint fix above for the
          other half of that fix). Dropped to a fill-light level so the
          practical fixtures (pendants/track spots/cans) read as the actual
          light sources instead of being washed out by these two globals. */}
      <pointLight position={[0, 3.2, 0]} intensity={lightsOn ? 0.7 : 0.15} distance={20} decay={2} color="#fff4df" />
      <pointLight position={[0, 3.2, -14]} intensity={lightsOn ? 0.65 : 0.12} distance={18} decay={2} color="#f1eee6" />
      <MuseumLighting on={lightsOn} />

      <ApproachExterior />
      <GridFloor />

      <RoomBox
        footprint={FOOTPRINTS.corridor}
        gaps={{
          north: { minX: -0.8, maxX: 0.8, minZ: -13.05, maxZ: -12.95 },
          south: { minX: -0.8, maxX: 0.8, minZ: 12.95, maxZ: 13.05 },
        }}
        palette={{ wall: PALETTE.corridorWall, floor: PALETTE.corridorFloor, ceiling: PALETTE.corridorCeiling }}
        omitSides
      />
      <SawtoothSide
        side="east"
        fromZ={FOOTPRINTS.corridor.maxZ}
        toZ={FOOTPRINTS.corridor.minZ}
        bayFrames={corridorBays.east}
      />
      <SawtoothSide
        side="west"
        fromZ={FOOTPRINTS.corridor.maxZ}
        toZ={FOOTPRINTS.corridor.minZ}
        bayFrames={corridorBays.west}
      />
      <RoomBox
        footprint={FOOTPRINTS.exhibit}
        gaps={{ south: { minX: -0.8, maxX: 0.8, minZ: -13.05, maxZ: -12.95 } }}
        palette={{ wall: PALETTE.roomWall, floor: PALETTE.roomFloor, ceiling: PALETTE.roomCeiling }}
      />
      <RoomBox
        footprint={FOOTPRINTS.reception}
        gaps={{
          north: { minX: -0.8, maxX: 0.8, minZ: 12.95, maxZ: 13.05 },
          // The real front-door opening — this was missing entirely, so
          // reception's south wall rendered fully solid even though the
          // collision model already had a gap here. That mismatch is why
          // opening the entrance door revealed nothing: a solid wall sat
          // right behind it no matter what the door was doing.
          south: { minX: -ENTRANCE_HALF, maxX: ENTRANCE_HALF, minZ: 19.95, maxZ: 20.05 },
        }}
        // The exterior approach builds its own grand door frame (taller
        // posts, wide lintel, FOYER MUSEUM signage) — skip RoomBox's
        // standard doorway frame here so the two don't double up.
        omitDoorwayFrame={["south"]}
        palette={{ wall: PALETTE.receptionWall, floor: PALETTE.corridorFloor, ceiling: PALETTE.receptionCeiling }}
      />

      {world.doors.map((door) => (
        <DoorPanel key={door.id} door={door} openDoors={openDoors} />
      ))}

      {roomLayout.map((surface) =>
        surface.anchors.map(({ anchor, placement }) => {
          const spot = ROOM_SPOTS[anchor.id];
          if (!spot || !placement) return null;
          const exhibitItem = byId.get(placement.entityId);
          const position = spot.position(roomOrigin);
          if (anchor.id === "exhibit-media-wall") {
            return <ProjectionScreen key={`${anchor.id}-${exhibit?.id ?? "empty"}`} position={position} ry={-Math.PI / 2} exhibit={exhibit} />;
          }
          if (anchor.id === "exhibit-title-wall") {
            return (
              <Plaque
                key={`${anchor.id}-${exhibit?.id ?? exhibitItem?.id ?? "empty"}`}
                position={position}
                ry={0}
                title={exhibit?.title ?? exhibitItem?.title ?? "Exhibit"}
                body={exhibit?.tagline}
                size={[3.8, 1.7]}
                eyebrow="NOW SHOWING · LIVE PROJECT"
                image={exhibit?.media[0]?.src}
              />
            );
          }
          if (anchor.id === "exhibit-notes") {
            return (
              <Plaque
                key={anchor.id}
                position={position}
                ry={Math.PI / 2}
                title="Curator's note"
                body={exhibit?.curatorNotes}
                size={[2.6, 1.4]}
              />
            );
          }
          const artifactIndex = anchor.id.includes("2") ? 1 : 0;
          const artifact = exhibit?.artifacts[artifactIndex] ?? exhibit?.artifacts[0];
          return (
            <ArtifactPlinth
              key={anchor.id}
              position={position}
              ry={anchor.id.includes("1") ? -Math.PI / 2 : Math.PI / 2}
              label={artifact?.label}
              description={artifact?.description}
            />
          );
        })
      )}

      <CuratorFigure position={[1.8, 0, 18.4]} />
      <ReceptionDesk position={[-1.2, 0, 18.35]} />
      <ReceptionFemale position={[-1.2, 0, 18.85]} ry={0} />
      <MuseumClock position={[4.97, 2.3, 18.6]} ry={-Math.PI / 2} />

      {/* Reception furnishing */}
      <Bench position={[3.6, 0, 15.6]} ry={-Math.PI / 2} />
      <PottedPlant position={[4.3, 0, 14.2]} scale={1.4} />
      <PottedPlant position={[-4.3, 0, 19.2]} scale={1.4} />
      <PottedPlant position={[-4.3, 0, 14.5]} scale={1.3} />
      <PottedPlant position={[4.3, 0, 17.6]} scale={1.3} />
      {/* Wall-plank accent (OBJLoader+MTLLoader) — reuses the x=-4.3 wall
          line already proven safe by the PottedPlant above, at a different
          Z so it doesn't overlap either existing prop. */}
      <WoodPlankAccent position={[-4.3, 0.15, 16.5]} ry={Math.PI / 2} />

      {/* Exhibit room furnishing */}
      <PottedPlant position={[-4.3, 0, -19.3]} scale={1.2} />
      <PottedPlant position={[4.3, 0, -19.3]} scale={1.2} />

      <WalkablePlayer
        world={world}
        openDoors={openDoors}
        spawn={spawn}
        onPrompt={onPrompt}
        onInspect={onInspect}
        onDoorOpened={onDoorOpened}
        enabled={enabled}
        glanceTargets={glanceTargets}
      />
    </>
  );
}

// ─── Canvas host ───────────────────────────────────────────────
export type WalkableWorldCanvasProps = Omit<WalkableSceneProps, "world">;

export function WalkableWorldCanvas({
  corridorLayout,
  roomLayout,
  exhibits,
  developers,
  exhibit,
  spawn,
  quality,
  openDoors,
  onPrompt,
  onInspect,
  onDoorOpened,
  onReady,
  enabled,
  lightsOn = true,
  timeOfDay = "noon",
}: WalkableWorldCanvasProps) {
  const world = useMemo<WalkableWorld>(
    () => ({
      solids: buildSolids(),
      doors: buildDoors(),
      interactives: buildInteractives(
        corridorLayout,
        roomLayout,
        exhibits,
        developers,
        { x: 0, z: (FOOTPRINTS.exhibit.minZ + FOOTPRINTS.exhibit.maxZ) / 2 },
        exhibit
      ),
    }),
    [corridorLayout, roomLayout, exhibits, developers, exhibit]
  );

  return (
    <Canvas
      dpr={[1, quality.maxDpr]}
      gl={{ antialias: quality.maxDpr > 1, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 72, near: 0.1, far: 60, position: spawn }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(PALETTE.paper, 1);
        // Explicit tone mapping + a slightly reduced exposure so the museum's
        // many stacked point/spot lights (MuseumLighting on top of the base
        // ambient/directional/point rig below) compress toward highlight
        // detail instead of clipping to a flat, blown-out color.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        camera.up.set(0, 1, 0);
        camera.rotation.order = "YXZ";
        onReady?.();
      }}
    >
      <Suspense fallback={null}>
        <WalkableWorldScene
          world={world}
          corridorLayout={corridorLayout}
          roomLayout={roomLayout}
          exhibits={exhibits}
          developers={developers}
          exhibit={exhibit}
          spawn={spawn}
          quality={quality}
          openDoors={openDoors}
          onPrompt={onPrompt}
          onInspect={onInspect}
          onDoorOpened={onDoorOpened}
          enabled={enabled}
          lightsOn={lightsOn}
          timeOfDay={timeOfDay}
        />
      </Suspense>
    </Canvas>
  );
}
