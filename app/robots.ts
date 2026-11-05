import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

// Public student concept: kept out of search engines so it is never mistaken for the real store.
// The full SEO setup (titles, descriptions, Open Graph, JSON-LD, sitemap) is still in place to show
// what the real store would ship; a real launch would simply flip this to allow: "/".
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }], sitemap: `${SITE_URL}/sitemap.xml` };
}
