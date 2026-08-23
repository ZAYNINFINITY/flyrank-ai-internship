"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createBodyGeometry(): THREE.BufferGeometry {
  // Higher subdivision (was 2,2,2) so the squircle rounding below has
  // enough vertices to actually read as curved instead of faceted —
  // this was the main source of the "boxy, Minecraft cat" look.
  const geo = new THREE.BoxGeometry(0.46, 0.3, 0.86, 10, 8, 14);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const hw = 0.23;
  const hh = 0.15;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Superellipse-style rounding on BOTH axes (was Y-only), which is
    // what actually produces a rounded cross-section rather than a box
    // with slightly squashed top/bottom.
    const nx = x / hw;
    const ny = y / hh;
    const r = 1 - 0.22 * Math.pow(Math.abs(nx), 2.2) - 0.12 * Math.pow(Math.abs(ny), 2.2);
    pos.setX(i, x * Math.max(r, 0.55));
    pos.setY(i, y * Math.max(r, 0.6));
    // Taper the rear more gradually (was a hard cutoff at z < -0.2).
    const rearT = THREE.MathUtils.clamp((-z - 0.05) / 0.4, 0, 1);
    pos.setX(i, pos.getX(i) * (1 - rearT * 0.22));
    pos.setY(i, pos.getY(i) * (1 - rearT * 0.08));
    // Slight neck taper toward the front — reads as a defined head/neck
    // line instead of a uniform capsule.
    const frontT = THREE.MathUtils.clamp((z - 0.28) / 0.16, 0, 1);
    pos.setX(i, pos.getX(i) * (1 - frontT * 0.3));
  }
  geo.computeVertexNormals();
  return geo;
}

function createHeadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.17, 20, 16);
  geo.scale(1, 0.92, 1.02);
  return geo;
}

function createEarGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.04, 0.1);
  shape.lineTo(-0.04, 0.1);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  return geo;
}

function createTailCurve(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.15, -0.44),
    new THREE.Vector3(0, 0.25, -0.58),
    new THREE.Vector3(0, 0.4, -0.62),
    new THREE.Vector3(0.02, 0.52, -0.55),
  ]);
}

export function MuseumCat({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const leftEarRef = useRef<THREE.Mesh>(null);
  const rightEarRef = useRef<THREE.Mesh>(null);

  const bodyGeo = useMemo(() => createBodyGeometry(), []);
  const headGeo = useMemo(() => createHeadGeometry(), []);
  const earGeo = useMemo(() => createEarGeometry(), []);
  const tailCurve = useMemo(() => createTailCurve(), []);
  const tailGeo = useMemo(() => new THREE.TubeGeometry(tailCurve, 12, 0.03, 6, false), [tailCurve]);

  const catColor = "#1c1c1e";
  const bellyColor = "#38383a";
  const eyeColor = "#9ad35a";
  const noseColor = "#c96a6a";

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Gentle breathing
    if (groupRef.current) {
      groupRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.015;
    }

    // Tail sway
    if (tailRef.current) {
      tailRef.current.rotation.x = Math.sin(t * 0.8) * 0.12;
      tailRef.current.rotation.z = Math.sin(t * 0.6 + 0.5) * 0.08;
    }

    // Ear twitch (random ear, every ~4 seconds)
    if (leftEarRef.current && rightEarRef.current) {
      const earTwitch = Math.sin(t * 8) > 0.97 ? 0.15 : 0;
      leftEarRef.current.rotation.z = earTwitch;
      rightEarRef.current.rotation.z = -earTwitch;
    }
  });

  const legPositions: [number, number, number][] = [
    [-0.16, 0.12, 0.28],   // front left
    [0.16, 0.12, 0.28],    // front right
    [-0.16, 0.12, -0.28],  // back left
    [0.16, 0.12, -0.28],   // back right
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh geometry={bodyGeo} position={[0, 0.3, 0]}>
        <meshStandardMaterial color={catColor} roughness={0.85} />
      </mesh>

      {/* Belly (slightly lighter) */}
      <mesh position={[0, 0.22, 0.02]}>
        <boxGeometry args={[0.38, 0.18, 0.6]} />
        <meshStandardMaterial color={bellyColor} roughness={0.9} />
      </mesh>

      {/* Head */}
      <mesh geometry={headGeo} position={[0, 0.52, 0.36]}>
        <meshStandardMaterial color={catColor} roughness={0.85} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.07, 0.55, 0.52]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.07, 0.55, 0.52]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.07, 0.55, 0.545]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.07, 0.55, 0.545]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.51, 0.54]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color={noseColor} roughness={0.6} />
      </mesh>

      {/* Whiskers (thin lines) */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.06, 0.5, 0.54]} rotation-z={side * 0.1}>
            <boxGeometry args={[0.12, 0.003, 0.003]} />
            <meshBasicMaterial color="#888888" />
          </mesh>
          <mesh position={[side * 0.06, 0.49, 0.54]} rotation-z={side * -0.05}>
            <boxGeometry args={[0.11, 0.003, 0.003]} />
            <meshBasicMaterial color="#888888" />
          </mesh>
        </group>
      ))}

      {/* Ears */}
      <mesh ref={leftEarRef} position={[-0.1, 0.66, 0.34]} rotation={[0.3, 0, 0.2]}>
        <primitive object={earGeo} attach="geometry" />
        <meshStandardMaterial color={catColor} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={rightEarRef} position={[0.1, 0.66, 0.34]} rotation={[0.3, 0, -0.2]}>
        <primitive object={earGeo} attach="geometry" />
        <meshStandardMaterial color={catColor} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner ears (pink) */}
      <mesh position={[-0.1, 0.66, 0.35]} rotation={[0.3, 0, 0.2]}>
        <boxGeometry args={[0.025, 0.06, 0.01]} />
        <meshStandardMaterial color="#c07070" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.1, 0.66, 0.35]} rotation={[0.3, 0, -0.2]}>
        <boxGeometry args={[0.025, 0.06, 0.01]} />
        <meshStandardMaterial color="#c07070" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Legs */}
      {legPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.045, 0.24, 8]} />
            <meshStandardMaterial color={catColor} roughness={0.85} />
          </mesh>
          {/* Paw */}
          <mesh position={[0, -0.12, 0.01]}>
            <sphereGeometry args={[0.048, 6, 6]} />
            <meshStandardMaterial color={bellyColor} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Tail */}
      <mesh ref={tailRef} geometry={tailGeo}>
        <meshStandardMaterial color={catColor} roughness={0.85} />
      </mesh>
    </group>
  );
}
