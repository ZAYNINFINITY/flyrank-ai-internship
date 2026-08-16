import * as THREE from "three";

let cached: THREE.CanvasTexture | null = null;

/**
 * Procedural warm paper grain — the sketchbook base for every wall in the
 * walkable scene. Kept fully procedural (no bundled image assets) and cached
 * once across materials.
 */
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

  // Warm cream paper base with a soft vertical tonal drift.
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "#f2ecdd");
  gradient.addColorStop(1, "#eae3cf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Fine mottled grain — darker fiber specks and lighter brights.
  for (let i = 0; i < 14000; i++) {
    const dark = Math.random() < 0.5;
    const alpha = dark ? 0.035 * Math.random() : 0.028 * Math.random();
    ctx.fillStyle = dark ? `rgba(90,80,60,${alpha})` : `rgba(255,252,240,${alpha})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }

  // Sparse paper fibers — short faint strokes.
  ctx.strokeStyle = "rgba(120,108,80,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 6 + Math.random() * 18;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (Math.random() - 0.5) * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  cached = tex;
  return tex;
}
