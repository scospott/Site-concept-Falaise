import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import RockStrata from "@/components/RockStrata";
import OceanNocturne from "@/components/effects/OceanNocturne";

/* Fissures de la matière granit — quasi subliminales, posées dans le fond */
function Fissures() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
    >
      <path
        d="M0 96L240 102L318 118L560 112L648 128L920 122L1010 108L1260 114L1440 106"
        fill="none"
        stroke="#46412F"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M180 400L210 330L206 262L248 208L244 156"
        fill="none"
        stroke="#46412F"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1120 400L1096 322L1112 270L1088 214"
        fill="none"
        stroke="#46412F"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative">
      {/* Transition d'entrée : la strate de granit se détache sur la pierre */}
      <RockStrata className="mb-[-1px] block h-16 w-full md:h-24" />
      <div className="relative bg-abysse text-creme">
        <Fissures />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
          <div>
            <p className="font-display text-2xl text-creme">Tideline</p>
            <p className="mt-3 max-w-xs text-sm text-creme/60">
              {t("baseline")}
            </p>
          </div>
          <div>
            <p className="eyebrow !text-soleil">{t("explore")}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#villa"
                  className="text-creme/80 transition-colors duration-300 hover:text-soleil"
                >
                  {tNav("villa")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#galerie"
                  className="text-creme/80 transition-colors duration-300 hover:text-soleil"
                >
                  {tNav("galerie")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reservation"
                  className="text-creme/80 transition-colors duration-300 hover:text-soleil"
                >
                  {t("reserveCta")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-soleil">{t("practical")}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-creme/60">
              <li>{t("checkin")}</li>
              <li>{t("checkout")}</li>
              <li>{t("guests")}</li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-[#4A4536]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-creme/45 md:flex-row md:px-10">
            <p>© 2026 {t("rights")}</p>
            <a
              href="https://scottlab.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-soleil"
            >
              {t("concept")} — scottlab.app
            </a>
          </div>
        </div>
        {/* La lisière complète : la roche en tête, la mer au couchant en pied */}
        <OceanNocturne />
      </div>
    </footer>
  );
}
