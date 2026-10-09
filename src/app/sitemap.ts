import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { ventures, ventureHref } from "@/content/ventures";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["/", "/about", "/ventures", ...ventures.map((v) => ventureHref(v.slug)), "/work", "/contact", "/privacy"];
  return routes.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/ventures") ? 0.8 : 0.6,
  }));
}
