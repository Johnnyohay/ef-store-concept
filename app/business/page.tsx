import type { Metadata } from "next";
import Link from "next/link";
import { HULT } from "@/lib/facts";
import { productsIn } from "@/lib/products";
import CollectionHeader from "@/components/shop/CollectionHeader";
import s from "./business.module.css";

export const metadata: Metadata = {
  title: "Shop by EF Business: EF Academy and Hult",
  description: "Merch for the schools in the EF family: EF Academy, and a concept capsule for Hult International Business School.",
  alternates: { canonical: "/business" },
};

export default function Business() {
  const academy = productsIn("ef-academy");
  return (
    <>
      <CollectionHeader
        c={{ name: "Shop by EF Business", story: "EF runs more than trips. Here’s merch for the schools.", accent: null, kind: "business" }}
        count={academy.length}
        crumbs={[{ label: "Home", href: "/" }, { label: "EF Business", href: "/business" }]}
      />
      <ul className={`wrap ${s.list}`}>
        <li>
          <Link href="/shop/ef-academy" className={s.row}>
            <span className={s.name}>EF Academy</span>
            <span className={s.meta}>{academy.length} products in stock</span>
          </Link>
        </li>
        <li>
          <Link href="/business/hult" className={s.row}>
            <span className={s.name}>{HULT.name}</span>
            <span className={s.meta}><span className={s.tag}>Concept</span> Not in stock. A proposed Hult x EF capsule.</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
