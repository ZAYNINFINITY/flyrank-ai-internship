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

  // Warm cream paper base with a soft vertical tonal drift — pushed a bit
  // stronger than before so the texture itself carries some of the "designed"
  // depth (itom bakes lighting straight into painted textures rather than
  // relying purely on runtime lights, which is part of why his scene never
  // looks accidentally flat or blown-out).
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "#f5efdf");
  gradient.addColorStop(0.5, "#eee6d2");
  gradient.addColorStop(1, "#e2d8bf");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Soft radial vignette — gently darker toward the edges of each tile so
  // walls read as painted panels with depth, not a flat computed color.
  const vignette = ctx.createRadialGradient(
    size / 2, size / 2, size * 0.2,
    size / 2, size / 2, size * 0.75
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(70,58,34,0.09)");
  ctx.fillStyle = vignette;
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
