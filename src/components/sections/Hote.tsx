"use client";

import { useTranslations } from "next-intl";
import Eyebrow from "@/components/Eyebrow";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/motion/Reveal";
import ChatWindow from "@/components/chat/ChatWindow";

/** Section inline « Demandez à Maël » — entre Avis et Footer. */
export default function Hote() {
  const t = useTranslations("hote");

  return (
    <section
      id="hote"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:px-10 md:py-40"
    >
      <Reveal>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionTitle className="mt-4">{t("title")}</SectionTitle>
        <p className="mt-4 max-w-md text-ecru/60">{t("intro")}</p>
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <div className="mx-auto h-[520px] max-w-3xl md:h-[560px]">
          <ChatWindow />
        </div>
      </Reveal>
    </section>
  );
}
