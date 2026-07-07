"use client";

import { useLocale, useTranslations } from "next-intl";
import { avis, categoriesAvis, type Avis as AvisType } from "@/lib/avis";
import Eyebrow from "@/components/Eyebrow";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";

type Lang = "fr" | "en";

function Stars({ label, className }: { label: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`flex gap-1 text-soleil ${className ?? ""}`}
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

/** Branche de laurier dessinée maison — trait miel, feuilles alternées. */
function Laurier({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 34 96"
      aria-hidden="true"
      focusable="false"
      className={`h-20 w-7 text-soleil md:h-24 md:w-8 ${
        flip ? "-scale-x-100 rotate-[8deg]" : "rotate-[-8deg]"
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M27 90 C 16 74, 12 52, 19 8" />
      <path d="M24 78 C 15 76, 9 70, 7 61 C 16 63, 22 69, 24 78 Z" />
      <path d="M21 62 C 13 60, 8 54, 7 45 C 15 47, 20 53, 21 62 Z" />
      <path d="M19 47 C 12 44, 8 38, 8 29 C 15 32, 19 38, 19 47 Z" />
      <path d="M19 33 C 14 29, 12 22, 13 14 C 19 18, 21 25, 19 33 Z" />
      <path d="M25 78 C 31 74, 34 68, 34 60 C 27 63, 24 70, 25 78 Z" />
      <path d="M22 62 C 28 58, 31 52, 30 44 C 24 47, 21 54, 22 62 Z" />
      <path d="M20 47 C 26 43, 28 36, 27 28 C 21 32, 19 39, 20 47 Z" />
      <path d="M20 32 C 25 27, 26 20, 24 12 C 19 17, 18 24, 20 32 Z" />
    </svg>
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
    <article>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-pin font-display text-[15px] text-creme"
        >
          {initiales(item.nom)}
        </span>
        <div>
          <p className="text-base font-medium text-encre">{item.nom}</p>
          <p className="text-sm text-encre/60">
            {item.ville[locale]} · {item.date[locale]}
          </p>
        </div>
      </div>
      <Stars label={t("stars")} className="mt-4" />
      <blockquote
        lang={item.lang}
        className="mt-3 max-w-[52ch] text-base leading-[1.6] text-encre/85"
      >
        {item.texte}
      </blockquote>
    </article>
  );
}

/**
 * Section « Ce qu'ils en disent » — pattern plateforme re-skinné Tideline :
 * en-tête « Coup de cœur » (note géante entre deux lauriers), sous-notes par
 * catégorie avec barres, puis grille d'avis séparés par l'espace (le
 * carousel a disparu — plus de drag ni de flèches).
 */
export default function Avis() {
  const t = useTranslations("avis");
  const locale = useLocale() as Lang;
  const fmtNote = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <section
      id="avis"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-36 md:px-10 md:py-48"
    >
      <Reveal>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionTitle className="mt-6">{t("title")}</SectionTitle>
      </Reveal>

      {/* Coup de cœur : badge, note entre lauriers, phrase d'assise */}
      <Reveal className="mt-16 flex flex-col items-center text-center">
        <span className="rounded-full border border-pin/40 px-4 py-1.5 text-sm tracking-wide text-pin">
          {t("badge")}
        </span>
        <div className="mt-6 flex items-center gap-4 md:gap-5">
          <Laurier />
          <p className="font-display text-[64px] leading-none text-encre md:text-[72px]">
            {t("note")}
          </p>
          <Laurier flip />
        </div>
        <p className="mt-5 max-w-md text-base text-encre/75">{t("loved")}</p>
        <p className="mt-2 text-sm text-encre/75">
          {t("stays")} — {t("originalNote")}
        </p>
      </Reveal>

      {/* Sous-notes par catégorie */}
      <Reveal
        as="dl"
        className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-6 md:gap-x-0 md:divide-x md:divide-filet"
      >
        {categoriesAvis.map((cat) => (
          <div key={cat.key} className="md:px-6 md:first:pl-0 md:last:pr-0">
            <dt className="text-sm text-encre/75">{cat.label[locale]}</dt>
            <dd className="mt-2 font-display text-[17px] text-encre">
              {fmtNote.format(cat.note)}
            </dd>
            <dd
              aria-hidden
              className="mt-3 h-1 max-w-24 overflow-hidden rounded-full bg-filet"
            >
              <div
                className="h-full rounded-full bg-pin"
                style={{ width: `${(cat.note / 5) * 100}%` }}
              />
            </dd>
          </div>
        ))}
      </Reveal>

      {/* Grille d'avis — séparés par l'espace, pas de bordure lourde */}
      <div className="mt-20 grid gap-x-16 gap-y-14 lg:grid-cols-2">
        {avis.map((item, i) => (
          <Reveal key={item.id} delay={(i % 2) * 0.08}>
            <Carte item={item} locale={locale} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
