"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  /** Élément rendu (div par défaut) */
  as?: ElementType;
  className?: string;
  /** Délai avant l'animation, en secondes */
  delay?: number;
  /** Stagger entre les enfants directs, en secondes (0 = bloc entier) */
  stagger?: number;
  /** fade = opacité + translateY ; mask = révélation clip-path */
  variant?: "fade" | "mask";
};

export default function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0,
  variant = "fade",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets: gsap.TweenTarget =
          stagger > 0 && el.children.length > 0
            ? Array.from(el.children)
            : el;

        const from: gsap.TweenVars =
          variant === "mask"
            ? { clipPath: "inset(0% 0% 100% 0%)", y: 16, autoAlpha: 0 }
            : { y: 24, autoAlpha: 0 };
        const to: gsap.TweenVars =
          variant === "mask"
            ? { clipPath: "inset(0% 0% 0% 0%)", y: 0, autoAlpha: 1 }
            : { y: 0, autoAlpha: 1 };

        gsap.fromTo(targets, from, {
          ...to,
          duration: 1,
          ease: "expo.out",
          delay,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: ref, dependencies: [delay, stagger, variant] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
