import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * robots.txt
 *
 * /admin and /api are disallowed. Note that disallowing a path is a crawl
 * instruction, not access control — the real protection on /admin is
 * authentication plus row-level security, and it also sends noindex headers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
