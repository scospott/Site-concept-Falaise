"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * Transition de page (App Router : on n'anime que l'ENTRÉE de la nouvelle
 * page) — voile nuit qui balaie + contenu entrant en fade/translateY.
 * Désactivée en reduced-motion. Upgradée en nappe de brume au chantier 8.
 */
export default function PageTransition() {
  // usePathname de next/navigation (avec préfixe de locale) : le switch
  // FR/EN déclenche aussi la transition.
  const pathname = usePathname();
  const veilRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const veil = veilRef.current;
    if (!veil) return;
    const main = document.querySelector("main");

    const tl = gsap.timeline();
    tl.set(veil, { autoAlpha: 1, yPercent: 0 });
    if (main) {
      tl.fromTo(
        main,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
        },
        0.05,
      );
    }
    tl.to(
      veil,
      { yPercent: -100, duration: 0.5, ease: "power3.inOut" },
      0.05,
    ).set(veil, { autoAlpha: 0, yPercent: 0 });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={veilRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[65] bg-[#0d1511] opacity-0"
    />
  );
}
