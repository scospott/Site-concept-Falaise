"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { espaces } from "@/lib/espaces";
import Eyebrow from "@/components/Eyebrow";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";

type Lang = "fr" | "en";

function Visuel({
  couleur,
  image,
  nom,
  label,
  className,
  spotlight = false,
}: {
  couleur: string;
  image?: string;
  nom: string;
  label: string;
  className?: string;
  /** Effet 2 : copie claire révélée par la lanterne (panneau desktop) */
  spotlight?: boolean;
}) {
  if (image) {
    const img = (extra: string) => (
      <Image
        src={image}
        alt={nom}
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className={`object-cover ${extra} ${className ?? ""}`}
      />
    );
    if (!spotlight) return img("");
    return (
      <>
        {img("spotlight-dim")}
        <div aria-hidden className="spotlight-lite absolute inset-0">
          {img("")}
        </div>
        <div aria-hidden className="spotlight-full absolute inset-0">
          {img("")}
        </div>
      </>
    );
  }
  const plate = (extra: string) => (
    <div
      aria-hidden
      className={`absolute inset-0 flex items-center justify-center ${extra} ${className ?? ""}`}
      style={{ backgroundColor: couleur }}
    >
      <span className="eyebrow opacity-40">{label}</span>
    </div>
  );
  if (!spotlight) return plate("");
  return (
    <>
      {plate("spotlight-dim")}
      {plate("spotlight-lite")}
      {plate("spotlight-full")}
    </>
  );
}

/**
 * Section « Les espaces » — desktop : liste Bodoni à gauche, panneau visuel
 * sticky à droite révélé par wipe clip-path ; mobile : cartes empilées.
 * Navigation clavier : le focus déclenche le même comportement que le hover.
 */
export default function Espaces() {
  const t = useTranslations("espaces");
  const locale = useLocale() as Lang;
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const zRef = useRef(1);

  const { contextSafe } = useGSAP({ scope: sectionRef });

  const activate = contextSafe((index: number) => {
    setActive((prev) => {
      if (prev === index) return prev;
      const panel = panelRef.current;
      const layer = panel?.querySelector<HTMLElement>(
        `[data-layer="${index}"]`,
      );
      if (layer) {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        zRef.current += 1;
        layer.style.zIndex = String(zRef.current);
        if (reduced) {
          gsap.set(layer, { clipPath: "inset(0% 0% 0% 0%)" });
        } else {
          gsap.fromTo(
            layer,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.6,
              ease: "expo.out",
            },
          );
          if (descRef.current) {
            gsap.fromTo(
              descRef.current,
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
            );
          }
        }
      }
      return index;
    });
  });

  return (
    <section
      id="espaces"
      ref={sectionRef}
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-36 md:px-10 md:py-48"
    >
      <Reveal>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionTitle className="mt-6">{t("title")}</SectionTitle>
      </Reveal>

      {/* Desktop ≥1024 : liste + panneau sticky */}
      <div className="mt-20 hidden gap-16 lg:grid lg:grid-cols-2">
        <ul className="flex flex-col gap-2">
          {espaces.map((espace, i) => (
            <li key={espace.id}>
              <button
                type="button"
                onMouseEnter={() => activate(i)}
                onFocus={() => activate(i)}
                onClick={() => activate(i)}
                aria-current={active === i}
                className={`group flex w-full items-baseline gap-4 py-3 text-left font-display text-[clamp(2rem,3.6vw,3.1rem)] transition-all duration-500 ease-luxe ${
                  active === i
                    ? "translate-x-2 text-encre"
                    : "text-encre/75 hover:translate-x-2 hover:text-encre"
                }`}
              >
                <span
                  className={`font-sans text-xs tracking-[0.2em] transition-opacity duration-500 ${
                    active === i ? "text-soleil opacity-100" : "opacity-0"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {espace.nom[locale]}
              </button>
            </li>
          ))}
        </ul>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            ref={panelRef}
            className="spotlight-wrap relative aspect-[4/3] overflow-hidden rounded-[10px] border border-filet"
          >
            {espaces.map((espace, i) => (
              <div
                key={espace.id}
                data-layer={i}
                className="absolute inset-0"
                style={{
                  clipPath:
                    i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                  zIndex: i === 0 ? 1 : 0,
                }}
              >
                <Visuel
                  couleur={espace.couleur}
                  image={espace.image}
                  nom={espace.nom[locale]}
                  label={t("visualLabel")}
                  spotlight
                />
              </div>
            ))}
          </div>
          <div ref={descRef} className="mt-6">
            <p className="max-w-md text-[17px] leading-[1.65] text-encre/75">
              {espaces[active].description[locale]}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile : cartes empilées */}
      <div className="mt-16 flex flex-col gap-12 lg:hidden">
        {espaces.map((espace, i) => (
          <Reveal key={espace.id}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-filet">
              <Visuel
                couleur={espace.couleur}
                image={espace.image}
                nom={espace.nom[locale]}
                label={t("visualLabel")}
              />
            </div>
            <p className="mt-5 flex items-baseline gap-3 font-display text-3xl text-encre">
              <span className="font-sans text-xs tracking-[0.2em] text-soleil">
                {String(i + 1).padStart(2, "0")}
              </span>
              {espace.nom[locale]}
            </p>
            <p className="mt-2 text-[17px] leading-[1.65] text-encre/75">
              {espace.description[locale]}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
