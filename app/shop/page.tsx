import type { Metadata } from "next";
import { PRODUCTS, toCard } from "@/lib/products";
import ProductList from "@/components/shop/ProductList";
import CollectionHeader from "@/components/shop/CollectionHeader";

export const metadata: Metadata = {
  title: "Shop all EF tees, hoodies and hats",
  description: "Every EF Store design in one place: Paul Rand logo tees, EF Logo, Retro, Concept and more. Round prices from $20.",
  alternates: { canonical: "/shop" },
};

export default function ShopAll() {
  const cards = PRODUCTS.map(toCard);
  return (
    <>
      <CollectionHeader
        designs={cards.filter((p) => !p.teeTwin).length}
        c={{ name: "Shop all", story: "Every design, every color shown. Tell us who it’s for and we’ll narrow it down.", accent: null, kind: "garment" }}
        count={PRODUCTS.length}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]}
      />
      <div className="wrap">
          <ProductList products={cards} personas />
      </div>
    </>
  );
}
