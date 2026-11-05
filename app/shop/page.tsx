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
  return (
    <>
      <CollectionHeader
        c={{ name: "Shop all", story: "Every design, one listing each, every color shown.", accent: null, kind: "garment" }}
        count={PRODUCTS.length}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]}
      />
      <div className="wrap">
          <ProductList products={PRODUCTS.map(toCard)} />
      </div>
    </>
  );
}
