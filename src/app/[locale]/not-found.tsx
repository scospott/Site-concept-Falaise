import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Eyebrow from "@/components/Eyebrow";
import RockStrata from "@/components/RockStrata";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,#efe6d2_0%,#ebdfc5_55%,#e6d7b8_86%,#efe6d2_100%)]"
      />
      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="display-xl mt-6 text-encre">{t("title")}</h1>
        <p className="mt-6 max-w-md text-encre/75">{t("body")}</p>
        <div className="mt-10">
          <Button href="/">{t("back")}</Button>
        </div>
      </div>
      <RockStrata
        back="#E0D2AF"
        front="#D9CBA8"
        className="absolute bottom-0 left-0 h-20 w-full md:h-28"
      />
    </main>
  );
}
