"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isModelImage, type Product } from "@/lib/products";
import { usd } from "@/lib/format";
import { track } from "@/lib/analytics";
import { useBag } from "../Bag";
import SizeGuide from "./SizeGuide";
import s from "./ProductDetail.module.css";

// Every product points back to the chapter of the story it belongs to.
const CHAPTER: Record<string, { n: string; title: string; href: string }> = {
  "paul-rand": { n: "06", title: "Read the story: the logos Paul Rand drew for EF", href: "/rand" },
  "argyle-the-crocodile": { n: "07", title: "Read the story: when EF went pink", href: "/story#ch-07" },
  concept: { n: "08", title: "Read the story: the store that ignored the rules", href: "/story#ch-08" },
  retro: { n: "08", title: "Read the story: five logos since 1965", href: "/story#ch-08" },
  "the-fe-collection": { n: "08", title: "Read the story: the store that ignored the rules", href: "/story#ch-08" },
  "ef-logo": { n: "03", title: "Read the story: what EF really stands for", href: "/story#story" },
  "ef-academy": { n: "05", title: "Read the story: everyone the ripple reached", href: "/story#ch-05" },
};

type Props = {
  p: Product;
  collectionName: string;
  shipping: string[];
  returnsExtra: string[];
  related: { id: string; label: string }[];
};

export default function ProductDetail({ p, collectionName, shipping, returnsExtra, related }: Props) {
  const { add } = useBag();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors.length === 1 ? p.colors[0].name : "");
  const [size, setSize] = useState(p.sizes.length === 1 ? p.sizes[0] : "");
  const [tried, setTried] = useState(false);

  useEffect(() => { track("product_view"); }, [p.id]);

  const missing = [!color && "a color", !size && "a size"].filter(Boolean).join(" and ");

  const onAdd = () => {
    setTried(true);
    if (missing) return;
    add({ slug: p.id, name: p.new_name, color, size, price: p.new_price_usd, image: p.images[0] });
  };

  return (
    <div className={s.layout}>
      {/* Gallery. Baymard: thumbnails for extra images so shoppers know more exist. */}
      <section className={s.gallery} aria-label="Product images">
        <div className={s.main}>
          <Image
            src={p.images[img]}
            alt={isModelImage(p.images[img]) && p.model ? `${p.model} (AI-generated image)` : `${p.new_name}, image ${img + 1} of ${p.images.length}`}
            fill
            priority
            sizes="(min-width: 900px) 55vw, 100vw"
            className={s.mainImg}
          />
          {isModelImage(p.images[img]) && (
            <p className={s.aiNote}>AI-generated image of {p.model?.split(" ")[0]}, a real member of our Hult team, wearing this design (with consent).</p>
          )}
        </div>
        {p.images.length > 1 && (
          <ul className={s.thumbs}>
            {p.images.map((src, i) => (
              <li key={src}>
                <button
                  onClick={() => setImg(i)}
                  className={`${s.thumb} ${i === img ? s.thumbOn : ""}`}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === img}
                >
                  <Image src={src} alt="" width={72} height={90} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={s.info}>
        <p className="label muted"><Link href={`/shop/${p.collection}`}>{collectionName}</Link></p>
        <h1 className={s.title}>{p.new_name}</h1>
        <p className={s.price}>{usd(p.new_price_usd)}</p>
        <p className={s.story}>{p.story_line}</p>
        {CHAPTER[p.collection] && (
          <Link href={CHAPTER[p.collection].href} className={s.chapterLink}>
            <span className={s.chapterN}>{CHAPTER[p.collection].n}</span> {CHAPTER[p.collection].title}
          </Link>
        )}

        {/* Color: visible swatch buttons with the name written out. */}
        <fieldset className={s.field}>
          <legend className="label">Color{color && <span className={s.chosen}>: {color}</span>}</legend>
          <div className={s.colors}>
            {p.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-pressed={color === c.name}
                className={`${s.color} ${color === c.name ? s.on : ""}`}
              >
                <span className={s.chip} style={{ background: c.hex ?? "transparent" }} aria-hidden />
                {c.name}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Size: one button per size, never a dropdown.
            Baymard apparel research: 70% of apparel sites get size selection wrong. */}
        <fieldset className={s.field}>
          <legend className={`label ${s.sizeLegend}`}>
            <span>Size{size && <span className={s.chosen}>: {size}</span>}</span>
            {/* Baymard: size guide link right next to the size buttons (82% of apparel sites give too little sizing info). */}
            <a href="#size-guide" className={s.guideLink}>Size guide</a>
          </legend>
          <div className={s.sizes}>
            {p.sizes.map((z) => (
              <button key={z} onClick={() => setSize(z)} aria-pressed={size === z} className={`${s.size} ${size === z ? s.on : ""}`}>
                {z}
              </button>
            ))}
          </div>
        </fieldset>

        <button className="btn btn--full" onClick={onAdd}>Add to bag · {usd(p.new_price_usd)}</button>
        {tried && missing && <p className={s.error} role="alert">Pick {missing} first.</p>}

        {/* Shipping and returns on the product page itself, not behind a tab.
            Baymard: ~64% of users look for shipping info and ~60% for returns info here. */}
        <div className={s.block}>
          <h2 className="label">Shipping</h2>
          <ul>{shipping.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className={s.block}>
          <h2 className="label">Returns</h2>
          <ul>{[...p.returns, ...returnsExtra].map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        {p.details.length > 0 && (
          <div className={s.block}>
            <h2 className="label">Fabric and fit</h2>
            <ul>{p.details.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        )}

        {related.length > 0 && (
          <div className={s.block}>
            <h2 className="label">Same design, other versions</h2>
            <ul>{related.map((r) => <li key={r.id}><Link href={`/product/${r.id}`} className={s.relLink}>{r.label}</Link></li>)}</ul>
          </div>
        )}
      </section>

      <SizeGuide chart={p.size_chart} garment={p.garment} />
    </div>
  );
}
