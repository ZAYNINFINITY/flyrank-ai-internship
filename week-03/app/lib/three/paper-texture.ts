import * as THREE from "three";

let cached: THREE.CanvasTexture | null = null;

/** Procedural paper grain — shared across wall materials in the walkable scene. */
export function getPaperTexture(): THREE.CanvasTexture {
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cached = new THREE.CanvasTexture(canvas);
    return cached;
  }

  ctx.fillStyle = "#2a2e48";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 12000; i++) {
    const v = Math.random();
    ctx.fillStyle = `rgba(255,255,255,${v * 0.055})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }

  for (let y = 0; y < size; y += 4) {
    ctx.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.02})`;
    ctx.fillRect(0, y, size, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  cached = tex;
  return tex;
}
