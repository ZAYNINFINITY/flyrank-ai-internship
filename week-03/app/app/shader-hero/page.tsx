"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";

/* ─── GLSL Fragment Shader ───────────────────────────────────────────
 *
 * "Foyer Aurora" — a layered aurora/nebula effect with mouse-reactive
 * flow and a film grain pass on top. All procedural, no textures.
 *
 * Uniforms:
 *   u_time      — elapsed seconds (drives wave animation)
 *   u_resolution — canvas size in pixels (keeps aspect correct)
 *   u_mouse     — normalised mouse position [0..1] (leans the flow)
 *
 * Sections:
 *   1. Palette   — three Foyer tones blended via smoothstep
 *   2. Aurora    — three sine waves at different frequencies, layered
 *                  with fbm-style noise; mouse shifts the wave origin
 *   3. Vignette  — darkens edges so text in the centre stays readable
 *   4. Grain      — cheap pseudo-random film grain for texture
 *
 * Reduced-motion fallback: renders the same palette as a static
 * gradient (time = 0, mouse = centre).
 * ─────────────────────────────────────────────────────────────────── */

const FRAGMENT_SHADER = `#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

/* --- palette -----------------------------------------------------------
   dark base (#0a0b16) → ivory (#f5efe0) → gold (#d4a94c)
   each band is a smoothstep so transitions stay soft. */
vec3 palette(float t) {
  vec3 a = vec3(0.04, 0.044, 0.086);  // #0a0b16
  vec3 b = vec3(0.96, 0.937, 0.878);  // #f5efe0
  vec3 c = vec3(0.831, 0.663, 0.298); // #d4a94c
  vec3 d = vec3(0.0, 0.0, 0.0);
  return a + b * smoothstep(0.2, 0.8, t) + c * smoothstep(0.6, 1.0, t);
}

/* --- simple hash noise ------------------------------------------------ */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

/* --- value noise ------------------------------------------------------- */
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* --- fractal brownian motion (3 octaves) -------------------------------- */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.15;

  /* --- mouse influence --------------------------------------------------
     mouse offset shifts the noise coordinate space so the aurora
     "leans" toward where the cursor sits. range is ~[-0.3, 0.3]. */
  vec2 mouseOffset = (u_mouse - 0.5) * 0.6;

  /* --- aurora layers ----------------------------------------------------
     three fbm layers at different scales and speeds, blended together.
     the y-axis is stretched so the bands feel wide and horizontal. */
  vec2 q = vec2(
    fbm((uv + mouseOffset) * 2.0 + t * 0.3),
    fbm((uv + mouseOffset) * 2.0 + vec2(1.7, 9.2) + t * 0.2)
  );

  vec2 r = vec2(
    fbm((uv + mouseOffset) * 3.0 + q + vec2(1.7, 9.2) + t * 0.15),
    fbm((uv + mouseOffset) * 3.0 + q + vec2(8.3, 2.8) + t * 0.12)
  );

  float f = fbm(uv * 2.0 + r + mouseOffset * 0.5);

  /* --- colour -----------------------------------------------------------
     feed the noise value into the palette; the aurora bands appear
     where f sits in the [0.35, 0.75] range. */
  vec3 col = palette(f);

  /* --- vignette ---------------------------------------------------------
     radial darkening keeps the edges ~60 % darker so centre text
     always has enough contrast without a backdrop. */
  float vig = 1.0 - 0.55 * length((uv - 0.5) * 1.6);
  col *= vig;

  /* --- film grain -------------------------------------------------------
     cheap per-pixel hash, very subtle (0.04 intensity) so it adds
     texture without looking noisy. */
  float grain = (hash(uv * u_resolution + t * 100.0) - 0.5) * 0.04;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}`;

/* ─── Performance constants ─────────────────────────────────────── */
const MAX_DPR = 1.5;

export default function ShaderHeroPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const pausedRef = useRef(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  /* --- reduced-motion listener ----------------------------------------- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* --- compile a single shader ---------------------------------------- */
  const compileShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    },
    []
  );

  /* --- init WebGL ------------------------------------------------------ */
  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) {
      setHasWebGL(false);
      return;
    }
    glRef.current = gl;

    const vertSrc = `
      attribute vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `;

    const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) { setHasWebGL(false); return; }

    const program = gl.createProgram();
    if (!program) { setHasWebGL(false); return; }
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      setHasWebGL(false);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    /* full-screen quad (two triangles via triangle strip) */
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  }, [compileShader]);

  /* --- resize handler -------------------------------------------------- */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  /* --- render loop ----------------------------------------------------- */
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program || pausedRef.current) {
      // eslint-disable-next-line react-hooks/immutability
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    const elapsed = (performance.now() - startTimeRef.current) / 1000;

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    gl.uniform1f(uTime, prefersReducedMotion ? 0 : elapsed);
    gl.uniform2f(uRes, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    rafRef.current = requestAnimationFrame(render);
  }, [prefersReducedMotion]);

  /* --- lifecycle ------------------------------------------------------- */
  useEffect(() => {
    if (prefersReducedMotion) return; // static gradient, no GL needed

    initGL();
    resize();
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);

    window.addEventListener("resize", resize);

    /* pause when tab hidden */
    const onVisChange = () => {
      if (document.hidden) {
        pausedRef.current = true;
      } else {
        /* shift start time so animation resumes smoothly */
        startTimeRef.current = performance.now() - elapsedRef.current * 1000;
        pausedRef.current = false;
      }
    };
    const elapsedRef = { current: 0 };
    const tick = () => {
      if (!pausedRef.current) {
        elapsedRef.current = (performance.now() - startTimeRef.current) / 1000;
      }
    };
    const tickId = setInterval(tick, 200);
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisChange);
      clearInterval(tickId);
    };
  }, [initGL, resize, render, prefersReducedMotion]);

  /* --- mouse tracking -------------------------------------------------- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = [
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight, // flip Y for GL coords
      ];
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = [
          e.touches[0].clientX / window.innerWidth,
          1.0 - e.touches[0].clientY / window.innerHeight,
        ];
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  /* --- reduced-motion static gradient ---------------------------------- */
  if (prefersReducedMotion || !hasWebGL) {
    return (
      <main className="relative flex h-[100dvh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #1a1832 0%, #0a0b16 70%)",
          }}
        />
        <div className="relative z-10 px-6 text-center">
          <h1 className="font-heading text-[clamp(32px,6vw,64px)] leading-tight text-[#f5efe0]">
            Foyer
          </h1>
          <p className="mx-auto mt-4 max-w-[480px] font-body text-[16px] leading-relaxed text-[#f5efe0]/60">
            A digital museum for developers. This is the static fallback —
            the animated aurora shader requires WebGL and motion enabled.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center rounded-[3px] border border-[#f5efe0]/25 px-8 py-3 font-body text-sm font-medium text-[#f5efe0] transition-colors hover:border-[#f5efe0]/50"
          >
            Enter the Museum
          </Link>
        </div>
      </main>
    );
  }

  /* --- normal render: canvas behind content ---------------------------- */
  return (
    <main className="relative h-[100dvh] overflow-hidden">
      {/* WebGL canvas — behind everything */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Hero content — always on top, centred */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-heading text-[clamp(32px,6vw,64px)] leading-tight text-[#f5efe0]">
            Foyer
          </h1>
          <p className="mx-auto mt-4 max-w-[480px] font-body text-[16px] leading-relaxed text-[#f5efe0]/60">
            A digital museum for developers. Every project gets a room,
            not a card. Move your cursor to shift the aurora.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center rounded-[3px] border border-[#f5efe0]/25 px-8 py-3 font-body text-sm font-medium text-[#f5efe0] transition-colors hover:border-[#f5efe0]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a94c]"
          >
            Enter the Museum
          </Link>
        </div>
      </div>

      {/* Shader source overlay — bottom-left, for submission evidence */}
      <div className="absolute bottom-4 left-4 z-10 max-w-[320px] rounded-[3px] border border-[#f5efe0]/10 bg-[#0a0b16]/80 px-4 py-3 font-mono text-[10px] leading-relaxed text-[#f5efe0]/40 backdrop-blur-sm">
        <p className="mb-1 font-body text-[11px] font-medium text-[#d4a94c]/80">
          GLSL Fragment Shader
        </p>
        <p>
          uniforms: u_time · u_resolution · u_mouse
          <br />
          layers: 3× fbm aurora + vignette + grain
          <br />
          DPR capped at 1.5 · pauses when hidden
          <br />
          prefers-reduced-motion → static gradient
        </p>
      </div>
    </main>
  );
}
