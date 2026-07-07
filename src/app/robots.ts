import type { MetadataRoute } from "next";

const BASE = "https://la-falaise.scottlab.app";

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
