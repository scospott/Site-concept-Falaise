import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import ForestLine from "@/components/ForestLine";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,#f7f3ea_0%,#f3ecdd_55%,#efe7d7_86%,#f7f3ea_100%)]"
      />
      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="display-xl mt-6 text-encre">{t("title")}</h1>
        <p className="mt-6 max-w-md text-encre/70">{t("body")}</p>
        <div className="mt-10">
          <Button href="/">{t("back")}</Button>
        </div>
      </div>
      <ForestLine className="absolute bottom-0 left-0 h-20 w-full text-pierre md:h-28" />
    </main>
  );
}
