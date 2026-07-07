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
              className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#14160F]/50 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_55%_at_50%_46%,rgba(20,22,15,0.55)_0%,rgba(20,22,15,0.25)_45%,transparent_72%)]"
            />
            <div className="relative flex flex-col items-center">
              <div data-hero-fade>
                <Eyebrow className="hero-text-shadow !text-creme">{t("eyebrow")}</Eyebrow>
              </div>
              <h1 className="hero-text-shadow display-xl mt-8 text-creme">
                {t.rich("title", {
                  i: (chunks) => <em>{chunks}</em>,
                  l: (chunks) => (
                    <span data-hero-line className="block">
                      {chunks}
                    </span>
                  ),
                })}
              </h1>
              <p data-hero-fade className="hero-text-shadow mt-8 max-w-md text-creme/85">
                {t("baseline")}
              </p>
              <div
                data-hero-fade
                className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Button href="/reservation" inverse>{t("ctaPrimary")}</Button>
                <Button href="#villa" variant="ghost" inverse>
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
