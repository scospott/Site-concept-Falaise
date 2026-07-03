import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Eyebrow from "@/components/Eyebrow";
import ForestLine from "@/components/ForestLine";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/reservation">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("reservation.title"),
    description: t("reservation.description"),
  };
}

export default async function ReservationPage({
  params,
}: PageProps<"/[locale]/reservation">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservation");

  return (
    <main>
      {/* Hero court placeholder — remplacé par <ScrollHero slot="reservation"> au chantier 2 */}
      <section className="relative flex min-h-[64svh] items-end overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#101914_0%,#131d17_60%,#1a2a22_88%,#101914_100%)]"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-40 md:px-10">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="display-xl mt-4 text-ecru">{t("title")}</h1>
        </div>
        <ForestLine className="absolute bottom-0 left-0 h-14 w-full text-[#0b120e] md:h-20" />
      </section>

      {/* Contenu à venir : calendrier + parcours de réservation (chantier 6) */}
    </main>
  );
}
