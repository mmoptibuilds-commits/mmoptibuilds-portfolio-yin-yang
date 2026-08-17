import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo";

/**
 * Sitemap, generated from the same route list the navigation uses, so a new
 * page cannot be added to the site and forgotten here.
 *
 * /admin and /api are absent by construction: publicRoutes only contains
 * indexable public pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
