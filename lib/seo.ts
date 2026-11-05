// SEO helpers: schema.org JSON-LD for Organization and Product.
// Public student-concept site on GitHub Pages. A real launch would use https://store.ef.com.
import { ORIGIN } from "./facts";
import { absImg } from "./img";
import type { Product } from "./products";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://johnnyohay.github.io/ef-store-concept";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EF Store",
    url: SITE_URL,
    description: "Student concept for Hult MKT-6054. Not affiliated with or endorsed by EF.",
    parentOrganization: {
      "@type": "Organization",
      name: "EF Education First",
      foundingDate: String(ORIGIN.founded),
      foundingLocation: ORIGIN.place,
      founder: { "@type": "Person", name: ORIGIN.founder },
    },
  };
}

export function productLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.new_name,
    sku: p.id,
    url: `${SITE_URL}/product/${p.id}`,
    image: p.images.map((i) => absImg(i)),
    description: p.story_line,
    color: p.colors.map((c) => c.name).join(", "),
    size: p.sizes.join(", "),
    brand: { "@type": "Brand", name: "EF" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: p.new_price_usd.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${p.id}`,
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}
