"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { getLenis } from "@/lib/lenis";
import { effects } from "@/lib/effects";

/**
 * Effet 3 — couche solaire des heros : poussières dorées en suspension dans
 * la lumière (la brume fbm reste disponible derrière son flag, coupée en DA
 * Solaire). Shaders en clip-space : un plane et un nuage de points, zéro
 * post-processing, zéro modèle importé.
 */

const MistMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uScrollVel: 0,
    uIntensity: 0.3,
    uAspect: 1.6,
  },
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
    uniform vec2 uMouse;
    uniform float uScrollVel;
    uniform float uIntensity;
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
    // fbm 4 octaves
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.03 + vec2(17.3, 9.1);
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vec2(vUv.x * uAspect, vUv.y);
      // la brume s'étire légèrement quand on scrolle vite
      float stretch = 1.0 + min(abs(uScrollVel) * 0.015, 0.3);
      float t = uTime * 0.028; // mouvement LENT
      // deux couches de bruit à des vitesses différentes
      vec2 p1 = vec2(uv.x * stretch, uv.y) * 2.1 + vec2(t * 0.9, -t * 0.12);
      vec2 p2 = vec2(uv.x * stretch, uv.y) * 3.4 + vec2(-t * 0.55, t * 0.08);
      float n = fbm(p1) * 0.62 + fbm(p2) * 0.38;
      // la brume s'écarte à peine du curseur
      vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
      float d = distance(uv, m);
      n *= 0.68 + 0.32 * smoothstep(0.05, 0.5, d);
      // plus dense vers le bas du cadre
      float grad = 0.45 + 0.55 * smoothstep(0.0, 0.8, 1.0 - vUv.y);
      float alpha = smoothstep(0.32, 0.92, n) * uIntensity * grad;
      // écru teinté d'une pointe d'écume (7 %)
      vec3 col = mix(vec3(0.925, 0.910, 0.863), vec3(0.663, 0.847, 0.776), 0.07);
      gl_FragColor = vec4(col, alpha);
    }
  `,
);

const FireflyMaterial = shaderMaterial(
  { uTime: 0, uDpr: 1 },
  /* glsl */ `
    attribute float aScale;
    attribute float aOffset;
    attribute vec2 aDrift;
    uniform float uTime;
    uniform float uDpr;
    varying float vAlpha;
    void main() {
      vec3 pos = position;
      // dérive lente ASCENDANTE (poussières dans la lumière), bouclée
      float rise = uTime * (0.010 + 0.018 * aDrift.y);
      pos.y = -1.1 + mod(pos.y + 1.1 + rise, 2.2);
      pos.x += sin(uTime * 0.05 * (0.6 + aDrift.x) * 6.2831 + aOffset * 13.0) * 0.05;
      // scintillement discret
      vAlpha = 0.30 + 0.45 * (0.5 + 0.5 * sin(uTime * (0.5 + aDrift.x) + aOffset * 40.0));
      gl_Position = vec4(pos.xy, 0.0, 1.0);
      gl_PointSize = aScale * uDpr;
    }
  `,
  /* glsl */ `
    precision mediump float;
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float a = smoothstep(0.5, 0.05, length(c)) * vAlpha;
      gl_FragColor = vec4(0.910, 0.776, 0.522, a * 0.6);
    }
  `,
);

extend({ MistMaterial, FireflyMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    mistMaterial: ThreeElement<typeof MistMaterial>;
    fireflyMaterial: ThreeElement<typeof FireflyMaterial>;
  }
}

type MistInstance = InstanceType<typeof MistMaterial> & {
  uTime: number;
  uMouse: THREE.Vector2;
  uScrollVel: number;
};

function Mist({ mobile }: { mobile: boolean }) {
  const ref = useRef<MistInstance>(null);
  const size = useThree((s) => s.size);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      );
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const material = ref.current;
    if (!material) return;
    material.uTime = state.clock.elapsedTime;
    mouse.current.lerp(target.current, 0.025); // lerp très doux
    material.uMouse = mouse.current;
    material.uScrollVel = getLenis()?.velocity ?? 0;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <mistMaterial
        key={MistMaterial.key}
        ref={ref}
        transparent
        depthWrite={false}
        uIntensity={mobile ? 0.2 : 0.3}
        uAspect={size.width / Math.max(size.height, 1)}
      />
    </mesh>
  );
}

type FireflyInstance = InstanceType<typeof FireflyMaterial> & {
  uTime: number;
};

function Fireflies({ mobile }: { mobile: boolean }) {
  const ref = useRef<FireflyInstance>(null);
  const viewport = useThree((s) => s.viewport);
  const count = mobile ? 40 : 100;

  const { positions, scales, offsets, drifts } = useMemo(() => {
    // Génération déterministe (seed) — poussières réparties dans tout le
    // cadre, légèrement plus denses vers le bas de la lumière.
    let seed = 987654321;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    const drifts = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -1.05 + rnd() * 2.1;
      positions[i * 3 + 1] = -1.05 + Math.pow(rnd(), 1.35) * 2.1;
      positions[i * 3 + 2] = 0;
      scales[i] = 1 + rnd() * 1.5; // 1-2.5 px
      offsets[i] = rnd() * 6.2831;
      drifts[i * 2] = rnd();
      drifts[i * 2 + 1] = rnd();
    }
    return { positions, scales, offsets, drifts };
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.uTime = state.clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
        <bufferAttribute attach="attributes-aDrift" args={[drifts, 2]} />
      </bufferGeometry>
      <fireflyMaterial
        key={FireflyMaterial.key}
        ref={ref}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uDpr={Math.min(viewport.dpr, 1.5)}
      />
    </points>
  );
}

export default function NightLayerCanvas({
  inView,
  mobile,
}: {
  inView: boolean;
  mobile: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={inView ? "always" : "never"}
      style={{ position: "absolute", inset: 0 }}
    >
      {effects.enableMist && <Mist mobile={mobile} />}
      {effects.enableFireflies && <Fireflies mobile={mobile} />}
    </Canvas>
  );
}
