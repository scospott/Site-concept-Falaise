"use client";

import { useRef } from "react";
import * as THREE from "three";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

/**
 * Effet 4 — surface d'eau de nuit : ondulations horizontales lentes
 * (superposition de sinus + bruit) et chemin de lune central en glints
 * écume. Sobriété absolue : de l'eau qui respire, pas un écran de veille.
 */

const OceanMaterial = shaderMaterial(
  { uTime: 0, uAspect: 8 },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uAspect;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.05;
      // perspective : lignes d'eau resserrées vers le haut (le large)
      float depth = pow(1.0 - uv.y, 1.35);
      // ondulations lentes superposées
      float wave = sin(uv.x * uAspect * 2.2 + t * 1.6 + depth * 26.0) * 0.55
                 + sin(uv.x * uAspect * 4.7 - t * 1.0 + depth * 52.0) * 0.3;
      float n = noise(vec2(uv.x * uAspect * 1.6 + t * 0.7, depth * 34.0 - t * 0.9));
      float shade = 0.5 + 0.5 * sin(depth * 70.0 + wave * 1.8 + n * 4.2);
      vec3 deep = vec3(0.028, 0.055, 0.043);
      vec3 lit  = vec3(0.062, 0.115, 0.092);
      vec3 col = mix(deep, lit, shade * (0.25 + 0.35 * (1.0 - depth)));
      // chemin de lune : colonne centrale de glints qui scintillent
      float moon = smoothstep(0.30, 0.02, abs(uv.x - 0.5));
      float g = noise(vec2(uv.x * uAspect * 14.0, depth * 120.0 - t * 3.2));
      float glint = smoothstep(0.80, 0.96, g) * moon;
      glint *= 0.45 + 0.55 * sin(uTime * 1.1 + uv.x * 60.0 + depth * 140.0);
      col += vec3(0.663, 0.847, 0.776) * max(glint, 0.0) * 0.30;
      // fondu vers le footer en tête de bande
      float alpha = smoothstep(1.0, 0.72, uv.y);
      gl_FragColor = vec4(col, alpha);
    }
  `,
);

extend({ OceanMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    oceanMaterial: ThreeElement<typeof OceanMaterial>;
  }
}

type OceanInstance = InstanceType<typeof OceanMaterial> & { uTime: number };

function OceanPlane() {
  const ref = useRef<OceanInstance>(null);
  const size = useThree((s) => s.size);
  useFrame((state) => {
    if (ref.current) ref.current.uTime = state.clock.elapsedTime;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <oceanMaterial
        key={OceanMaterial.key}
        ref={ref}
        transparent
        depthWrite={false}
        uAspect={size.width / Math.max(size.height, 1)}
      />
    </mesh>
  );
}

export default function OceanCanvas({
  inView,
  mobile,
}: {
  inView: boolean;
  mobile: boolean;
}) {
  return (
    <Canvas
      dpr={mobile ? 1 : [1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={inView ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      <OceanPlane />
    </Canvas>
  );
}
