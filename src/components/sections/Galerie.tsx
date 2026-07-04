"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { gallery, type GalleryItem } from "@/lib/gallery";
import { getLenis } from "@/lib/lenis";
import Eyebrow from "@/components/Eyebrow";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Lang = "fr" | "en";

// Dimensions desktop par format (hauteurs 300-460, largeurs variées),
// légère variance selon l'index — un rythme de rivage, pas une grille.
function itemSize(item: GalleryItem, i: number) {
  const alt = i % 2 === 0;
  switch (item.format) {
    case "portrait":
      return { w: alt ? 300 : 320, h: alt ? 440 : 460 };
    case "carre":
      return { w: alt ? 360 : 380, h: alt ? 360 : 380 };
    default:
      return { w: alt ? 560 : 520, h: alt ? 360 : 320 };
  }
}

const OFFSETS = [0, 28, -20, 12, -32, 20, -12, 32, -24, 8];

function Plate({
  item,
  locale,
  figureLabel,
  index,
  className,
  spotlight = false,
}: {
  item: GalleryItem;
  locale: Lang;
  figureLabel: string;
  index: number;
  className?: string;
  /** Effet 2 : copie claire révélée par la lanterne (jamais en lightbox) */
  spotlight?: boolean;
}) {
  if (item.image) {
    const img = (extra: string) => (
      <Image
        src={item.image!}
        alt={item.legende[locale]}
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
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
  const plate = (extra: string, withLabel: boolean) => (
    <div
      aria-hidden
      className={`absolute inset-0 flex items-center justify-center ${extra} ${className ?? ""}`}
      style={{ backgroundColor: item.couleur }}
    >
      {withLabel && (
        <span className="text-[11px] tracking-[0.25em] text-encre/40 uppercase">
          {figureLabel} {String(index + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
  if (!spotlight) return plate("", true);
  return (
    <>
      {plate("spotlight-dim", true)}
      {plate("spotlight-lite", true)}
      {plate("spotlight-full", true)}
    </>
  );
}

function Lightbox({
  item,
  index,
  locale,
  onClose,
}: {
  item: GalleryItem;
  index: number;
  locale: Lang;
  onClose: () => void;
}) {
  const t = useTranslations("galerie");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.classList.add("overflow-hidden");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Piège de focus simple : un seul élément focusable (fermer)
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const ratio =
    item.format === "portrait"
      ? "aspect-[3/4] max-w-xl"
      : item.format === "carre"
        ? "aspect-square max-w-2xl"
        : "aspect-[3/2] max-w-4xl";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.legende[locale]}
      data-lenis-prevent
      onClick={onClose}
      className="lightbox-overlay fixed inset-0 z-[70] flex items-center justify-center bg-calcaire/97 p-6"
    >
      <figure
        onClick={(e) => e.stopPropagation()}
        className={`lightbox-panel relative w-full ${ratio}`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[10px] border border-filet">
          <Plate
            item={item}
            locale={locale}
            figureLabel={t("figure")}
            index={index}
          />
        </div>
        <figcaption className="mt-4 flex items-baseline justify-between gap-4">
          <span className="text-sm text-encre/80">{item.legende[locale]}</span>
          <span className="text-[11px] tracking-[0.25em] text-encre/40 uppercase">
            {t("figure")} {String(index + 1).padStart(2, "0")}
          </span>
        </figcaption>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("lightboxClose")}
          className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border border-filet bg-calcaire text-encre transition-colors duration-300 hover:border-pin hover:text-pin"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </figure>
    </div>,
    document.body,
  );
}

/**
 * Galerie « La dérive » — desktop : section pinnée, défilement horizontal
 * scrubbed avec micro-parallaxe interne (containerAnimation) ; mobile et
 * reduced-motion : grille 2 colonnes rythmée. Lightbox commune.
 */
export default function Galerie() {
  const t = useTranslations("galerie");
  const locale = useLocale() as Lang;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          motionOK: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motionOK } = ctx.conditions as {
            desktop: boolean;
            motionOK: boolean;
          };
          if (!desktop || !motionOK) return;
          const pin = pinRef.current;
          const track = trackRef.current;
          if (!pin || !track) return;

          const distance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Micro-parallaxe interne ±4 % pendant la traversée
          track
            .querySelectorAll<HTMLElement>(".galerie-parallax")
            .forEach((inner) => {
              gsap.fromTo(
                inner,
                { xPercent: -4 },
                {
                  xPercent: 4,
                  ease: "none",
                  scrollTrigger: {
                    containerAnimation: tween,
                    trigger: inner,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                },
              );
            });
        },
      );
    },
    { scope: sectionRef },
  );

  const header = (
    <>
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <SectionTitle className="mt-4">{t("title")}</SectionTitle>
    </>
  );

  return (
    <section id="galerie" ref={sectionRef} className="relative scroll-mt-24">
      {/* Desktop avec motion : piste horizontale pinnée */}
      <div className="hidden bg-sable motion-safe:lg:block">
        <div
          ref={pinRef}
          className="flex h-svh flex-col justify-center overflow-hidden"
        >
          <div className="mx-auto w-full max-w-6xl px-10">
            {header}
            <p className="mt-3 text-xs tracking-wide text-encre/40">
              {t("hint")}
            </p>
          </div>
          <div
            ref={trackRef}
            className="mt-14 flex items-center gap-14 pr-[10vw] pl-[8vw] will-change-transform"
          >
            {gallery.map((item, i) => {
              const { w, h } = itemSize(item, i);
              return (
                <div
                  key={item.id}
                  className="shrink-0"
                  style={{ width: w, marginTop: OFFSETS[i] }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    aria-label={t("lightboxOpen", {
                      legende: item.legende[locale],
                    })}
                    aria-haspopup="dialog"
                    data-cursor="view"
                    className="spotlight-wrap group relative block w-full overflow-hidden rounded-[10px] border border-filet transition-colors duration-500 hover:border-pin/40"
                    style={{ height: h }}
                  >
                    <div className="galerie-parallax absolute inset-y-0 -left-[6%] w-[112%]">
                      <Plate
                        item={item}
                        locale={locale}
                        figureLabel={t("figure")}
                        index={i}
                        spotlight
                      />
                    </div>
                  </button>
                  <p className="mt-3 text-[11px] tracking-wide text-encre/60">
                    {item.legende[locale]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile (toujours) + desktop reduced-motion : deux colonnes en
          maçonnerie (pas de rangées alignées — pas de trous), colonne
          droite décalée */}
      <div className="bg-sable motion-safe:lg:hidden"><div className="mx-auto max-w-6xl px-6 py-28 md:px-10">
        <Reveal>{header}</Reveal>
        <div className="mt-12 flex gap-4 md:gap-6">
          {[0, 1].map((col) => (
            <div
              key={col}
              className={`flex min-w-0 flex-1 flex-col gap-6 ${
                col === 1 ? "mt-10" : ""
              }`}
            >
              {gallery
                .map((item, i) => ({ item, i }))
                .filter(({ i }) => i % 2 === col)
                .map(({ item, i }) => (
                  <Reveal key={item.id}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(i)}
                      aria-label={t("lightboxOpen", {
                        legende: item.legende[locale],
                      })}
                      aria-haspopup="dialog"
                      className={`relative block w-full overflow-hidden rounded-[10px] border border-filet ${
                        item.format === "portrait"
                          ? "aspect-[3/4]"
                          : item.format === "carre"
                            ? "aspect-square"
                            : "aspect-[3/2]"
                      }`}
                    >
                      <Plate
                        item={item}
                        locale={locale}
                        figureLabel={t("figure")}
                        index={i}
                      />
                    </button>
                    <p className="mt-2 text-[11px] tracking-wide text-encre/60">
                      {item.legende[locale]}
                    </p>
                  </Reveal>
                ))}
            </div>
          ))}
        </div>
      </div>
      </div>

      {openIndex !== null && (
        <Lightbox
          item={gallery[openIndex]}
          index={openIndex}
          locale={locale}
          onClose={close}
        />
      )}
    </section>
  );
}
