import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/booking/find", "/booking/result", "/account", "/maintenance", "/privacy", "/terms", "/policies/"],
    },
    sitemap: "https://armourxsports.example/sitemap.xml",
  };
}
