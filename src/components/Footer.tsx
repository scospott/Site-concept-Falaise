import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ForestLine from "@/components/ForestLine";
import OceanNocturne from "@/components/effects/OceanNocturne";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative">
      <ForestLine className="block h-16 w-full text-abysse md:h-24" />
      <div className="border-t border-filet bg-sable/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
          <div>
            <p className="font-display text-2xl text-encre">Tideline</p>
            <p className="mt-3 max-w-xs text-sm text-encre/60">
              {t("baseline")}
            </p>
          </div>
          <div>
            <p className="eyebrow">{t("explore")}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#villa"
                  className="text-encre/70 transition-colors duration-300 hover:text-pin"
                >
                  {tNav("villa")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#galerie"
                  className="text-encre/70 transition-colors duration-300 hover:text-pin"
                >
                  {tNav("galerie")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reservation"
                  className="text-encre/70 transition-colors duration-300 hover:text-pin"
                >
                  {t("reserveCta")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">{t("practical")}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-encre/60">
              <li>{t("checkin")}</li>
              <li>{t("checkout")}</li>
              <li>{t("guests")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-filet">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-encre/50 md:flex-row md:px-10">
            <p>© 2026 {t("rights")}</p>
            <a
              href="https://scottlab.app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-pin"
            >
              {t("concept")} — scottlab.app
            </a>
          </div>
        </div>
        {/* La lisière complète : la forêt en tête, l'océan en pied */}
        <OceanNocturne />
      </div>
    </footer>
  );
}
