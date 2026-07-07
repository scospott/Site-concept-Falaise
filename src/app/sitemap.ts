import type { MetadataRoute } from "next";

const BASE = "https://la-falaise.scottlab.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { fr: string; en: string; priority: number }[] = [
    { fr: "/", en: "/en", priority: 1 },
    { fr: "/reservation", en: "/en/reservation", priority: 0.8 },
  ];

  return pages.flatMap(({ fr, en, priority }) => {
    const languages = { fr: `${BASE}${fr}`, en: `${BASE}${en}` };
    return [
      {
        url: `${BASE}${fr}`,
        changeFrequency: "monthly" as const,
        priority,
        alternates: { languages },
      },
      {
        url: `${BASE}${en}`,
        changeFrequency: "monthly" as const,
        priority,
        alternates: { languages },
      },
    ];
  });
}
