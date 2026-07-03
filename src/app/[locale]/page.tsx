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
          <div className="flex h-full flex-col items-center justify-center px-6 pt-16 text-center">
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
