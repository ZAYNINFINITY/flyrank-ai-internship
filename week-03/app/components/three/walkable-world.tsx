"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { SurfaceLayout } from "@/lib/museum/queries";
import type { Exhibit } from "@/lib/types/exhibit";
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

const HEIGHT = 4.2;
const BASEBOARD_H = 0.14;
const BASEBOARD_D = 0.08;
const DOOR_POST = 0.14;
const DOOR_LINTEL_Y = 2.72;

// ITOM-INSPIRED SAWTOOTH CORRIDOR — recessed angled wall bays, ported from
// the MIT itom corridor (github.com/ITomPoland/portfolio-itom) to Plinth's
// dimensions. Each bay: a straight filler at the outer wall line, one angled
// wall across a 4-unit span (outer→inner as Z decreases), and a small
// connector closing the low-Z end. Frames hang on the angled walls exactly
// like itom's doors — and the angled walls lean toward the camera as you
// approach (DoorWallSegment tilt), reimplemented with static bay geometry.
const BAY_OUTER_X = 3.0; // corridor half-width (outer wall line)
const BAY_INNER_X = 1.6; // recessed bay face toward the corridor center
const BAY_HALF_SPAN = 2; // half the bay length along Z (DOOR_Z_SPAN = 4)
const BAY_TILT = { base: 0.02, max: 0.2, start: 12, peak: 2, lerp: 0.06 };

// ITOM-INSPIRED SKETCHBOOK PALETTE — bright warm paper, not dark ink.
// Mirrors itomdev.com's mood: cream paper walls, faint floor grid, ink text,
// thin sketch frames. "Wall" reads slightly warmer/cooler per room so each
// space still has its own paper tone without breaking the sketchbook feel.
const PALETTE = {
  corridorWall: "#efe9da",
  corridorFloor: "#e4ddca",
  corridorCeiling: "#e9e3d2",
  roomWall: "#eae6df",
  roomFloor: "#ded8c8",
  roomCeiling: "#e4dfd3",
  receptionWall: "#e8e4d5",
  receptionFloor: "#dcd5c2",
  receptionCeiling: "#e2dccb",
  approachWall: "#ddd6c4",
  approachFloor: "#d3ccb8",
  approachPath: "#e6dfcd",
  ivory: "#2a2a30",
  dim: "#6f6c62",
  accent: "#c96a3a",
  gold: "#b09048",
  frame: "#3c3a33",
  door: "#e2dbc8",
  ink: "#2a2a30",
  paper: "#efe9da",
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
}: {
  footprint: Rect;
  gaps: Partial<Record<"north" | "south" | "east" | "west", Rect>>;
  palette: { wall: string; floor: string; ceiling: string };
  omitSides?: boolean;
}) {
  const widthX = footprint.maxX - footprint.minX;
  const widthZ = footprint.maxZ - footprint.minZ;

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
          {paperMaterial(palette.wall)}
        </mesh>
        <mesh position={[midX, BASEBOARD_H / 2, x]}>
          <boxGeometry args={[width, BASEBOARD_H, BASEBOARD_D]} />
          <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
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
          {paperMaterial(palette.wall)}
        </mesh>
        <mesh position={[z, BASEBOARD_H / 2, midZ]}>
          <boxGeometry args={[BASEBOARD_D, BASEBOARD_H, width]} />
          <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
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
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[widthX, widthZ]} />
        {paperMaterial(palette.floor, 0.98)}
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, HEIGHT, 0]}>
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
      {north && <Doorway axis="x" at={footprint.minZ + 0.02} gap={north} />}
      {south && <Doorway axis="x" at={footprint.maxZ - 0.02} gap={south} />}
      {!omitSides && east && <Doorway axis="z" at={footprint.maxX - 0.02} gap={east} />}
      {!omitSides && west && <Doorway axis="z" at={footprint.minX + 0.02} gap={west} />}
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
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      <mesh position={[postB[0], DOOR_LINTEL_Y / 2, postB[1]]}>
        <boxGeometry args={alongX ? [DOOR_POST, DOOR_LINTEL_Y, 0.16] : [0.16, DOOR_LINTEL_Y, DOOR_POST]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      <mesh position={alongX ? [mid, DOOR_LINTEL_Y, at] : [at, DOOR_LINTEL_Y, mid]}>
        <boxGeometry args={alongX ? [length + DOOR_POST, 0.16, 0.16] : [0.16, 0.16, length + DOOR_POST]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      <mesh position={alongX ? [mid, 0.012, at] : [at, 0.012, mid]}>
        <boxGeometry args={alongX ? [length + 0.5, 0.02, 0.1] : [0.1, 0.02, length + 0.5]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── Sawtooth corridor walls (itom-inspired bay geometry) ─────
// One side of the corridor rebuilt as recessed bays. The angled "bay" walls
// lean toward the camera as it walks past (DoorWallSegment tilt), carrying
// their frame with them so frames stay flush with the moving wall.

type BayFrameData = { centerZ: number; exhibit: Exhibit };

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
        {paperMaterial(PALETTE.corridorWall)}
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
                {paperMaterial(PALETTE.corridorWall)}
              </mesh>
              <mesh position={[0, BASEBOARD_H / 2, 0]}>
                <boxGeometry args={[seg.width, BASEBOARD_H, BASEBOARD_D]} />
                <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
              </mesh>
            </group>
          );
        }
        if (seg.kind === "connector") {
          return (
            <mesh key={i} position={seg.position} rotation-y={seg.ry}>
              <planeGeometry args={[seg.width, HEIGHT]} />
              {paperMaterial(PALETTE.corridorWall)}
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
            {seg.frame && (
              <Frame
                position={[0, 2.25, 0]}
                ry={0}
                revealZ={seg.frame.centerZ}
                title={seg.frame.exhibit.title}
                tagline={seg.frame.exhibit.tagline}
              />
            )}
          </BayWall>
        );
      })}
    </group>
  );
}

// ─── Wall-hung content ─────────────────────────────────────────
function Frame({
  position,
  ry,
  title,
  tagline,
  revealZ,
}: {
  position: [number, number, number];
  ry: number;
  title: string;
  tagline?: string;
  revealZ?: number;
}) {
  return (
    <group position={position} rotation-y={ry}>
      {/* Thin ink sketch frame — four strokes around the mat, no slab */}
      <mesh position={[0, 1.175, 0.1]}>
        <boxGeometry args={[1.58, 0.05, 0.05]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[0, -1.175, 0.1]}>
        <boxGeometry args={[1.58, 0.05, 0.05]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[0.79, 0, 0.1]}>
        <boxGeometry args={[0.05, 2.4, 0.05]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[-0.79, 0, 0.1]}>
        <boxGeometry args={[0.05, 2.4, 0.05]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.6} metalness={0} />
      </mesh>
      {/* Paper mat */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[1.5, 2.3]} />
        {paperMaterial(PALETTE.paper, 0.95)}
      </mesh>
      <Text
        position={[0, 0.45, 0.27]}
        fontSize={0.16}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        overflowWrap="break-word"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.5, 0.27]}
        fontSize={0.1}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        overflowWrap="break-word"
      >
        {tagline ?? ""}
      </Text>
      <SketchCard position={[0, -0.95, 0.2]} seed={title} frameZ={revealZ} />
    </group>
  );
}

function Plaque({
  position,
  ry,
  title,
  body,
  size,
}: {
  position: [number, number, number];
  ry: number;
  title: string;
  body?: string;
  size: [number, number];
}) {
  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, size[1], size[0]]} />
        {paperMaterial(PALETTE.paper, 0.95)}
      </mesh>
      <Text
        position={[0, size[1] / 4, 0.12]}
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
  const src = exhibit?.media[0]?.src;

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
        Projection · media display
      </Text>
    </group>
  );
}

function ArtifactPlinth({
  position,
  ry,
}: {
  position: [number, number, number];
  ry: number;
}) {
  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 1.1, 0.9]} />
        {paperMaterial(PALETTE.paper, 0.95)}
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <octahedronGeometry args={[0.32]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.35} metalness={0.1} />
      </mesh>
      <Text
        position={[0, -0.95, 0.5]}
        fontSize={0.1}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
      >
        Artifact on display
      </Text>
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

  useFrame((_, delta) => {
    const open = openDoors.current?.has(door.id) ?? false;
    const target = open ? door.swing : 0;
    current.current += (target - current.current) * Math.min(1, delta * 6);
    if (group.current) group.current.rotation.y = current.current;
  });

  return (
    <>
      {/* Swinging panel + handle — this group's rotation animates open/closed */}
      <group ref={group} position={[door.hingeX, 0, door.hingeZ]}>
        <mesh position={[panelOffset, 1.3, 0]}>
          <boxGeometry args={[1.6, 2.6, 0.08]} />
          <meshStandardMaterial color={PALETTE.door} roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[panelOffset + (panelOffset > 0 ? 0.62 : -0.62), 1.3, 0]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color={PALETTE.gold} roughness={0.3} metalness={0.8} />
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

function ApproachExterior() {
  const approach = FOOTPRINTS.approach;
  const widthX = approach.maxX - approach.minX;
  const widthZ = approach.maxZ - approach.minZ;
  const midZ = (approach.minZ + approach.maxZ) / 2;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, midZ]}>
        <planeGeometry args={[2.4, widthZ]} />
        {paperMaterial(PALETTE.approachPath, 0.9)}
      </mesh>
      <mesh position={[0, HEIGHT / 2, approach.minZ]}>
        <planeGeometry args={[widthX, HEIGHT * 1.05]} />
        {paperMaterial(PALETTE.approachWall)}
      </mesh>
      <mesh position={[-1.6, 1.2, approach.minZ + 1.2]}>
        <boxGeometry args={[0.18, 2.4, 0.18]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      <mesh position={[1.6, 1.2, approach.minZ + 1.2]}>
        <boxGeometry args={[0.18, 2.4, 0.18]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      {/* Lintel — turns the two posts into a real doorway */}
      <mesh position={[0, 2.5, approach.minZ + 1.2]}>
        <boxGeometry args={[3.4, 0.22, 0.18]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.85} />
      </mesh>
      <Text
        position={[0, 3.1, approach.minZ + 0.4]}
        fontSize={0.32}
        color={PALETTE.ivory}
        anchorX="center"
        anchorY="middle"
      >
        PLINTH MUSEUM
      </Text>
      <Text
        position={[0, 2.5, approach.minZ + 0.4]}
        fontSize={0.11}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
      >
        Digital archive of shipped work
      </Text>
    </group>
  );
}

// ─── Floating sketch doodles (procedural, drawn in code) ──────
// Loose sketchbook marks that hover around the curator like itom's paper
// doodles — but built from pure geometry + our own canvas scribbles instead
// of their painted art assets, so the mood survives without copying.

const NOTE_TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

function getFloatNoteTexture() {
  const cached = NOTE_TEXTURE_CACHE.get("float-note");
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 224;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 256, 224);
    ctx.strokeStyle = "#3c3a33";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Wobbly five-point star (straight strokes nudged slightly off-grid).
    const cx = 128;
    const cy = 98;
    const R = 48;
    const r = 22;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? R : r;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(a) * radius + (i % 3) * 1.6;
      const y = cy + Math.sin(a) * radius + (i % 2) * 1.6;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Squiggle underline + two accent dots.
    wobblyLine(ctx, cx - 42, cy + 66, cx + 42, cy + 66, 3);
    ctx.beginPath();
    ctx.arc(cx - 64, cy + 6, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 64, cy - 4, 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  NOTE_TEXTURE_CACHE.set("float-note", tex);
  return tex;
}

function DoodleStar({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * speed;
  });
  return (
    <group ref={group} position={position}>
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((a) => (
        <mesh key={a} rotation-z={a}>
          <planeGeometry args={[0.3, 0.055]} />
          <meshBasicMaterial color={color} transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function DoodleSquiggle({ position, color }: { position: [number, number, number]; color: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
      group.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.9) * 0.03;
    }
  });
  return (
    <group ref={group} position={position}>
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[i * 0.055, Math.sin(i * 0.9) * 0.05, 0]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function DoodleCircle({ position, color }: { position: [number, number, number]; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
      mesh.current.scale.setScalar(s);
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
    }
  });
  return (
    <mesh ref={mesh} position={position} rotation-y={-Math.PI / 4}>
      <ringGeometry args={[0.11, 0.135, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FloatNote({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => getFloatNoteTexture(), []);
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.position.y = position[1] + Math.sin(t * 1.1) * 0.06;
      group.current.rotation.z = Math.sin(t * 0.8) * 0.1;
      group.current.rotation.x = Math.sin(t * 0.5) * 0.06;
    }
  });
  return (
    <group ref={group} position={position}>
      <mesh rotation-y={-Math.PI / 4}>
        <planeGeometry args={[0.42, 0.36]} />
        <meshBasicMaterial map={tex} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CorridorDoodles() {
  return (
    <group>
      <DoodleStar position={[2.45, 1.95, 16.7]} color={PALETTE.dim} speed={0.7} />
      <DoodleSquiggle position={[1.0, 1.5, 17.4]} color={PALETTE.dim} />
      <DoodleCircle position={[2.6, 1.35, 15.6]} color={PALETTE.accent} />
      <FloatNote position={[1.1, 2.1, 16.85]} />
    </group>
  );
}

function CuratorFigure({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) {
      group.current.position.set(
        position[0],
        position[1] + Math.sin(Date.now() * 0.002) * 0.04,
        position[2]
      );
    }
  });

  return (
    <group ref={group}>
      {/* Legs */}
      <mesh position={[-0.09, 0.32, 0]}>
        <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[0.09, 0.32, 0]}>
        <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.8} metalness={0} />
      </mesh>
      {/* Torso — a slightly fuller "coat" shape */}
      <mesh position={[0, 0.82, 0]}>
        <capsuleGeometry args={[0.17, 0.5, 4, 8]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.8} metalness={0} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.26, 0.78, 0]} rotation-z={0.12}>
        <capsuleGeometry args={[0.05, 0.42, 4, 8]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[0.26, 0.78, 0]} rotation-z={-0.12}>
        <capsuleGeometry args={[0.05, 0.42, 4, 8]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.8} metalness={0} />
      </mesh>
      {/* Head + a sketch-ink eye */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.17, 12, 12]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.32, 0.15]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={PALETTE.paper} roughness={0.5} />
      </mesh>
      <Text position={[0, 1.78, 0]} fontSize={0.09} color={PALETTE.dim} anchorX="center" anchorY="middle">
        Curator
      </Text>
    </group>
  );
}

// ─── Scene assembly ────────────────────────────────────────────
export type WalkableSceneProps = {
  world: WalkableWorld;
  corridorLayout: SurfaceLayout[];
  roomLayout: SurfaceLayout[];
  exhibits: Exhibit[];
  exhibit: Exhibit;
  spawn: [number, number, number];
  quality: RendererQuality;
  openDoors: React.RefObject<Set<string>>;
  onPrompt: (prompt: string | null) => void;
  onInspect: (info: InspectInfo) => void;
  onDoorOpened: (door: WorldDoor) => void;
  onReady?: () => void;
  enabled: boolean;
};

function WalkableWorldScene({
  world,
  corridorLayout,
  roomLayout,
  exhibits,
  exhibit,
  spawn,
  openDoors,
  onPrompt,
  onInspect,
  onDoorOpened,
  enabled,
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
    return targets;
  }, [corridorLayout]);

  // Corridor frames are the sawtooth bay centers: each frame hangs on the
  // angled wall of its own 4-unit bay, alternating sides as you walk south.
  const corridorBays = useMemo(() => {
    const east: BayFrameData[] = [];
    const west: BayFrameData[] = [];
    for (const surface of corridorLayout) {
      for (const { anchor, placement } of surface.anchors) {
        const spot = corridorFrameSpot(anchor.id);
        if (!spot || !placement) continue;
        const exhibitItem = byId.get(placement.entityId);
        if (!exhibitItem) continue;
        const frame = { centerZ: spot.position[2], exhibit: exhibitItem };
        (spot.position[0] > 0 ? east : west).push(frame);
      }
    }
    return { east, west };
  }, [corridorLayout, byId]);

  return (
    <>
      <fog attach="fog" args={[PALETTE.paper, 26, 85]} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#fff7e6", "#9a9384", 0.9]} />
      <directionalLight position={[4, 8, 3]} intensity={1.15} color="#fff4dd" />
      <pointLight position={[0, 3.2, 0]} intensity={14} distance={22} decay={2} color={PALETTE.accent} />
      <pointLight position={[0, 3.2, -16]} intensity={12} distance={18} decay={2} color="#8a7a5a" />
      <pointLight position={[0, 3.2, 16.5]} intensity={12} distance={18} decay={2} color="#7a8a6a" />

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
        gaps={{ north: { minX: -0.8, maxX: 0.8, minZ: 12.95, maxZ: 13.05 } }}
        palette={{ wall: PALETTE.receptionWall, floor: PALETTE.receptionFloor, ceiling: PALETTE.receptionCeiling }}
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
            return <ProjectionScreen key={anchor.id} position={position} ry={-Math.PI / 2} exhibit={exhibitItem} />;
          }
          if (anchor.id === "exhibit-title-wall") {
            return (
              <Plaque
                key={anchor.id}
                position={position}
                ry={0}
                title={exhibit?.title ?? exhibitItem?.title ?? "Exhibit"}
                body={exhibit?.tagline}
                size={[3.8, 1.7]}
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
                body="Behind-the-scenes notes about building this one."
                size={[2.6, 1.4]}
              />
            );
          }
          return <ArtifactPlinth key={anchor.id} position={position} ry={anchor.id.includes("1") ? -Math.PI / 2 : Math.PI / 2} />;
        })
      )}

      <Plaque
        position={[0, 2.25, 13.3]}
        ry={0}
        title="Plinth Museum"
        body="Scroll forward to tour the corridor. Reception and curator are ahead."
        size={[3.2, 1.5]}
      />

      <CuratorFigure position={[1.8, 0, 16.2]} />
      <CorridorDoodles />

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
  exhibit,
  spawn,
  quality,
  openDoors,
  onPrompt,
  onInspect,
  onDoorOpened,
  onReady,
  enabled,
}: WalkableWorldCanvasProps) {
  const world = useMemo<WalkableWorld>(
    () => ({
      solids: buildSolids(),
      doors: buildDoors(),
      interactives: buildInteractives(
        corridorLayout,
        roomLayout,
        exhibits,
        { x: 0, z: (FOOTPRINTS.exhibit.minZ + FOOTPRINTS.exhibit.maxZ) / 2 },
        exhibit
      ),
    }),
    [corridorLayout, roomLayout, exhibits, exhibit]
  );

  return (
    <Canvas
      dpr={[1, quality.maxDpr]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 72, near: 0.1, far: 60, position: spawn }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(PALETTE.paper, 1);
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
          exhibit={exhibit}
          spawn={spawn}
          quality={quality}
          openDoors={openDoors}
          onPrompt={onPrompt}
          onInspect={onInspect}
          onDoorOpened={onDoorOpened}
          enabled={enabled}
        />
      </Suspense>
    </Canvas>
  );
}
