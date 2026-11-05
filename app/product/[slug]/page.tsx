import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getCollection, getProduct, siblings } from "@/lib/products";
import ProductDetail from "@/components/shop/ProductDetail";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, productLd } from "@/lib/seo";
import { usd } from "@/lib/format";
import { absImg } from "@/lib/img";
import storeInfo from "@/data/store_info.json";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const desc = `${p.story_line} ${usd(p.new_price_usd)}. ${p.colors.length} ${p.colors.length === 1 ? "color" : "colors"}, sizes ${p.sizes[0]}–${p.sizes.at(-1)}.`;
  return {
    title: p.new_name,
    description: desc.trim(),
    alternates: { canonical: `/product/${p.id}/` },
    openGraph: { type: "website", title: p.new_name, description: desc.trim(), images: p.images.slice(0, 1).map((i) => absImg(i)) },
  };
}

export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const c = getCollection(p.collection);
  const related = siblings(p).map((q) => ({ id: q.id, label: q.new_name }));
  return (
    <>
      <JsonLd data={productLd(p)} />
      <JsonLd data={breadcrumbLd([{ name: "Shop", path: "/shop" }, { name: c?.name ?? "", path: `/shop/${p.collection}` }, { name: p.new_name, path: `/product/${p.id}` }])} />
      <ProductDetail p={p} collectionName={c?.name ?? ""} shipping={storeInfo.shipping} returnsExtra={storeInfo.returns_extra} related={related} />
    </>
  );
}
