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
import PageTransition from "@/components/motion/PageTransition";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { VillaChatProvider } from "@/components/chat/VillaChat";
import ChatWidget from "@/components/chat/ChatWidget";
import CursorLantern from "@/components/effects/CursorLantern";
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
    metadataBase: new URL("https://la-falaise.scottlab.app"),
    title: {
      default: t("title"),
      template: t("template"),
    },
    description: t("description"),
    icons: {
      icon: "/favicon.png",
      apple: "/apple-icon.png",
    },
    openGraph: {
      siteName: "La Falaise",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: "La Falaise — Where the sea meets the forest",
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

  // JSON-LD léger — hébergement FICTIF : ni adresse précise, ni téléphone.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "La Falaise",
    description:
      locale === "fr"
        ? "Site concept — villa fictive. Démonstration ScottLab."
        : "Concept site — fictional villa. A ScottLab demonstration.",
    url: "https://la-falaise.scottlab.app",
    image: "https://la-falaise.scottlab.app/og.jpg",
  };

  return (
    <html
      lang={locale}
      className={`${bodoni.variable} ${instrument.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <VillaChatProvider>
            <SmoothScroll />
            <PageTransition />
            <Nav />
            {children}
            <Footer />
            <ChatWidget />
            <CursorLantern />
          </VillaChatProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
