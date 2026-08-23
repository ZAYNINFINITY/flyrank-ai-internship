"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import * as THREE from "three";

const CAT_OBJ_PATH = "/models/cat/Cat_v1_L3.123cb1b1943a-2f48-4e44-8f71-6bbe19a3ab64/12221_Cat_v1_l3.obj";
const CAT_MTL_PATH = "/models/cat/Cat_v1_L3.123cb1b1943a-2f48-4e44-8f71-6bbe19a3ab64/12221_Cat_v1_l3.mtl";

let catModelPromise: Promise<THREE.Group> | null = null;

function loadCatModel(): Promise<THREE.Group> {
  if (!catModelPromise) {
    catModelPromise = new Promise<THREE.Group>((resolve, reject) => {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(
        CAT_MTL_PATH,
        (materials) => {
          materials.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load(
            CAT_OBJ_PATH,
            (obj) => {
              // Compute bounding box to normalize scale and position
              const box = new THREE.Box3().setFromObject(obj);
              const size = box.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              // Target ~0.35m tall (same scale as the procedural cat was)
              const targetHeight = 0.35;
              const scaleFactor = maxDim > 0 ? targetHeight / size.y : 1;
              obj.scale.setScalar(scaleFactor);
              // Recompute after scaling
              const scaledBox = new THREE.Box3().setFromObject(obj);
              const scaledSize = scaledBox.getSize(new THREE.Vector3());
              // Center the model horizontally, ground it vertically
              obj.position.set(
                -(scaledBox.min.x + scaledSize.x / 2),
                -scaledBox.min.y,
                -(scaledBox.min.z + scaledSize.z / 2)
              );
              resolve(obj);
            },
            undefined,
            (err) => {
              // If MTL-based load fails, try loading OBJ only with default material
              console.warn("[MuseumCat] MTL load failed, trying OBJ-only:", err);
              const fallbackLoader = new OBJLoader();
              fallbackLoader.load(
                CAT_OBJ_PATH,
                (obj) => {
                  const box = new THREE.Box3().setFromObject(obj);
                  const size = box.getSize(new THREE.Vector3());
                  const scaleFactor = size.y > 0 ? 0.35 / size.y : 1;
                  obj.scale.setScalar(scaleFactor);
                  const scaledBox = new THREE.Box3().setFromObject(obj);
                  const scaledSize = scaledBox.getSize(new THREE.Vector3());
                  obj.position.set(
                    -(scaledBox.min.x + scaledSize.x / 2),
                    -scaledBox.min.y,
                    -(scaledBox.min.z + scaledSize.z / 2)
                  );
                  // Apply a dark cat-like material to all meshes
                  obj.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                      child.material = new THREE.MeshStandardMaterial({
                        color: "#2a2a2e",
                        roughness: 0.85,
                      });
                    }
                  });
                  resolve(obj);
                },
                undefined,
                reject
              );
            }
          );
        },
        undefined,
        () => {
          // MTL file not found, try OBJ-only fallback
          const fallbackLoader = new OBJLoader();
          fallbackLoader.load(
            CAT_OBJ_PATH,
            (obj) => {
              const box = new THREE.Box3().setFromObject(obj);
              const size = box.getSize(new THREE.Vector3());
              const scaleFactor = size.y > 0 ? 0.35 / size.y : 1;
              obj.scale.setScalar(scaleFactor);
              const scaledBox = new THREE.Box3().setFromObject(obj);
              const scaledSize = scaledBox.getSize(new THREE.Vector3());
              obj.position.set(
                -(scaledBox.min.x + scaledSize.x / 2),
                -scaledBox.min.y,
                -(scaledBox.min.z + scaledSize.z / 2)
              );
              obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: "#2a2a2e",
                    roughness: 0.85,
                  });
                }
              });
              resolve(obj);
            },
            undefined,
            reject
          );
        }
      );
    });
  }
  return catModelPromise;
}

export function MuseumCat({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let alive = true;
    loadCatModel()
      .then((source) => {
        if (!alive) return;
        const clone = source.clone(true);
        setModel(clone);
      })
      .catch((err) => {
        console.warn("[MuseumCat] failed to load OBJ cat model:", err);
        catModelPromise = null;
      });
    return () => {
      alive = false;
    };
  }, []);

  // Gentle breathing animation
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.015;
    }
  });

  if (!model) return null;

  return (
    <group ref={groupRef} position={position}>
      <primitive object={model} />
    </group>
  );
}
