import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { bodoni, instrument } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { VillaChatProvider } from "@/components/chat/VillaChat";
import ChatWidget from "@/components/chat/ChatWidget";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: Omit<LayoutProps<"/[locale]">, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL("https://tideline.scottlab.app"),
    title: {
      default: t("title"),
      template: t("template"),
    },
    description: t("description"),
    icons: {
      icon: "/favicon.png",
    },
    openGraph: {
      siteName: "Tideline",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: "Tideline — Where the sea meets the forest",
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${bodoni.variable} ${instrument.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <VillaChatProvider>
            <SmoothScroll />
            <Nav />
            {children}
            <Footer />
            <ChatWidget />
          </VillaChatProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
