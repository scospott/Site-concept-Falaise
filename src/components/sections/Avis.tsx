"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import { avis, type Avis as AvisType } from "@/lib/avis";
import Eyebrow from "@/components/Eyebrow";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

type Lang = "fr" | "en";

function Stars({ label, className }: { label: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`flex gap-1 text-ecume ${className ?? ""}`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2.5l2.95 6.02 6.55.62-4.9 4.45 1.4 6.51L12 16.9l-6 3.2 1.4-6.51-4.9-4.45 6.55-.62z"
          />
        </svg>
      ))}
    </span>
  );
}

function initiales(nom: string): string {
  return nom
    .split(/[\s&]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

function Carte({ item, locale }: { item: AvisType; locale: Lang }) {
  const t = useTranslations("avis");
  return (
    <article className="flex h-full w-[340px] shrink-0 snap-start flex-col rounded-[10px] border border-filet bg-sousbois p-6 transition-all duration-500 ease-luxe hover:-translate-y-[3px] hover:border-ecume/45 md:w-[380px]">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ecume font-display text-sm text-nuit"
        >
          {initiales(item.nom)}
        </span>
        <div>
          <p className="text-sm text-ecru">{item.nom}</p>
          <p className="eyebrow !text-[10px]">{item.ville[locale]}</p>
        </div>
      </div>
      <Stars label={t("stars")} className="mt-4" />
      <blockquote lang={item.lang} className="mt-3 text-sm text-ecru/80">
        {item.texte}
      </blockquote>
    </article>
  );
}

/**
 * Section « Ce qu'ils en disent » — bandeau récap (4,96 · étoiles · 87
 * séjours · badge) puis carousel : drag inertiel + flèches ghost +
 * indicateur fine ligne écume sur desktop, scroll-snap natif sur mobile.
 */
export default function Avis() {
  const t = useTranslations("avis");
  const locale = useLocale() as Lang;
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  const { contextSafe } = useGSAP(
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
          const track = trackRef.current;
          const viewport = viewportRef.current;
          if (!track || !viewport) return;

          const maxScroll = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);

          const updateProgress = () => {
            const x = Number(gsap.getProperty(track, "x"));
            const p = maxScroll() > 0 ? -x / maxScroll() : 0;
            if (progressRef.current) {
              gsap.set(progressRef.current, {
                scaleX: Math.max(0.06, Math.min(1, p)),
              });
            }
          };

          const [draggable] = Draggable.create(track, {
            type: "x",
            bounds: { minX: -maxScroll(), maxX: 0 },
            inertia: true,
            edgeResistance: 0.82,
            cursor: "grab",
            activeCursor: "grabbing",
            onDrag: updateProgress,
            onThrowUpdate: updateProgress,
          });
          draggableRef.current = draggable;
          updateProgress();

          const onResize = () => {
            draggable.applyBounds({ minX: -maxScroll(), maxX: 0 });
            updateProgress();
          };
          window.addEventListener("resize", onResize);
          return () => {
            window.removeEventListener("resize", onResize);
            draggableRef.current = null;
          };
        },
      );
    },
    { scope: sectionRef },
  );

  const shift = contextSafe((direction: 1 | -1) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const draggable = draggableRef.current;
    if (!track || !viewport) return;
    const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const step = viewport.clientWidth * 0.7;
    const current = Number(gsap.getProperty(track, "x"));
    const target = Math.max(-maxScroll, Math.min(0, current - direction * step));
    gsap.to(track, {
      x: target,
      duration: 0.65,
      ease: "power3.out",
      onUpdate: () => {
        draggable?.update();
        const p = maxScroll > 0 ? -Number(gsap.getProperty(track, "x")) / maxScroll : 0;
        if (progressRef.current) {
          gsap.set(progressRef.current, {
            scaleX: Math.max(0.06, Math.min(1, p)),
          });
        }
      },
    });
  });

  return (
    <section
      id="avis"
      ref={sectionRef}
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:px-10 md:py-40"
    >
      <Reveal>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionTitle className="mt-4">{t("title")}</SectionTitle>
      </Reveal>

      {/* Bandeau récap */}
      <Reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
        <p className="font-display text-[56px] leading-none text-ecru">
          {t("note")}
        </p>
        <div className="flex flex-col gap-2">
          <Stars label={t("stars")} />
          <p className="text-sm text-ecru/60">{t("stays")}</p>
        </div>
        <span className="rounded-full border border-ecume/40 px-4 py-1.5 text-xs tracking-wide text-ecume">
          {t("badge")}
        </span>
        <span className="basis-full text-xs text-ecru/40">
          {t("originalNote")}
        </span>
      </Reveal>

      {/* Desktop motion : carousel drag */}
      <div className="mt-14 hidden motion-safe:lg:block">
        <div ref={viewportRef} className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex cursor-grab items-stretch gap-6 will-change-transform"
          >
            {avis.map((item) => (
              <Carte key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="h-px w-56 bg-filet">
            <div
              ref={progressRef}
              className="h-px origin-left bg-ecume"
              style={{ transform: "scaleX(0.06)" }}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label={t("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ecru/30 text-ecru transition-colors duration-300 hover:border-ecume hover:text-ecume"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  d="M10 2L4 8l6 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label={t("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ecru/30 text-ecru transition-colors duration-300 hover:border-ecume hover:text-ecume"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                <path
                  d="M6 2l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile + reduced-motion : scroll-snap natif */}
      <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-6 px-6 pb-4 motion-safe:lg:hidden">
        {avis.map((item) => (
          <Carte key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </section>
  );
}
