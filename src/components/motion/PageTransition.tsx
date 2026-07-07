"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { effects } from "@/lib/effects";

/**
 * Transition de page. App Router assumé : on n'anime que l'ENTRÉE de la
 * nouvelle page (pas de délai de sortie).
 * Effet 5 (enablePageMist) : deux nappes pierre (#EFE6D2 puis #E6D7B8
 * ~70 %) qui
 * balaient l'écran avec 60 ms de décalage et se retirent, contenu entrant
 * en fade + translateY(16px), 0.6 s total. Flag coupé → simple voile
 * (comportement chantier 7). Désactivée en reduced-motion.
 */
export default function PageTransition() {
  // usePathname de next/navigation (avec préfixe de locale) : le switch
  // FR/EN déclenche aussi la transition.
  const pathname = usePathname();
  const nappe1Ref = useRef<HTMLDivElement>(null);
  const nappe2Ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nappe1 = nappe1Ref.current;
    const nappe2 = nappe2Ref.current;
    if (!nappe1 || !nappe2) return;
    const main = document.querySelector("main");

    const tl = gsap.timeline();
    if (effects.enablePageMist) {
      tl.set([nappe1, nappe2], { autoAlpha: 1, yPercent: 0 });
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
          0.08,
        );
      }
      // la nappe teintée se retire d'abord, la nappe profonde 60 ms après
      tl.to(
        nappe2,
        { yPercent: -100, duration: 0.54, ease: "power3.inOut" },
        0,
      );
      tl.to(
        nappe1,
        { yPercent: -100, duration: 0.54, ease: "power3.inOut" },
        0.06,
      );
      tl.set([nappe1, nappe2], { autoAlpha: 0, yPercent: 0 });
    } else {
      tl.set(nappe1, { autoAlpha: 1, yPercent: 0 });
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
        nappe1,
        { yPercent: -100, duration: 0.5, ease: "power3.inOut" },
        0.05,
      ).set(nappe1, { autoAlpha: 0, yPercent: 0 });
    }

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={nappe1Ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[65] bg-calcaire opacity-0"
      />
      <div
        ref={nappe2Ref}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[66] bg-sable/70 opacity-0"
      />
    </>
  );
}
