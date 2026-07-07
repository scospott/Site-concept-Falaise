"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { effects } from "@/lib/effects";

const OceanCanvas = dynamic(() => import("./OceanCanvas"), { ssr: false });

/**
 * Effet 4 — bande océan au couchant au pied du footer (180px). Le footer
 * devient le pied de falaise complet : RockStrata en tête, l'eau en pied.
 * Pause hors viewport, DPR 1 sur mobile, absent en reduced-motion.
 */
export default function OceanNocturne() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    const timer = window.setTimeout(() => setReady(true), 300);
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
    </div>
  );
}
