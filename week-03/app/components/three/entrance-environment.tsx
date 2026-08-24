"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type TimeOfDay = "dawn" | "morning" | "noon" | "dusk" | "night";

const TIME_CONFIG: Record<TimeOfDay, {
  sky: string;
  skyTop: string;
  skyHorizon: string;
  fog: string;
  sunColor: string;
  sunGlowColor: string;
  sunIntensity: number;
  sunPos: [number, number, number];
  ambientIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  starsVisible: number;
}> = {
  dawn: {
    sky: "#fdd8a8",
    skyTop: "#7b8fb0",
    skyHorizon: "#fdd8a8",
    fog: "#f0d4b0",
    sunColor: "#ffb86c",
    sunGlowColor: "#ffcf8f",
    sunIntensity: 0.7,
    sunPos: [-6, 2, -8],
    ambientIntensity: 0.35,
    hemiSky: "#f8c888",
    hemiGround: "#8a6a4a",
    hemiIntensity: 0.5,
    starsVisible: 0,
  },
  morning: {
    sky: "#d4e8f8",
    skyTop: "#5f9fdb",
    skyHorizon: "#d4e8f8",
    fog: "#e0e8f0",
    sunColor: "#fff4df",
    sunGlowColor: "#fff8e8",
    sunIntensity: 0.9,
    sunPos: [4, 6, -6],
    ambientIntensity: 0.45,
    hemiSky: "#f0ede6",
    hemiGround: "#d2c4a8",
    hemiIntensity: 0.65,
    starsVisible: 0,
  },
  noon: {
    sky: "#c8ddf0",
    skyTop: "#3f7fd1",
    skyHorizon: "#cfe4f5",
    fog: "#e8e4dc",
    sunColor: "#fff6df",
    sunGlowColor: "#fffcf0",
    sunIntensity: 1.0,
    sunPos: [4, 8, 3],
    ambientIntensity: 0.55,
    hemiSky: "#f0ede6",
    hemiGround: "#d2c4a8",
    hemiIntensity: 0.75,
    starsVisible: 0,
  },
  dusk: {
    sky: "#e8a878",
    skyTop: "#4a4a7a",
    skyHorizon: "#e8a878",
    fog: "#d8a888",
    sunColor: "#ff9858",
    sunGlowColor: "#ffab6e",
    sunIntensity: 0.6,
    sunPos: [6, 2, -8],
    ambientIntensity: 0.3,
    hemiSky: "#d89868",
    hemiGround: "#6a4a3a",
    hemiIntensity: 0.45,
    starsVisible: 0.3,
  },
  night: {
    sky: "#1a1a2e",
    skyTop: "#05050f",
    skyHorizon: "#242448",
    fog: "#16162a",
    sunColor: "#4466aa",
    sunGlowColor: "#9db4e8",
    sunIntensity: 0.15,
    sunPos: [-2, 6, -4],
    ambientIntensity: 0.12,
    hemiSky: "#2a2a4e",
    hemiGround: "#0a0a1e",
    hemiIntensity: 0.2,
    starsVisible: 1,
  },
};

const SKY_VERTEX_SHADER = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SKY_FRAGMENT_SHADER = `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition + offset).y;
    gl_FragColor = vec4(mix(horizonColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
  }
`;

function SkyGradient({ topColor, horizonColor }: { topColor: string; horizonColor: string }) {
  // Uniforms are rebuilt whenever the time-of-day colors change (useMemo
  // deps), so there's nothing to re-apply every frame — the old per-frame
  // .set() calls were pure redundant work on the render loop.
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color(topColor) },
      horizonColor: { value: new THREE.Color(horizonColor) },
      offset: { value: 8 },
      exponent: { value: 0.55 },
    }),
    [topColor, horizonColor]
  );

  return (
    <mesh position={[0, 0, 5]}>
      <sphereGeometry args={[50, 32, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={SKY_VERTEX_SHADER}
        fragmentShader={SKY_FRAGMENT_SHADER}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
}

function SunDisc({
  direction,
  color,
  glowColor,
  intensity,
}: {
  direction: [number, number, number];
  color: string;
  glowColor: string;
  intensity: number;
}) {
  const dir = useMemo(() => new THREE.Vector3(...direction).normalize(), [direction]);
  const radius = 46;
  const pos: [number, number, number] = [dir.x * radius, dir.y * radius, 5 + dir.z * radius];
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={groupRef} position={pos}>
      <mesh>
        <circleGeometry args={[5.5, 32]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.16 * intensity} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[2.6, 32]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.32 * intensity} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[1.15, 32]} />
        <meshBasicMaterial color={color} transparent opacity={Math.min(1, intensity + 0.3)} depthWrite={false} />
      </mesh>
    </group>
  );
}

function MoonDisc({ position }: { position: [number, number, number] }) {
  const dir = useMemo(() => new THREE.Vector3(...position).normalize(), [position]);
  const radius = 46;
  const pos: [number, number, number] = [dir.x * radius, dir.y * radius, 5 + dir.z * radius];
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={groupRef} position={pos}>
      {/* Soft outer glow — paler than sun */}
      <mesh>
        <circleGeometry args={[4.5, 32]} />
        <meshBasicMaterial color="#c8c4d8" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Mid glow */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[2.2, 32]} />
        <meshBasicMaterial color="#d8d4e0" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Core — pale grey-white, not blue */}
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[1.1, 32]} />
        <meshBasicMaterial color="#e8e6f0" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      {/* Faint craters — 3 small dots */}
      {[
        [-0.35, 0.3, 0.025],
        [0.2, -0.15, 0.025],
        [0.45, 0.1, 0.025],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <circleGeometry args={[0.12, 12]} />
          <meshBasicMaterial color="#c0bcc8" transparent opacity={0.35} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* eslint-disable react-hooks/purity, react-hooks/immutability -- particle
   systems use one-time Math.random init in useMemo and imperative
   InstancedMesh mutation in useFrame. Standard R3F pattern. */
function Stars({ visibility }: { visibility: number }) {
  const count = 220;
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.85);
      const r = 47;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = 5 + r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  if (visibility <= 0.01) return null;

  // Opacity is declarative on the material — no per-frame writes needed.
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#f4f2ff"
        size={0.32}
        transparent
        opacity={visibility}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Procedural clouds ─────
// One soft-puff canvas texture shared by every cloud. Each cloud is a
// billboard plane orbiting slowly overhead; tint/opacity track time of day
// so dusk gets warm clouds and night keeps only faint dark ones.
let CLOUD_TEXTURE: THREE.CanvasTexture | null = null;

function getCloudTexture(): THREE.CanvasTexture {
  if (CLOUD_TEXTURE) return CLOUD_TEXTURE;
  const s = 512;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, s, s);
    // Overlapping radial-gradient blobs form a cumulus puff
    const blobs: Array<[number, number, number]> = [
      [0.5, 0.62, 0.26],
      [0.33, 0.54, 0.19],
      [0.67, 0.52, 0.21],
      [0.43, 0.4, 0.17],
      [0.58, 0.37, 0.15],
      [0.25, 0.62, 0.13],
      [0.76, 0.6, 0.12],
    ];
    for (const [bx, by, br] of blobs) {
      const grad = ctx.createRadialGradient(s * bx, s * by, 0, s * bx, s * by, s * br);
      grad.addColorStop(0, "rgba(255,255,255,0.85)");
      grad.addColorStop(0.6, "rgba(255,255,255,0.35)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s * bx, s * by, s * br, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  CLOUD_TEXTURE = new THREE.CanvasTexture(canvas);
  return CLOUD_TEXTURE;
}

const CLOUD_TINT: Record<TimeOfDay, { color: string; opacity: number }> = {
  dawn: { color: "#f6cdb2", opacity: 0.35 },
  morning: { color: "#ffffff", opacity: 0.45 },
  noon: { color: "#ffffff", opacity: 0.55 },
  dusk: { color: "#eda57c", opacity: 0.4 },
  night: { color: "#464662", opacity: 0.12 },
};

function Clouds({ time }: { time: TimeOfDay }) {
  const { camera } = useThree();
  const tint = CLOUD_TINT[time];
  const tex = getCloudTexture();

  const clouds = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i / 6) * Math.PI * 2 + Math.random() * 0.7,
        speed: 0.004 + Math.random() * 0.004,
        radius: 40 + Math.random() * 4,
        height: 22 + Math.random() * 8,
        scale: 4.5 + Math.random() * 2.5,
        opacityJitter: 0.55 + Math.random() * 0.25,
      })),
    []
  );

  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);

  // Only transforms live in the render loop. Tint/opacity are declarative
  // props below — R3F diffs and applies them on time-of-day changes, so the
  // old per-frame hex parsing (mat.color.set) is gone entirely.
  useFrame((_, delta) => {
    clouds.forEach((cloud, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      cloud.angle += delta * cloud.speed;
      mesh.position.set(
        Math.cos(cloud.angle) * cloud.radius,
        cloud.height,
        5 + Math.sin(cloud.angle) * cloud.radius
      );
      mesh.quaternion.copy(camera.quaternion);
    });
  });

  return (
    <>
      {clouds.map((cloud, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          scale={cloud.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={tex}
            color={tint.color}
            transparent
            opacity={tint.opacity * cloud.opacityJitter}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
    </>
  );
}

export function EntranceSky({ time }: { time: TimeOfDay }) {
  // All light properties are declarative below (args/props carry the
  // time-of-day values directly), so nothing needs imperative per-frame
  // writes — the old useFrame here was redundant work 60×/sec.
  const cfg = TIME_CONFIG[time];

  return (
    <>
      <SkyGradient topColor={cfg.skyTop} horizonColor={cfg.skyHorizon} />
      {time === "night" ? (
        <MoonDisc position={cfg.sunPos} />
      ) : (
        <SunDisc
          direction={cfg.sunPos}
          color={cfg.sunColor}
          glowColor={cfg.sunGlowColor}
          intensity={cfg.sunIntensity}
        />
      )}
      <directionalLight
        args={[cfg.sunColor, cfg.sunIntensity]}
        position={cfg.sunPos}
      />
      <ambientLight intensity={cfg.ambientIntensity} />
      <hemisphereLight
        args={[cfg.hemiSky, cfg.hemiGround, cfg.hemiIntensity]}
      />
      <fog attach="fog" args={[cfg.fog, 18, 55]} />
      <Clouds time={time} />
      <Stars visibility={cfg.starsVisible} />
      {time === "night" && (
        <pointLight position={[0, 0.5, 24]} intensity={0.4} distance={12} color="#6688cc" />
      )}
      {(time === "dawn" || time === "dusk") && (
        <pointLight position={[0, 1, 24]} intensity={0.6} distance={15} color={time === "dawn" ? "#ffcc88" : "#ff8855"} />
      )}
    </>
  );
}

export type Season = "spring" | "summer" | "autumn" | "winter";

const LEAF_COLORS = ["#c45a3c", "#d4783a", "#b86830", "#a85828", "#d89048"];
const BLOSSOM_COLORS = ["#f0b0c8", "#e8a0b8", "#f8c0d8", "#f0c8d8", "#e090a8"];

function RainSystem() {
  const count = 200;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const WIND_X = 0.09;
  const tiltAngle = Math.atan2(WIND_X, 0.2);

  const velocities = useMemo(() => {
    const v: number[] = [];
    for (let i = 0; i < count; i++) v.push(0.15 + Math.random() * 0.25);
    return v;
  }, []);

  const positions = useMemo(() => {
    const p: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 8,
        z: 22 + (Math.random() - 0.5) * 12,
      });
    }
    return p;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      positions[i].y -= velocities[i] * delta * 60;
      positions[i].x += WIND_X * delta * 60 * (velocities[i] / 0.3);
      if (positions[i].y < -0.5) {
        positions[i].y = 6 + Math.random() * 2;
        positions[i].x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
      dummy.rotation.set(0, 0, -tiltAngle);
      dummy.scale.set(0.015, 0.3, 0.015);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshBasicMaterial color="#8ab4d8" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function SnowSystem() {
  const count = 150;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const flakes = useMemo(() => {
    const f: { x: number; y: number; z: number; vx: number; vy: number; wobble: number; phase: number }[] = [];
    for (let i = 0; i < count; i++) {
      f.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 8,
        z: 22 + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.02,
        vy: 0.03 + Math.random() * 0.06,
        wobble: Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return f;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const f = flakes[i];
      f.y -= f.vy * delta * 60;
      f.x += (f.vx + Math.sin(t * f.wobble + f.phase) * 0.003) * delta * 60;
      if (f.y < -0.5) {
        f.y = 6 + Math.random() * 2;
        f.x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(f.x, f.y, f.z);
      const s = 0.04 + Math.random() * 0.02;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#f0f0f8" transparent opacity={0.85} />
    </instancedMesh>
  );
}

function AutumnLeaves() {
  const count = 30;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const leaves = useMemo(() => {
    const l: { x: number; y: number; z: number; vy: number; vx: number; rotSpeed: number; rotSpeedX: number; wobble: number; phase: number; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      l.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 7,
        z: 22 + (Math.random() - 0.5) * 12,
        vy: 0.02 + Math.random() * 0.04,
        vx: (Math.random() - 0.5) * 0.02 + 0.015,
        rotSpeed: 1 + Math.random() * 3,
        rotSpeedX: 0.6 + Math.random() * 2.4,
        wobble: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        size: 0.06 + Math.random() * 0.06,
      });
    }
    return l;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      ref.current.setColorAt(i, new THREE.Color(LEAF_COLORS[i % LEAF_COLORS.length]));
    }
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const l = leaves[i];
      l.y -= l.vy * delta * 60;
      l.x += (l.vx + Math.sin(t * l.wobble + l.phase) * 0.008) * delta * 60;
      if (l.y < -0.3) {
        l.y = 6 + Math.random() * 2;
        l.x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(l.x, l.y, l.z);
      dummy.rotation.set(t * l.rotSpeedX, t * l.rotSpeed * 0.7, t * l.rotSpeed * 0.4);
      dummy.scale.set(l.size, l.size, l.size);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 0.6]} />
      <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.9} />
    </instancedMesh>
  );
}

function SpringBlossoms() {
  const count = 40;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petals = useMemo(() => {
    const p: { x: number; y: number; z: number; vy: number; wobble: number; phase: number; rotSpeed: number }[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 7,
        z: 22 + (Math.random() - 0.5) * 12,
        vy: 0.01 + Math.random() * 0.03,
        wobble: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: 0.5 + Math.random() * 2,
      });
    }
    return p;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      ref.current.setColorAt(i, new THREE.Color(BLOSSOM_COLORS[i % BLOSSOM_COLORS.length]));
    }
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = petals[i];
      p.y -= p.vy * delta * 60;
      p.x += Math.sin(t * p.wobble + p.phase) * 0.006;
      if (p.y < -0.3) {
        p.y = 6 + Math.random() * 2;
        p.x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.5, t * p.rotSpeed * 0.3);
      const s = 0.05 + Math.sin(t + i) * 0.01;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 6]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#f8d0e0"
        emissiveIntensity={0.15}
        side={THREE.DoubleSide}
        transparent
        opacity={0.82}
      />
    </instancedMesh>
  );
}
/* eslint-enable react-hooks/purity, react-hooks/immutability */

export function SeasonalWeather({ season }: { season: Season }) {
  return (
    <>
      {season === "winter" && <SnowSystem />}
      {season === "autumn" && <AutumnLeaves />}
      {season === "spring" && <SpringBlossoms />}
      {season === "summer" && <RainSystem />}
    </>
  );
}
