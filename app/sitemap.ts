import type { MetadataRoute } from "next";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";
import { absImg } from "@/lib/img";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/story/", "/rand/", "/shop/", "/custom/", "/business/", "/business/hult/", "/credits/"];
  return [
    ...pages.map((p) => ({ url: SITE_URL + p, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...COLLECTIONS.map((c) => ({ url: `${SITE_URL}/shop/${c.slug}/`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE_URL}/product/${p.id}/`, changeFrequency: "weekly" as const, priority: 0.6, images: p.images.slice(0, 1).map((i) => absImg(i)) })),
  ];
}
