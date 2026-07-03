import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import ScrollHero from "@/components/ScrollHero";
import Manifeste from "@/components/sections/Manifeste";
import Espaces from "@/components/sections/Espaces";
import Galerie from "@/components/sections/Galerie";
import Avis from "@/components/sections/Avis";
import Hote from "@/components/sections/Hote";
import HeroTitleReveal from "@/components/effects/HeroTitleReveal";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: locale === "fr" ? "/" : "/en",
      languages: { fr: "/", en: "/en", "x-default": "/" },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");

  return (
    <main>
      <ScrollHero slot="home">
        <HeroTitleReveal>
          <div className="relative flex h-full flex-col items-center justify-center px-6 pt-16 text-center">
            {/* Voiles de lisibilité sur les frames claires — dans l'overlay :
                ils s'évanouissent avec le texte dès le début du scrub */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0b120e]/50 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_55%_at_50%_46%,rgba(11,18,14,0.55)_0%,rgba(11,18,14,0.25)_45%,transparent_72%)]"
            />
            <div className="relative flex flex-col items-center">
              <div data-hero-fade>
                <Eyebrow>{t("eyebrow")}</Eyebrow>
              </div>
              <h1 className="display-xl mt-6 text-ecru">
                {t.rich("title", {
                  i: (chunks) => <em>{chunks}</em>,
                  l: (chunks) => (
                    <span data-hero-line className="block">
                      {chunks}
                    </span>
                  ),
                })}
              </h1>
              <p data-hero-fade className="mt-6 max-w-md text-ecru/70">
                {t("baseline")}
              </p>
              <div
                data-hero-fade
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Button href="/reservation">{t("ctaPrimary")}</Button>
                <Button href="#villa" variant="ghost">
                  {t("ctaSecondary")}
                </Button>
              </div>
            </div>
          </div>
        </HeroTitleReveal>
      </ScrollHero>

      <Manifeste />
      <Espaces />
      <Galerie />
      <Avis />
      <Hote />
    </main>
  );
}
