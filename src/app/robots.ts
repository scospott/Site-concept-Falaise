import type { MetadataRoute } from "next";

const BASE = "https://tideline.scottlab.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/styleguide", "/en/styleguide", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
