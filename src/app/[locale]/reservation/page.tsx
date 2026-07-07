import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Eyebrow from "@/components/Eyebrow";
import ScrollHero from "@/components/ScrollHero";
import Parcours from "@/components/booking/Parcours";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/reservation">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("reservation.title"),
    description: t("reservation.description"),
    alternates: {
      canonical: locale === "fr" ? "/reservation" : "/en/reservation",
      languages: {
        fr: "/reservation",
        en: "/en/reservation",
        "x-default": "/reservation",
      },
    },
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
      <ScrollHero slot="reservation">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-6 pb-28 pt-40 md:px-10">
          <Eyebrow className="hero-text-shadow !text-creme">{t("eyebrow")}</Eyebrow>
          <h1 className="hero-text-shadow display-xl mt-6 text-creme">{t("title")}</h1>
        </div>
      </ScrollHero>

      <div className="pt-28 md:pt-40">
        <Parcours />
      </div>
    </main>
  );
}
