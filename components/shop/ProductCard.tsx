import Image from "next/image";
import Link from "next/link";
import type { CardProduct as Product } from "@/lib/products";
import { usd } from "@/lib/format";
import { modelLine } from "@/lib/modelFit";
import Swatches from "./Swatches";
import s from "./ProductCard.module.css";

// Baymard: one list item per product with every color swatch visible.
// Colors are never split into separate listings (42% of mobile sites fail this).
export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  return (
    <article className={s.card}>
      <Link href={`/product/${p.id}`} className={s.link}>
        <div className={s.media}>
          <Image
            src={p.images[0]}
            alt={p.model ? `${p.model} (AI-generated image)` : `${p.new_name}, product photo`}
            fill
            sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw"
            priority={priority}
            className={s.img}
          />
          {p.model && <span className={s.aiTag}>AI image</span>}
          {p.images[1] && (
            <Image src={p.images[1]} alt="" fill sizes="(min-width: 1100px) 25vw, 33vw" className={s.alt} aria-hidden />
          )}
        </div>
        <h3 className={s.name}>{p.new_name}</h3>
      </Link>
      {p.model && <p className={s.fit}>{modelLine(p.garment)}{p.garment === "Boxy Tee" && p.teeTwin ? " (shown in the regular tee)" : ""}</p>}
      {p.boxyTwin && <Link href={`/product/${p.boxyTwin}`} className={s.twin}>Also in boxy fit</Link>}
      <div className={s.meta}>
        <span className={s.price}>{usd(p.new_price_usd)}</span>
        <Swatches colors={p.colors} />
      </div>
    </article>
  );
}
