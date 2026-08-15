"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementRef,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Anchor, Door, EntityType, SurfaceDirection } from "@/lib/museum/types";
import type { SurfaceLayout } from "@/lib/museum/queries";
import type { Exhibit } from "@/lib/types/exhibit";
import type { RendererQuality } from "@/lib/renderer/capability";

// ─── Room geometry ───────────────────────────────────────────────
// One room of the world graph, rendered procedurally. Width runs
// along X, depth along Z, height along Y. Anchor "left|center|right"
// maps onto each wall's local axis (from a viewer facing the wall).
const ROOM = { width: 10, depth: 7, height: 4.2 };

const WALLS: Record<
  SurfaceDirection,
  { pos: [number, number, number]; u: [number, number, number]; ry: number }
> = {
  north: { pos: [0, 0, -ROOM.depth / 2], u: [1, 0, 0], ry: 0 },
  south: { pos: [0, 0, ROOM.depth / 2], u: [-1, 0, 0], ry: Math.PI },
  east: { pos: [ROOM.width / 2, 0, 0], u: [0, 0, 1], ry: -Math.PI / 2 },
  west: { pos: [-ROOM.width / 2, 0, 0], u: [0, 0, -1], ry: Math.PI / 2 },
};

const INWARD: Record<SurfaceDirection, [number, number, number]> = {
  north: [0, 0, 1],
  south: [0, 0, -1],
  east: [1, 0, 0],
  west: [-1, 0, 0],
};

const POSITION_OFFSET: Record<Anchor["position"], number> = {
  left: -ROOM.width / 3,
  center: 0,
  right: ROOM.width / 3,
};

const ENTRY_YAW: Record<SurfaceDirection, number> = {
  south: 0,
  north: Math.PI,
  east: Math.PI / 2,
  west: -Math.PI / 2,
};

// ─── Palette (mirrors the CSS theme tokens) ──────────────────────
const COLORS = {
  void: "#0b0d1c",
  wall: "#191d36",
  floor: "#12142a",
  ceiling: "#101224",
  ivory: "#eceaf4",
  ivoryDim: "#d9d5ea",
  ink: "#161a30",
  inkSoft: "#4a4f6b",
  frame: "#1b1f3a",
  accent: "#3555ff",
  portal: "#3d57ff",
  portalText: "#8fa3ff",
  gold: "#c9a227",
  violet: "#7c5cff",
  teal: "#2aa9a9",
};

// ─── View model ──────────────────────────────────────────────────
export type View = { dest: THREE.Vector3; lookAt: THREE.Vector3 };

export type InspectSource = "title" | "notes" | "artifact" | "projection";
export type InspectInfo = { title: string; body: string; source: InspectSource };

function defaultView(entrySurface: SurfaceDirection | null): View {
  const yaw = entrySurface ? ENTRY_YAW[entrySurface] : 0;
  const lookAt = new THREE.Vector3(0, 1.5, 0);
  const dest = new THREE.Vector3(
    lookAt.x + Math.sin(yaw) * 5.9,
    1.7,
    lookAt.z + Math.cos(yaw) * 5.9
  );
  return { dest, lookAt };
}

function anchorXZ(direction: SurfaceDirection, position: Anchor["position"]) {
  const wall = WALLS[direction];
  const offset = POSITION_OFFSET[position];
  return { x: wall.pos[0] + wall.u[0] * offset, z: wall.pos[2] + wall.u[2] * offset };
}

function anchorView(
  direction: SurfaceDirection,
  xz: { x: number; z: number },
  objectY: number
): View {
  const inward = INWARD[direction];
  const obj = new THREE.Vector3(
    xz.x + inward[0] * 0.35,
    objectY,
    xz.z + inward[2] * 0.35
  );
  const lookAt = obj.clone();
  lookAt.y += 0.1;
  const dest = new THREE.Vector3(
    xz.x + inward[0] * 2.3,
    Math.min(Math.max(objectY + 0.55, 0.9), 2.9),
    xz.z + inward[2] * 2.3
  );
  dest.x = Math.min(Math.max(dest.x, -4.6), 4.6);
  dest.z = Math.min(Math.max(dest.z, -3.3), 3.3);
  return { dest, lookAt };
}

// ─── Shared pieces ───────────────────────────────────────────────
function RoomShell() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={COLORS.floor} roughness={0.95} metalness={0} />
      </mesh>
      <gridHelper
        args={[ROOM.width, 10, "#2b3160", "#1d2142"]}
        position={[0, 0.006, 0]}
      />
      <mesh rotation-x={Math.PI / 2} position={[0, ROOM.height, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color={COLORS.ceiling} roughness={1} />
      </mesh>
      {(Object.keys(WALLS) as SurfaceDirection[]).map((direction) => {
        const wall = WALLS[direction];
        return (
          <mesh key={direction} position={wall.pos} rotation-y={wall.ry} receiveShadow>
            <planeGeometry args={[ROOM.width, ROOM.height]} />
            <meshStandardMaterial color={COLORS.wall} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function Lights({ quality }: { quality: RendererQuality }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 7, 3]}
        intensity={1.6}
        color="#fff4e6"
        castShadow={quality.shadows}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 3.4, -3.1]} intensity={16} distance={9} decay={2} color={COLORS.accent} />
      <pointLight position={[-4, 2.4, 3.2]} intensity={7} distance={9} decay={2} color="#ffcfa0" />
    </>
  );
}

type WallAnchorProps = {
  direction: SurfaceDirection;
  xz: { x: number; z: number };
  y: number;
  depth: number;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  children: ReactNode;
};

function WallAnchor({ direction, xz, y, depth, onHover, onClick, children }: WallAnchorProps) {
  const wall = WALLS[direction];
  const inward = INWARD[direction];
  const position = new THREE.Vector3(
    xz.x + inward[0] * depth,
    y,
    xz.z + inward[2] * depth
  );

  return (
    <group position={position} rotation-y={wall.ry}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          onHover(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {children}
      </group>
    </group>
  );
}

function Plaque({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.05]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color={COLORS.ivory} roughness={0.5} />
      </mesh>
      {children}
    </group>
  );
}

// ─── Anchor objects (driven by world graph layout) ──────────────
function TitlePlaque({
  exhibit,
  hovered,
}: {
  exhibit: Exhibit;
  hovered: boolean;
}) {
  return (
    <Plaque width={3.7} height={1.75}>
      <Text
        position={[0, 0.62, 0.09]}
        fontSize={0.11}
        letterSpacing={0.24}
        color={COLORS.accent}
        anchorX="center"
        anchorY="middle"
      >
        EXHIBIT
      </Text>
      <Text
        position={[0, 0.3, 0.09]}
        fontSize={0.42}
        letterSpacing={0.04}
        color={COLORS.ink}
        anchorX="center"
        anchorY="middle"
      >
        {exhibit.title}
      </Text>
      <Text
        position={[0, -0.42, 0.09]}
        fontSize={0.16}
        color={COLORS.inkSoft}
        anchorX="center"
        anchorY="middle"
        maxWidth={3.3}
        textAlign="center"
      >
        {exhibit.tagline}
      </Text>
      <mesh position={[0, -0.78, 0.09]}>
        <planeGeometry args={[2.6, 0.03]} />
        <meshBasicMaterial color={hovered ? COLORS.accent : COLORS.inkSoft} transparent opacity={0.7} />
      </mesh>
    </Plaque>
  );
}

function NotesPlaque({ exhibit }: { exhibit: Exhibit }) {
  return (
    <Plaque width={3.2} height={1.6}>
      <Text
        position={[0, 0.58, 0.09]}
        fontSize={0.1}
        letterSpacing={0.24}
        color={COLORS.accent}
        anchorX="center"
        anchorY="middle"
      >
        CURATOR&apos;S NOTE
      </Text>
      <Text
        position={[0, -0.08, 0.09]}
        fontSize={0.13}
        color={COLORS.ink}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.7}
        textAlign="center"
        lineHeight={1.3}
      >
        {exhibit.curatorNotes}
      </Text>
    </Plaque>
  );
}

function ProjectionScreen({
  exhibit,
  hovered,
}: {
  exhibit: Exhibit;
  hovered: boolean;
}) {
  const src = exhibit.media[0]?.src;
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (tex) => {
        if (cancelled) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 2;
        setTexture(tex);
      },
      undefined,
      () => {
        /* missing media — keep the procedural panel */
      }
    );
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <group>
      <mesh>
        <boxGeometry args={[4.5, 2.7, 0.09]} />
        <meshStandardMaterial
          color={COLORS.frame}
          roughness={0.55}
          emissive={hovered ? COLORS.accent : "#000000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[4.1, 2.3]} />
        {texture ? (
          <meshStandardMaterial map={texture} color="#ffffff" roughness={0.85} metalness={0} />
        ) : (
          <meshStandardMaterial color={COLORS.wall} roughness={0.9} />
        )}
      </mesh>
      {!texture && (
        <>
          <Text
            position={[0, 0.35, 0.09]}
            fontSize={0.26}
            letterSpacing={0.05}
            color={COLORS.ivory}
            anchorX="center"
            anchorY="middle"
            maxWidth={3.6}
            textAlign="center"
          >
            {exhibit.title}
          </Text>
          <Text
            position={[0, -0.35, 0.09]}
            fontSize={0.13}
            color={COLORS.portalText}
            anchorX="center"
            anchorY="middle"
          >
            Projection · media display
          </Text>
        </>
      )}
    </group>
  );
}

function hashId(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function ArtifactSculpture({ exhibitId, hovered, quality }: { exhibitId: string; hovered: boolean; quality: RendererQuality }) {
  const kind = hashId(exhibitId) % 4;
  const accent = [COLORS.accent, COLORS.gold, COLORS.violet, COLORS.teal][hashId(exhibitId) % 4];
  const scale = hovered ? 1.08 : 1;

  return (
    <group position={[0, 1.35, 0]} scale={[scale, scale, scale]}>
      {kind === 0 && (
        <mesh castShadow={quality.shadows}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color={accent} roughness={0.35} metalness={0.15} />
        </mesh>
      )}
      {kind === 1 && (
        <mesh castShadow={quality.shadows}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color={accent} roughness={0.35} metalness={0.15} />
        </mesh>
      )}
      {kind === 2 && (
        <mesh castShadow={quality.shadows}>
          <torusKnotGeometry args={[0.3, 0.1, 48, 8]} />
          <meshStandardMaterial color={accent} roughness={0.35} metalness={0.15} />
        </mesh>
      )}
      {kind === 3 && (
        <group>
          <mesh position={[0, 0, 0]} castShadow={quality.shadows}>
            <boxGeometry args={[0.55, 0.22, 0.55]} />
            <meshStandardMaterial color={accent} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.26, 0]} castShadow={quality.shadows}>
            <boxGeometry args={[0.36, 0.22, 0.36]} />
            <meshStandardMaterial color={COLORS.ivoryDim} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow={quality.shadows}>
            <boxGeometry args={[0.2, 0.22, 0.2]} />
            <meshStandardMaterial color={accent} roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function ArtifactPlinth({
  exhibit,
  artifactIndex,
  exhibitId,
  hovered,
  quality,
}: {
  exhibit: Exhibit;
  artifactIndex: number;
  exhibitId: string;
  hovered: boolean;
  quality: RendererQuality;
}) {
  const artifact = exhibit.artifacts[artifactIndex];

  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow={quality.shadows}>
        <boxGeometry args={[1.05, 0.12, 1.05]} />
        <meshStandardMaterial color={COLORS.frame} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.57, 0]} castShadow={quality.shadows}>
        <boxGeometry args={[0.82, 0.9, 0.82]} />
        <meshStandardMaterial color={COLORS.ivory} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.07, 0]}>
        <boxGeometry args={[0.94, 0.1, 0.94]} />
        <meshStandardMaterial
          color={COLORS.ivoryDim}
          roughness={0.45}
          emissive={hovered ? COLORS.accent : "#000000"}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
      <ArtifactSculpture exhibitId={exhibitId} hovered={hovered} quality={quality} />
      {artifact && (
        <>
          <mesh position={[0, 0.5, 0.44]}>
            <planeGeometry args={[0.78, 0.16]} />
            <meshBasicMaterial color={COLORS.frame} />
          </mesh>
          <Text
            position={[0, 0.5, 0.455]}
            fontSize={0.07}
            color={COLORS.ivory}
            anchorX="center"
            anchorY="middle"
            maxWidth={0.72}
            textAlign="center"
          >
            {artifact.label}
          </Text>
        </>
      )}
    </group>
  );
}

function PortalGlow({ hovered }: { hovered: boolean }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.14;
    material.current.opacity = (hovered ? 0.95 : 0.6) * pulse;
  });
  return (
    <mesh position={[0, 1.2, 0.02]}>
      <planeGeometry args={[1.7, 2.35]} />
      <meshBasicMaterial
        ref={material}
        color={COLORS.portal}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
}

function DoorPortal({
  door,
  hovered,
  onHover,
  onClick,
}: {
  door: Door;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) {
  return (
    <group position={[0, 0, ROOM.depth / 2]} rotation-y={Math.PI}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          onHover(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <mesh position={[-0.95, 1.275, 0.04]}>
          <boxGeometry args={[0.18, 2.55, 0.2]} />
          <meshStandardMaterial color={COLORS.frame} roughness={0.6} />
        </mesh>
        <mesh position={[0.95, 1.275, 0.04]}>
          <boxGeometry args={[0.18, 2.55, 0.2]} />
          <meshStandardMaterial color={COLORS.frame} roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.55, 0.04]}>
          <boxGeometry args={[2.08, 0.18, 0.2]} />
          <meshStandardMaterial color={COLORS.frame} roughness={0.6} />
        </mesh>
        <PortalGlow hovered={hovered} />
        <Text
          position={[0, 2.82, 0.04]}
          fontSize={0.11}
          letterSpacing={0.18}
          color={COLORS.portalText}
          anchorX="center"
          anchorY="middle"
        >
          {door.label.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}

// ─── Camera rig ─────────────────────────────────────────────────
function CameraRig({ view }: { view: View }) {
  const { camera } = useThree();
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const arrived = useRef(false);

  useEffect(() => {
    arrived.current = false;
    if (controls.current) controls.current.enabled = false;
  }, [view]);

  useFrame((_, delta) => {
    if (arrived.current) return;
    const k = Math.min(1, 1 - Math.pow(0.001, delta));
    camera.position.lerp(view.dest, k);
    camera.lookAt(view.lookAt);
    if (camera.position.distanceTo(view.dest) < 0.02) {
      arrived.current = true;
      if (controls.current) {
        controls.current.target.copy(view.lookAt);
        controls.current.enabled = true;
        controls.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={view.lookAt.clone()}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={2.2}
      maxDistance={8}
      minPolarAngle={0.4}
      maxPolarAngle={1.57}
    />
  );
}

// ─── Anchor dispatcher ──────────────────────────────────────────
function AnchorObject({
  direction,
  anchor,
  placement,
  exhibit,
  hovered,
  quality,
  onHover,
  onFocus,
  onInspect,
}: {
  direction: SurfaceDirection;
  anchor: Anchor;
  placement: { entityType: EntityType; entityId: string };
  exhibit: Exhibit;
  hovered: boolean;
  quality: RendererQuality;
  onHover: (id: string, hovered: boolean) => void;
  onFocus: (view: View | null) => void;
  onInspect: (info: InspectInfo) => void;
}) {
  const xz = anchorXZ(direction, anchor.position);
  const setHover = useCallback(
    (h: boolean) => onHover(anchor.id, h),
    [anchor.id, onHover]
  );

  if (placement.entityType === "projection") {
    const y = 2.5;
    return (
      <WallAnchor direction={direction} xz={xz} y={y} depth={0.06} onHover={setHover}
        onClick={() => {
          onFocus(anchorView(direction, xz, y));
          onInspect({ title: exhibit.title, body: exhibit.description, source: "projection" });
        }}>
        <ProjectionScreen exhibit={exhibit} hovered={hovered} />
      </WallAnchor>
    );
  }

  if (placement.entityType === "signage") {
    const isNotes = placement.entityId.endsWith("-notes");
    const y = 2.15;
    return (
      <WallAnchor direction={direction} xz={xz} y={y} depth={0.06} onHover={setHover}
        onClick={() => {
          onFocus(anchorView(direction, xz, y));
          onInspect(
            isNotes
              ? { title: "Curator's note", body: exhibit.curatorNotes, source: "notes" }
              : { title: exhibit.title, body: exhibit.description, source: "title" }
          );
        }}>
        {isNotes ? <NotesPlaque exhibit={exhibit} /> : <TitlePlaque exhibit={exhibit} hovered={hovered} />}
      </WallAnchor>
    );
  }

  const artifactIndex = Math.max(0, parseInt(anchor.id.split("-").pop() ?? "1", 10) - 1);
  const y = 0;
  return (
    <WallAnchor direction={direction} xz={xz} y={y} depth={0.55} onHover={setHover}
      onClick={() => {
        onFocus(anchorView(direction, xz, 1.0));
        const artifact = exhibit.artifacts[artifactIndex];
        onInspect(
          artifact
            ? { title: artifact.label, body: artifact.description, source: "artifact" }
            : { title: exhibit.title, body: exhibit.description, source: "artifact" }
        );
      }}>
      <ArtifactPlinth exhibit={exhibit} artifactIndex={artifactIndex} exhibitId={exhibit.id} hovered={hovered} quality={quality} />
    </WallAnchor>
  );
}

// ─── Scene root ─────────────────────────────────────────────────
export type RoomScene3DProps = {
  layout: SurfaceLayout[];
  doors: Door[];
  entrySurface: SurfaceDirection | null;
  exhibit: Exhibit;
  quality: RendererQuality;
  focus: View | null;
  onFocus: (view: View | null) => void;
  onInspect: (info: InspectInfo) => void;
  onOpenDoor: () => void;
};

export function RoomScene3D({
  layout,
  doors,
  entrySurface,
  exhibit,
  quality,
  focus,
  onFocus,
  onInspect,
  onOpenDoor,
}: RoomScene3DProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const view = useMemo(() => focus ?? defaultView(entrySurface), [focus, entrySurface]);
  const handleHover = useCallback((id: string, hovered: boolean) => {
    setHoveredId(hovered ? id : null);
  }, []);
  const door = doors[0];

  return (
    <>
      <color attach="background" args={[COLORS.void]} />
      <RoomShell />
      <Lights quality={quality} />
      {layout.flatMap((surface) =>
        surface.anchors.map(({ anchor, placement }) => {
          if (!placement) return null;
          return (
            <AnchorObject
              key={anchor.id}
              direction={surface.direction}
              anchor={anchor}
              placement={placement}
              exhibit={exhibit}
              hovered={hoveredId === anchor.id}
              quality={quality}
              onHover={handleHover}
              onFocus={onFocus}
              onInspect={onInspect}
            />
          );
        })
      )}
      {door && (
        <DoorPortal
          door={door}
          hovered={hoveredId === "door"}
          onHover={(h) => handleHover("door", h)}
          onClick={onOpenDoor}
        />
      )}
      <CameraRig view={view} />
    </>
  );
}

// ─── Canvas host (mounts the WebGL scene, lazy-loaded) ──────────
export function Room3DCanvas({ ...sceneProps }: RoomScene3DProps) {
  return (
    <Canvas
      shadows={sceneProps.quality.shadows}
      dpr={[1, sceneProps.quality.maxDpr]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 60, near: 0.1, far: 40, position: [0, 1.7, 6.8] }}
      onPointerMissed={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <Suspense fallback={null}>
        <RoomScene3D {...sceneProps} />
      </Suspense>
    </Canvas>
  );
}
