import { getTranslations, setRequestLocale } from "next-intl/server";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import ForestLine from "@/components/ForestLine";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");

  return (
    <main>
      {/* Hero statique placeholder — remplacé par <ScrollHero slot="home"> au chantier 2 */}
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden text-center">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#101914_0%,#121c16_55%,#1a2a22_86%,#101914_100%)]"
        />
        <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 pt-16">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="display-xl mt-6 text-ecru">
            {t.rich("title", {
              i: (chunks) => <em>{chunks}</em>,
              br: () => <br />,
            })}
          </h1>
          <p className="mt-6 max-w-md text-ecru/70">{t("baseline")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/reservation">{t("ctaPrimary")}</Button>
            <Button href="#villa" variant="ghost">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>
        <ForestLine className="absolute bottom-0 left-0 h-20 w-full text-[#0b120e] md:h-28" />
      </section>

      {/*
        Sections à venir :
        - #villa    : manifeste lumineux + chiffres clés (chantier 3)
        - #espaces  : les espaces (chantier 3)
        - #galerie  : galerie « La dérive » (chantier 4)
        - #avis     : ce qu'ils en disent (chantier 4)
        - #hote     : demandez à Maël (chantier 5)
      */}
    </main>
  );
}
