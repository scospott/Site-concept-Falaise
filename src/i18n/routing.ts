import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  // Pas de négociation par en-tête/cookie : « / » est toujours FR,
  // « /en » toujours EN — comportement déterministe (SEO, CDN, audits).
  localeDetection: false,
});
