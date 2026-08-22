"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createBodyGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(0.5, 0.32, 0.88, 2, 2, 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Round the body slightly
    const r = 1 - 0.15 * Math.pow(Math.abs(x) / 0.25, 2);
    pos.setY(i, y * r);
    // Taper the rear
    if (z < -0.2) {
      pos.setX(i, x * 0.85);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function createHeadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.18, 12, 10);
  geo.scale(1, 0.95, 1.05);
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

  const catColor = "#3a3a3a";
  const bellyColor = "#5a5a5a";
  const eyeColor = "#88cc44";
  const noseColor = "#d47070";

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
