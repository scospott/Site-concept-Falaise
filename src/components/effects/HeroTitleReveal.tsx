"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { effects } from "@/lib/effects";

gsap.registerPlugin(useGSAP);

/**
 * Effet 1 — titre-condensation : au chargement du hero accueil, chaque
 * ligne du H1 ([data-hero-line]) se condense hors de la brume
 * (blur 14px → net, letter-spacing resserré), stagger 120 ms, UNE fois au
 * load. L'eyebrow et la baseline ([data-hero-fade]) suivent en fade simple.
 * Exception assumée à la règle transform/opacity : le blur est autorisé ICI
 * uniquement (animation unique au load, aucun scroll-scrub dessus).
 */
export default function HeroTitleReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!effects.enableTitleReveal) return;
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = root.querySelectorAll("[data-hero-line]");
        const rest = root.querySelectorAll("[data-hero-fade]");
        if (lines.length === 0) return;
        gsap.fromTo(
          lines,
          { filter: "blur(14px)", autoAlpha: 0, letterSpacing: "0.045em" },
          {
            filter: "blur(0px)",
            autoAlpha: 1,
            letterSpacing: "0.005em",
            duration: 1.6,
            ease: "expo.out",
            stagger: 0.12,
            clearProps: "filter,letterSpacing",
          },
        );
        gsap.fromTo(
          rest,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.55,
            stagger: 0.15,
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
