"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { effects } from "@/lib/effects";

// three et la scène ne sont JAMAIS dans le bundle initial : chunk séparé,
// chargé côté client uniquement.
const NightLayerCanvas = dynamic(() => import("./NightLayerCanvas"), {
  ssr: false,
});

/**
 * Effet 3 — couche « lumière vivante » des heros (poussières dorées ; brume
 * coupée en DA Solaire), montée PAR-DESSUS le canvas de frames et SOUS
 * l'overlay texte du ScrollHero.
 * LCP intouchable : montage 300 ms après le first paint + fade-in 0.8s.
 * reduced-motion : non montée. Rendu en pause hors viewport
 * (IntersectionObserver → frameloop 'never').
 */
export default function NightLayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // effets absents — pas montés du tout
    }
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    const timer = window.setTimeout(() => setReady(true), 300);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!effects.enableMist && !effects.enableFireflies) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[5] transition-opacity duration-[800ms] ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {ready && <NightLayerCanvas inView={inView} mobile={mobile} />}
    </div>
  );
}
