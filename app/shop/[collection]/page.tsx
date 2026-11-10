import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection, productsIn, toCard } from "@/lib/products";
import ProductList from "@/components/shop/ProductList";
import CollectionHeader from "@/components/shop/CollectionHeader";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, SITE_URL } from "@/lib/seo";
import { absImg } from "@/lib/img";

type Params = { params: Promise<{ collection: string }> };

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCollection((await params).collection);
  if (!c) return {};
  const n = productsIn(c.slug).length;
  return {
    title: `${c.name}: EF Store`,
    description: `${c.story} ${n} pieces, round prices.`,
    alternates: { canonical: `/shop/${c.slug}/` },
    openGraph: { title: `${c.name} | EF Store`, description: c.story, images: productsIn(c.slug)[0]?.images.slice(0, 1).map((i) => absImg(i)) },
  };
}

export default async function CollectionPage({ params }: Params) {
  const c = getCollection((await params).collection);
  if (!c) notFound();
  const products = productsIn(c.slug);
  const crumbs = [
    { label: "Home", href: "/" },
    c.kind === "business" ? { label: "EF Business", href: "/business" } : { label: "Shop", href: "/shop" },
    { label: c.name, href: `/shop/${c.slug}` },
  ];
  // Boxy tees whose regular tee is also listed here (the list shows them as one design).
  const folded = products.filter((p) => p.garment === "Boxy Tee" && products.some((q) => q.garment === "Tee" && q.design === p.design && q.print === p.print && q.collection === p.collection)).length;
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs.map((x) => ({ name: x.label, path: x.href })))} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: c.name,
          description: c.story,
          url: `${SITE_URL}/shop/${c.slug}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/product/${p.id}`, name: p.new_name })),
          },
        }}
      />
      <CollectionHeader c={c} count={products.length} designs={products.length - folded} crumbs={crumbs} />
      <div className="wrap">
          <ProductList products={products.map(toCard)} showGarment={c.kind !== "garment" || c.slug === "tees" || c.slug === "hoodies"} />
      </div>
    </>
  );
}
