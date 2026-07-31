import type { MetadataRoute } from "next";

const origin = "https://www.armourxsports.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/fields", "/about", "/articles", "/faq", "/contact", "/book"].map((path) => ({ url: `${origin}${path}`, changeFrequency: path === "/book" ? "weekly" : "monthly", priority: path === "/" ? 1 : path === "/book" ? 0.9 : 0.7 }));
}
