"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type TimeOfDay = "dawn" | "morning" | "noon" | "dusk" | "night";

const TIME_CONFIG: Record<TimeOfDay, {
  sky: string;
  fog: string;
  sunColor: string;
  sunIntensity: number;
  sunPos: [number, number, number];
  ambientIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
}> = {
  dawn: {
    sky: "#fdd8a8",
    fog: "#f0d4b0",
    sunColor: "#ffb86c",
    sunIntensity: 0.7,
    sunPos: [-6, 2, -8],
    ambientIntensity: 0.35,
    hemiSky: "#f8c888",
    hemiGround: "#8a6a4a",
    hemiIntensity: 0.5,
  },
  morning: {
    sky: "#d4e8f8",
    fog: "#e0e8f0",
    sunColor: "#fff4df",
    sunIntensity: 0.9,
    sunPos: [4, 6, -6],
    ambientIntensity: 0.45,
    hemiSky: "#f0ede6",
    hemiGround: "#d2c4a8",
    hemiIntensity: 0.65,
  },
  noon: {
    sky: "#c8ddf0",
    fog: "#e8e4dc",
    sunColor: "#fff6df",
    sunIntensity: 1.0,
    sunPos: [4, 8, 3],
    ambientIntensity: 0.55,
    hemiSky: "#f0ede6",
    hemiGround: "#d2c4a8",
    hemiIntensity: 0.75,
  },
  dusk: {
    sky: "#e8a878",
    fog: "#d8a888",
    sunColor: "#ff9858",
    sunIntensity: 0.6,
    sunPos: [6, 2, -8],
    ambientIntensity: 0.3,
    hemiSky: "#d89868",
    hemiGround: "#6a4a3a",
    hemiIntensity: 0.45,
  },
  night: {
    sky: "#1a1a2e",
    fog: "#16162a",
    sunColor: "#4466aa",
    sunIntensity: 0.15,
    sunPos: [-2, 6, -4],
    ambientIntensity: 0.12,
    hemiSky: "#2a2a4e",
    hemiGround: "#0a0a1e",
    hemiIntensity: 0.2,
  },
};

function lerpColor(a: string, b: string, t: number): string {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  ca.lerp(cb, t);
  return "#" + ca.getHexString();
}

export function EntranceSky({ time }: { time: TimeOfDay }) {
  const skyRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const fogRef = useRef<THREE.Fog>(null);

  const cfg = TIME_CONFIG[time];

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.color.set(cfg.sunColor);
      sunRef.current.intensity = cfg.sunIntensity;
      sunRef.current.position.set(...cfg.sunPos);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = cfg.ambientIntensity;
    }
    if (hemiRef.current) {
      hemiRef.current.color.set(cfg.hemiSky);
      hemiRef.current.groundColor.set(cfg.hemiGround);
      hemiRef.current.intensity = cfg.hemiIntensity;
    }
  });

  return (
    <>
      {/* Sky dome */}
      <mesh ref={skyRef} position={[0, 0, 5]}>
        <sphereGeometry args={[50, 32, 16]} />
        <meshBasicMaterial color={cfg.sky} side={THREE.BackSide} />
      </mesh>

      {/* Sun / moon */}
      <directionalLight
        ref={sunRef}
        position={cfg.sunPos}
        intensity={cfg.sunIntensity}
        color={cfg.sunColor}
        castShadow={false}
      />

      {/* Ambient fill */}
      <ambientLight ref={ambientRef} intensity={cfg.ambientIntensity} />

      {/* Sky/ground hemisphere */}
      <hemisphereLight
        ref={hemiRef}
        args={[cfg.hemiSky, cfg.hemiGround, cfg.hemiIntensity]}
      />

      {/* Fog tinted to time */}
      <fog attach="fog" args={[cfg.fog, 18, 55]} />

      {/* Ground glow for night (fake moonlight on floor) */}
      {time === "night" && (
        <pointLight position={[0, 0.5, 24]} intensity={0.4} distance={12} color="#6688cc" />
      )}

      {/* Warm glow for dawn/dusk */}
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
      if (positions[i].y < -0.5) {
        positions[i].y = 6 + Math.random() * 2;
        positions[i].x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(positions[i].x, positions[i].y, positions[i].z);
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
      f.x += Math.sin(t * f.wobble + f.phase) * 0.003;
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
    const l: { x: number; y: number; z: number; vy: number; rotSpeed: number; wobble: number; phase: number; color: number }[] = [];
    for (let i = 0; i < count; i++) {
      l.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 7,
        z: 22 + (Math.random() - 0.5) * 12,
        vy: 0.02 + Math.random() * 0.04,
        rotSpeed: 1 + Math.random() * 3,
        wobble: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        color: new THREE.Color(LEAF_COLORS[i % LEAF_COLORS.length]).getHex(),
      });
    }
    return l;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const l = leaves[i];
      l.y -= l.vy * delta * 60;
      l.x += Math.sin(t * l.wobble + l.phase) * 0.008;
      if (l.y < -0.3) {
        l.y = 6 + Math.random() * 2;
        l.x = (Math.random() - 0.5) * 16;
      }
      dummy.position.set(l.x, l.y, l.z);
      dummy.rotation.set(t * l.rotSpeed, t * l.rotSpeed * 0.7, 0);
      dummy.scale.set(0.08, 0.08, 0.08);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 0.6]} />
      <meshStandardMaterial color="#c45a3c" side={THREE.DoubleSide} transparent opacity={0.9} />
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
      <meshStandardMaterial color="#f0b0c8" side={THREE.DoubleSide} transparent opacity={0.8} />
    </instancedMesh>
  );
}

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
