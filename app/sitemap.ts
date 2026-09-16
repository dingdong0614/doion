import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/portfolio", 0.9],
    ["/pricing", 0.9],
    ["/process", 0.7],
    ["/contact", 0.8],
    ["/privacy", 0.3],
  ];
  return pages.map(([path, priority]) => ({ url: `${site.url}${path}`, lastModified: new Date(), priority }));
}
