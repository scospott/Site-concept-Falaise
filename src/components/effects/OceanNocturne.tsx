"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { effects } from "@/lib/effects";

const OceanCanvas = dynamic(() => import("./OceanCanvas"), { ssr: false });

/** Couche statique posée sur le canvas : ligne d'écume au contact
 *  roche/eau et deux écueils (à gauche et au centre-gauche — jamais dans
 *  le cône du soleil, ancré à droite). */
function Ecueils() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
    >
      {/* Ligne d'écume irrégulière au contact roche/eau */}
      <path
        d="M0 52Q60 49 120 51T260 50T420 53T580 50T760 52T940 49T1120 52T1300 50T1440 51"
        fill="none"
        stroke="#F3ECDB"
        strokeWidth="1.6"
        strokeOpacity="0.42"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 57Q90 54 180 56T400 55T640 58T900 55T1180 57T1440 55"
        fill="none"
        stroke="#F3ECDB"
        strokeWidth="1"
        strokeOpacity="0.18"
        vectorEffect="non-scaling-stroke"
      />

      {/* Écueil 1 — à gauche : masse anguleuse, flanc droit dans la lumière */}
      <polygon
        points="128,62 144,40 158,42 174,20 198,26 208,40 222,36 242,62"
        fill="#2B2620"
      />
      <polygon
        points="174,20 198,26 208,40 222,36 242,62 214,62 192,34"
        fill="#4A4031"
      />
      <polygon points="128,62 242,62 222,82 150,79" fill="#141F1A" opacity="0.32" />
      <path
        d="M120 62Q150 67 185 65T250 62"
        fill="none"
        stroke="#F3ECDB"
        strokeWidth="1.8"
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />

      {/* Écueil 2 — centre-gauche, plus bas, plus ramassé */}
      <polygon
        points="462,64 480,46 494,48 508,36 528,44 538,56 552,64"
        fill="#2B2620"
      />
      <polygon points="508,36 528,44 538,56 552,64 528,64 514,44" fill="#4A4031" />
      <polygon points="462,64 552,64 536,80 476,77" fill="#141F1A" opacity="0.3" />
      <path
        d="M454 64Q490 69 522 66T560 64"
        fill="none"
        stroke="#F3ECDB"
        strokeWidth="1.5"
        strokeOpacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Effet 4 — bande océan au couchant au pied du footer (180px). Le footer
 * devient le pied de falaise complet : RockStrata en tête, l'eau en pied.
 * Pause hors viewport, DPR 1 sur mobile. reduced-motion : canvas monté
 * mais figé sur sa première frame (frameloop never), pas d'animation.
 */
export default function OceanNocturne() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    const timer = window.setTimeout(() => setReady(true), 300);
    if (reduced) {
      // Frame unique propre : le canvas se monte, inView reste false.
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!effects.enableOcean) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none relative h-[180px] w-full overflow-hidden transition-opacity duration-[800ms] ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {ready && <OceanCanvas inView={inView} mobile={mobile} />}
      <Ecueils />
    </div>
  );
}
