"use client";

import { useEffect, useRef } from "react";
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
 * Effet 4 v2 — mer au pied de la falaise, au couchant. Houle en PERSPECTIVE
 * (vaguelettes fines et serrées près de l'horizon, larges et espacées vers
 * le bas), cône du soleil ancré à droite qui s'élargit vers le bas, patchs
 * de teinte organiques. Sobriété : de l'eau qui respire, pas un écran de
 * veille. (uv.y = 1 en haut de bande : le contact roche/eau.)
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
      float horiz = uv.y; // 1 = contact roche (le large), 0 = bord bas (proche)

      // Rangées en perspective : fréquence qui explose près de l'horizon
      float rows = 14.0 / (1.06 - horiz);

      // (a) houle : vaguelettes horizontales organiques, dérive lente
      float n1 = noise(vec2(uv.x * uAspect * (1.1 + 1.7 * horiz), rows + t * 2.0));
      float mod1 = 0.5 + 0.5 * noise(vec2(uv.x * uAspect * 0.7 - t * 0.8, rows * 0.13));
      float crest = smoothstep(0.55, 0.8, n1) * mod1;

      // fond + patchs de teinte lents et organiques
      vec3 col = vec3(0.118, 0.227, 0.192);            // #1E3A31
      float p1 = smoothstep(0.55, 0.88, noise(uv * vec2(2.3, 1.4) + vec2(t * 0.6, -t * 0.4)));
      float p2 = smoothstep(0.58, 0.9, noise(uv * vec2(1.6, 2.1) + vec2(-t * 0.45, t * 0.3) + 7.3));
      col = mix(col, vec3(0.133, 0.259, 0.227), p1 * 0.55); // #22423A
      col = mix(col, vec3(0.102, 0.204, 0.173), p2 * 0.5);  // #1A342C
      col = mix(col, vec3(0.180, 0.306, 0.255), crest * (0.3 + 0.35 * (1.0 - horiz))); // #2E4E41

      // (b) cône du soleil ancré à droite : apex à l'horizon, s'élargit en bas
      float d = abs(uv.x - 0.78);
      float coneW = mix(0.34, 0.05, horiz);
      float cone = smoothstep(coneW, coneW * 0.22, d);
      float core = smoothstep(coneW * 0.45, 0.0, d);
      // glints horizontaux (étirés en x, rangées perspectives)
      float g = noise(vec2(uv.x * uAspect * 3.6, rows * 1.7 - t * 2.6));
      float g2 = noise(vec2(uv.x * uAspect * 6.5 + 31.7, rows * 2.3 + t * 2.0));
      // scintillement individuel lent (phase tirée du bruit)
      float tw = 0.5 + 0.5 * sin(uTime * (0.5 + g) + g * 47.0);
      float tw2 = 0.4 + 0.6 * sin(uTime * 1.3 + g2 * 61.0);
      float glint = smoothstep(0.7, 0.92, g) * tw;
      float spark = smoothstep(0.78, 0.96, g2) * tw2;
      float dens = 0.06 + 0.94 * cone;
      col += vec3(0.914, 0.737, 0.424) * glint * dens * 0.5;   // #E9BC6C
      col += vec3(0.961, 0.851, 0.635) * spark * core * 0.6;   // #F5D9A2

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
  const advance = useThree((s) => s.advance);
  // frameloop "never" ne rend rien du tout au montage (invalidate y est
  // ignoré) : advance() force UNE frame — reduced-motion = océan figé sur
  // cette frame propre, uTime ~ 0.
  useEffect(() => {
    advance(0);
  }, [advance]);
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
