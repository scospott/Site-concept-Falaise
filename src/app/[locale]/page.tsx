import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");

  return (
    <main>
      <section className="flex min-h-svh items-center justify-center">
        <h1>{t("baseline")}</h1>
      </section>
    </main>
  );
}
