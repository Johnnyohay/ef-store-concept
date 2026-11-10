import Link from "next/link";
import type { Collection } from "@/lib/products";
import s from "./CollectionHeader.module.css";

// Collection headers are one of the two places story accent color may appear.
export default function CollectionHeader({ c, count, designs, crumbs }: { c: Pick<Collection, "name" | "story" | "accent" | "kind">; count: number; designs?: number; crumbs: { label: string; href: string }[] }) {
  return (
    <header className={`${s.head} ${c.accent ? s[c.accent] : ""}`}>
      <div className="wrap">
        <nav aria-label="Breadcrumb" className={s.crumbs}>
          {crumbs.map((cr, i) => (
            <span key={cr.href}>
              {i > 0 && <span aria-hidden> / </span>}
              <Link href={cr.href}>{cr.label}</Link>
            </span>
          ))}
        </nav>
        <h1 className={s.title}>{c.name}</h1>
        <p className={s.story}>{c.story}</p>
        <p className={s.count}>{designs && designs !== count ? `${designs} designs · ${count} products` : `${count} ${count === 1 ? "product" : "products"}`}</p>
      </div>
    </header>
  );
}
