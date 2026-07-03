"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { heroes, frameUrl, type HeroSlot } from "@/lib/heroes";
import ForestLine from "@/components/ForestLine";
import NightLayer from "@/components/effects/NightLayer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const BATCH_SIZE = 20;

type ScrollHeroProps = {
  slot: HeroSlot;
  children: ReactNode;
};

/**
 * Hero vidéo scroll-scrubbed : frames WebP dessinées sur canvas, progression
 * STRICTEMENT liée au scroll (pin + scrub). Si la frame 0001 est absente
 * (frames pas encore générées), bascule sur l'image fallback sans erreur.
 * prefers-reduced-motion : pas de pin ni de scrub, image statique + overlay.
 */
export default function ScrollHero({ slot, children }: ScrollHeroProps) {
  const config = heroes[slot];
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // 'probing' → frames en cours de détection ; 'frames' → canvas actif ;
  // 'fallback' → image statique seule.
  const [mode, setMode] = useState<"probing" | "frames" | "fallback">(
    "probing",
  );
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentIndexRef = useRef(1);
  const progressRef = useRef(0);

  // Dessin cover (ratio préservé, crop centré), DPR cap 2
  const draw = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth * dpr;
    const ch = canvas.clientHeight * dpr;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // Frame chargée la plus proche de l'index demandé (jamais de trou noir)
  const drawNearest = useCallback(
    (index: number) => {
      const images = imagesRef.current;
      if (images[index]) {
        currentIndexRef.current = index;
        draw(images[index]);
        return;
      }
      for (let d = 1; d < config.frameCount; d++) {
        const before = images[index - d];
        if (before) {
          currentIndexRef.current = index - d;
          draw(before);
          return;
        }
        const after = images[index + d];
        if (after) {
          currentIndexRef.current = index + d;
          draw(after);
          return;
        }
      }
    },
    [config.frameCount, draw],
  );

  const drawAtProgress = useCallback(
    (progress: number) => {
      progressRef.current = progress;
      const index = 1 + Math.round(progress * (config.frameCount - 1));
      drawNearest(Math.max(1, Math.min(config.frameCount, index)));
    },
    [config.frameCount, drawNearest],
  );

  // Détection + préchargement progressif des frames
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("fallback");
      return;
    }
    let cancelled = false;
    imagesRef.current = new Array(config.frameCount + 2).fill(null);

    const probe = new window.Image();
    probe.onload = () => {
      if (cancelled) return;
      imagesRef.current[1] = probe;
      setMode("frames");
      drawAtProgress(progressRef.current);
      // chargement en tâche de fond par lots de 20
      let next = 2;
      const loadBatch = () => {
        if (cancelled || next > config.frameCount) return;
        const end = Math.min(next + BATCH_SIZE - 1, config.frameCount);
        let pending = end - next + 1;
        for (let i = next; i <= end; i++) {
          const img = new window.Image();
          img.onload = () => {
            if (cancelled) return;
            imagesRef.current[i] = img;
            // si l'index affiché attendait cette frame, redessine
            const wanted =
              1 +
              Math.round(progressRef.current * (config.frameCount - 1));
            if (Math.abs(wanted - i) < Math.abs(wanted - currentIndexRef.current)) {
              drawNearest(wanted);
            }
            if (--pending === 0) loadBatch();
          };
          img.onerror = () => {
            if (cancelled) return;
            if (--pending === 0) loadBatch();
          };
          img.src = frameUrl(config, i);
        }
        next = end + 1;
      };
      loadBatch();
    };
    probe.onerror = () => {
      // Frames absentes : fallback propre, aucune tentative supplémentaire
      if (!cancelled) setMode("fallback");
    };
    probe.src = frameUrl(config, 1);

    return () => {
      cancelled = true;
    };
  }, [config, drawAtProgress, drawNearest]);

  // Premier dessin dès que le canvas est monté : le probe résout AVANT le
  // rendu conditionnel du canvas, son drawAtProgress initial partait dans
  // le vide — sans ce dessin, la position 0 % montrait le poster seul.
  useEffect(() => {
    if (mode === "frames") drawAtProgress(progressRef.current);
  }, [mode, drawAtProgress]);

  // Redraw au resize
  useEffect(() => {
    if (mode !== "frames") return;
    const onResize = () => drawAtProgress(progressRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mode, drawAtProgress]);

  // Pin + scrub — la mécanique n'est jamais retouchée après ce chantier
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const overlay = overlayRef.current;
        const indicator = indicatorRef.current;
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${(window.innerHeight * config.scrubVh) / 100}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            drawAtProgress(self.progress);
            // fade-out du titre sur les premiers 15 % du scrub
            const t = Math.min(self.progress / 0.15, 1);
            if (overlay) {
              gsap.set(overlay, { autoAlpha: 1 - t, y: -24 * t });
            }
            if (indicator) {
              indicator.style.opacity = self.progress > 0.02 ? "0" : "";
            }
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [config, drawAtProgress] },
  );

  return (
    <section ref={sectionRef} className="relative h-svh overflow-hidden">
      {/* Poster / LCP : le fallback est toujours rendu sous le canvas */}
      <Image
        src={config.fallbackSrc}
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover"
        aria-hidden
      />
      {mode === "frames" && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
      )}

      {/* Couche signature (chantier 8) — au-dessus des frames, sous le
          texte. Insertion de markup uniquement : la mécanique pin/scrub/
          frames ci-dessus n'est pas touchée. */}
      <NightLayer />

      {/* Overlay contenu (fade-out en début de scrub) */}
      <div ref={overlayRef} className="relative z-10 h-full">
        {children}
      </div>

      {/* Indicateur de scroll : fine ligne écume qui pulse */}
      <div
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500 motion-reduce:hidden"
      >
        <span className="hero-scroll-hint block h-12 w-px bg-pin" />
      </div>

      <ForestLine className="pointer-events-none absolute bottom-0 left-0 z-10 h-14 w-full text-[#0b120e] md:h-20" />
    </section>
  );
}
