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
import { WalkablePlayer } from "./walkable-player";

const HEIGHT = 4.2;

// Near-monochrome ink palette — paper sketch mood without cloning ITom colors.
// Lightened from the first pass: the walls were nearly the same value as the
// fog/background, which (combined with a close fog start) crushed the whole
// room to black past a few units. Keep the muted, desaturated mood, but with
// enough separation between wall/floor/ceiling/background to actually read.
const PALETTE = {
  corridorWall: "#5c5c68",
  corridorFloor: "#46464f",
  corridorCeiling: "#3a3a42",
  roomWall: "#585468",
  roomFloor: "#44404e",
  roomCeiling: "#38343f",
  receptionWall: "#525c5c",
  receptionFloor: "#404a4a",
  receptionCeiling: "#343c3d",
  approachWall: "#40404a",
  approachFloor: "#302f38",
  approachPath: "#48484f",
  ivory: "#f0eee8",
  dim: "#b8b4c8",
  accent: "#7f92e0",
  gold: "#c8ac70",
  frame: "#26262e",
  door: "#3a3a46",
  ink: "#121218",
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

// ─── Room shell (walls minus door gaps + floor + ceiling) ─────
function RoomBox({
  footprint,
  gaps,
  palette,
}: {
  footprint: Rect;
  gaps: Partial<Record<"north" | "south" | "east" | "west", Rect>>;
  palette: { wall: string; floor: string; ceiling: string };
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
  }) => (
    <mesh position={[ (fromX + toX) / 2, HEIGHT / 2, x ]} rotation-y={ry}>
      <planeGeometry args={[toX - fromX, HEIGHT]} />
      {paperMaterial(palette.wall)}
    </mesh>
  );

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
  }) => (
    <mesh position={[z, HEIGHT / 2, (fromZ + toZ) / 2]} rotation-y={ry}>
      <planeGeometry args={[footprint.maxX - footprint.minX, HEIGHT]} />
      {paperMaterial(palette.wall)}
    </mesh>
  );

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

      {east ? (
        <>
          {wallAlongZ({ z: footprint.maxX, fromZ: footprint.minZ, toZ: east.minZ, ry: -Math.PI / 2 })}
          {wallAlongZ({ z: footprint.maxX, fromZ: east.maxZ, toZ: footprint.maxZ, ry: -Math.PI / 2 })}
        </>
      ) : (
        wallAlongZ({ z: footprint.maxX, fromZ: footprint.minZ, toZ: footprint.maxZ, ry: -Math.PI / 2 })
      )}
      {west ? (
        <>
          {wallAlongZ({ z: footprint.minX, fromZ: footprint.minZ, toZ: west.minZ, ry: Math.PI / 2 })}
          {wallAlongZ({ z: footprint.minX, fromZ: west.maxZ, toZ: footprint.maxZ, ry: Math.PI / 2 })}
        </>
      ) : (
        wallAlongZ({ z: footprint.minX, fromZ: footprint.minZ, toZ: footprint.maxZ, ry: Math.PI / 2 })
      )}
    </group>
  );
}

// ─── Wall-hung content ─────────────────────────────────────────
function Frame({
  position,
  ry,
  title,
  tagline,
}: {
  position: [number, number, number];
  ry: number;
  title: string;
  tagline?: string;
}) {
  return (
    <group position={position} rotation-y={ry}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.14, 2.5, 1.7]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Sketched frame corners */}
      {[
        [-0.72, 1.15, 0.14],
        [0.72, 1.15, 0.14],
        [-0.72, -1.15, 0.14],
        [0.72, -1.15, 0.14],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[1.5, 2.3]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.95} />
      </mesh>
      <Text
        position={[0, 0.45, 0.26]}
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
        position={[0, -0.5, 0.26]}
        fontSize={0.1}
        color={PALETTE.dim}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
        overflowWrap="break-word"
      >
        {tagline ?? ""}
      </Text>
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
        <boxGeometry args={[0.1, size[1], size[0]]} />
        <meshStandardMaterial color={PALETTE.frame} roughness={0.6} metalness={0.1} />
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
          <meshStandardMaterial color="#232a52" roughness={0.9} />
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
        <meshStandardMaterial color="#262a4e" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <octahedronGeometry args={[0.32]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.25} metalness={0.5} />
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
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.22, 0.7, 4, 8]} />
        <meshStandardMaterial color={PALETTE.dim} roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.5} />
      </mesh>
      <Text position={[0, 1.65, 0]} fontSize={0.09} color={PALETTE.dim} anchorX="center" anchorY="middle">
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

  return (
    <>
      <fog attach="fog" args={[PALETTE.ink, 20, 60]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#c8ccd8", PALETTE.ink, 0.75]} />
      <directionalLight position={[4, 8, 3]} intensity={1.5} color="#f0ebe0" />
      <pointLight position={[0, 3.2, 0]} intensity={24} distance={20} decay={2} color={PALETTE.accent} />
      <pointLight position={[0, 3.2, -16]} intensity={22} distance={16} decay={2} color="#7a6a9a" />
      <pointLight position={[0, 3.2, 16.5]} intensity={20} distance={16} decay={2} color="#4a8a8a" />

      <ApproachExterior />

      <RoomBox
        footprint={FOOTPRINTS.corridor}
        gaps={{
          north: { minX: -0.8, maxX: 0.8, minZ: -13.05, maxZ: -12.95 },
          south: { minX: -0.8, maxX: 0.8, minZ: 12.95, maxZ: 13.05 },
        }}
        palette={{ wall: PALETTE.corridorWall, floor: PALETTE.corridorFloor, ceiling: PALETTE.corridorCeiling }}
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

      {corridorLayout.map((surface) =>
        surface.anchors.map(({ anchor, placement }) => {
          const spot = corridorFrameSpot(anchor.id);
          if (!spot || !placement) return null;
          const exhibitItem = byId.get(placement.entityId);
          if (!exhibitItem) return null;
          return (
            <Frame
              key={anchor.id}
              position={spot.position}
              ry={spot.ry}
              title={exhibitItem.title}
              tagline={exhibitItem.tagline}
            />
          );
        })
      )}

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

      <WalkablePlayer
        world={world}
        openDoors={openDoors}
        spawn={spawn}
        onPrompt={onPrompt}
        onInspect={onInspect}
        onDoorOpened={onDoorOpened}
        enabled={enabled}
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
        gl.setClearColor(PALETTE.ink, 1);
        camera.up.set(0, 1, 0);
        camera.rotation.order = "YXZ";
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
