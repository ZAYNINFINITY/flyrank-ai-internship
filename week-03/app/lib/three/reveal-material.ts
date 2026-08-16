import * as THREE from "three";
import { extend } from "@react-three/fiber";

/**
 * RevealMaterial — brush-stroke sketch→paint reveal, adapted from the MIT
 * itomdev.com technique (https://github.com/ITomPoland/portfolio-itom).
 *
 * Only the DISCARD logic is customized: color/lighting stay 100% standard
 * MeshBasicMaterial. As `uProgress` (0..1) grows, pixels are discarded from
 * bottom to top with a noisy brush edge, revealing the painted plane behind.
 * The noise is squared (`res*res`) exactly like the source so the edge reads
 * as a brush stroke: blotchy where the "paint" catches, clean where it skips.
 *
 * Usage:
 *   const mat = new RevealMaterial({ map: sketchTex, transparent: true, alphaTest: 0.5 });
 *   mat.uProgress = 0.4;   // setter pushes into the compiled shader
 */
export class RevealMaterial extends THREE.MeshBasicMaterial {
  private _uProgress = 0;
  private _shader: THREE.WebGLProgramParametersWithUniforms | null = null;

  constructor(params: THREE.MeshBasicMaterialParameters = {}) {
    super(params);
    this.customProgramCacheKey = () => "RevealMaterial_p2";
    this.onBeforeCompile = this.onBeforeCompileImpl.bind(this);
  }

  get uProgress() {
    return this._uProgress;
  }

  set uProgress(value: number) {
    this._uProgress = value;
    if (this._shader) this._shader.uniforms.uProgress.value = value;
  }

  private onBeforeCompileImpl(shader: THREE.WebGLProgramParametersWithUniforms) {
    this._shader = shader;
    shader.uniforms.uProgress = { value: this._uProgress };

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      /* glsl */ `#include <common>
        uniform float uProgress;
        float revealRand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        float revealNoise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u * u * (3.0 - 2.0 * u);
          float res = mix(
            mix(revealRand(ip), revealRand(ip + vec2(1.0, 0.0)), u.x),
            mix(revealRand(ip + vec2(0.0, 1.0)), revealRand(ip + vec2(1.0, 1.0)), u.x),
            u.y
          );
          return res * res;
        }
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <alphatest_fragment>",
      /* glsl */ `#include <alphatest_fragment>
        if (uProgress > 0.001) {
          float rn = revealNoise(vMapUv * 15.0) * 0.15;
          float maskValue = (1.0 - vMapUv.y) + rn;
          if (maskValue < uProgress * 1.5) discard;
        }
      `
    );
  }
}

extend({ RevealMaterial });

export type { THREE };
