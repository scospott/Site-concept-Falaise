import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ReservationPage({
  params,
}: PageProps<"/[locale]/reservation">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservation");

  return (
    <main>
      <section className="flex min-h-[60svh] items-center justify-center">
        <h1>{t("title")}</h1>
      </section>
    </main>
  );
}
