"use client";

import { Fragment, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Eyebrow from "@/components/Eyebrow";
import SectionTitle from "@/components/SectionTitle";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Mots qui s'allument en écume plutôt qu'en écru
const KEYWORDS: Record<string, string[]> = {
  fr: ["forêt", "océan", "seuil"],
  en: ["forest", "ocean", "threshold"],
};

const FIGURE_KEYS = ["rooms", "surface", "sleeps", "cliff"] as const;

function isKeyword(word: string, keywords: string[]): boolean {
  const clean = word.toLowerCase().replace(/[.,;:!?«»()]/g, "");
  return keywords.some((k) => clean === k || clean.endsWith(`'${k}`) || clean.includes(k));
}

/**
 * Section « La villa » — le manifeste qui s'allume : chaque mot passe de
 * galet #3E4A42 à écru (mots-clés → écume) sur une timeline scrubbed liée
 * à la traversée de la section. Split manuel en spans (texte intact au SSR,
 * gestion sûre des mots-clés accentués).
 */
export default function Manifeste() {
  const t = useTranslations("villa");
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  const words = useMemo(() => t("manifesto").split(/\s+/), [t]);
  const keywords = KEYWORDS[locale] ?? KEYWORDS.fr;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // La lumière gagne sur le noir à mesure qu'on scrolle
        gsap.to(section.querySelectorAll<HTMLElement>(".manifeste-word"), {
          color: (_i, el) =>
            (el as HTMLElement).dataset.accent ? "#A9D8C6" : "#ECE8DC",
          ease: "none",
          stagger: 0.35,
          duration: 3,
          scrollTrigger: {
            trigger: section.querySelector(".manifeste-texte"),
            start: "top 78%",
            end: "bottom 42%",
            scrub: true,
          },
        });
        // Filets verticaux des chiffres clés : se tracent au reveal
        gsap.from(section.querySelectorAll(".figure-sep"), {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section.querySelector(".figures"),
            start: "top 85%",
            once: true,
          },
        });
        gsap.from(section.querySelectorAll(".figure-item"), {
          autoAlpha: 0,
          y: 20,
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: section.querySelector(".figures"),
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="villa"
      ref={sectionRef}
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:px-10 md:py-40"
    >
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <SectionTitle className="mt-4">{t("title")}</SectionTitle>

      <p
        lang={locale}
        className="manifeste-texte mt-12 max-w-[28ch] font-display text-[clamp(1.4rem,2.8vw,2rem)] leading-[1.5]"
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className="manifeste-word"
              data-accent={isKeyword(word, keywords) || undefined}
            >
              {word}
            </span>{" "}
          </Fragment>
        ))}
      </p>

      <div className="figures mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:items-stretch">
        {FIGURE_KEYS.map((key, i) => (
          <Fragment key={key}>
            {i > 0 && (
              <span
                aria-hidden
                className="figure-sep mx-10 hidden w-px self-stretch bg-filet md:block"
              />
            )}
            <div className="figure-item">
              <p className="font-display text-[26px] text-encre">
                {t(`figures.${key}.value`)}
              </p>
              <p className="eyebrow mt-2">{t(`figures.${key}.label`)}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
