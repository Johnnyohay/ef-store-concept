import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RAND, SOURCES } from "@/lib/facts";
import { productsIn, toCard } from "@/lib/products";
import ProductList from "@/components/shop/ProductList";
import Photo from "@/components/story/Photo";
import { absImg } from "@/lib/img";
import Reveal from "@/components/story/Reveal";
import Track from "@/components/story/Track";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import s from "./rand.module.css";

export const metadata: Metadata = {
  title: "Paul Rand and EF: the logos that didn’t win",
  description:
    "Paul Rand promised one perfect logo. For EF, he drew several. The story from EF’s own history, his January 1994 booklet, and the tees printed with the alternates.",
  alternates: { canonical: "/rand/" },
  openGraph: { title: "Paul Rand and EF", description: "He promised one perfect logo. For EF, he drew several.", images: [absImg("/images/rand/option-1.jpg")] },
};

// Each option is cropped from the EF Store's own product photo (scripts/rand-assets.mjs).
// Nothing here redraws, traces or recreates Rand's artwork or the EF logo.
const OPTIONS = [
  { n: "1", img: "/images/rand/option-1.jpg", product: "paul-rand-option-1-casual-tee", note: "Option 1, as printed by the EF Store" },
  { n: "2", img: "/images/rand/option-2.jpg", product: "paul-rand-option-2-multicolor-casual-tee", note: "Option 2, as printed by the EF Store" },
  { n: "3", img: "/images/rand/option-3.jpg", product: "paul-rand-option-3-red-blue-casual-tee", note: "Option 3, as printed by the EF Store" },
  { n: "4", img: "/images/rand/flag-face.jpg", product: "flag-face-dark-print-casual-tee", note: "Flag Face, as printed by the EF Store", label: "Flag Face" },
];

export default function RandPage() {
  const products = productsIn("paul-rand");
  return (
    <article className={s.page}>
      <JsonLd data={breadcrumbLd([{ name: "Story", path: "/story" }, { name: "Paul Rand and EF", path: "/rand" }])} />
      <Track event="rand_start" onMount />

      {/* 1. The hook */}
      <section className={`${s.screen} ${s.hook}`}>
        <p className="label muted">Paul Rand and EF, 1993–1994</p>
        <h1 className={s.huge}>He promised one perfect logo.</h1>
      </section>

      {/* 2. The turn. The one visual pun on this page: the "one" gets outnumbered. */}
      <section className={`${s.screen} ${s.red}`}>
        <p className={s.huge}>For EF, he drew <span className={s.several}>several</span>.</p>
      </section>

      {/* 3. Who */}
      <section className={`${s.screen} ${s.who}`}>
        <div className={s.portrait}>
          <Photo id="rand" alt="Paul Rand, portrait from 1942" sizes="(min-width: 900px) 30vw, 70vw" ratio="3 / 4" />
        </div>
        <p className={s.mid}>
          Paul Rand, {RAND.life}. He drew the logos for {RAND.clients.slice(0, -1).join(", ")} and {RAND.clients.at(-1)}.
        </p>
      </section>

      {/* 4. The ask */}
      <section className={s.screen}>
        <p className={s.year}>{RAND.philipJoined}</p>
        <p className={s.mid}>Philip Hult joins EF and goes to Rand for a cleaner, more modern logo.</p>
      </section>

      {/* 5. The rule */}
      <section className={`${s.screen} ${s.rule}`}>
        <p className={s.mid}>Rand’s terms, as EF tells it: he would design one version.</p>
        <p className={s.huge}>No changes.</p>
      </section>

      {/* 6. The break: options appear one by one */}
      <section className={`${s.screen} ${s.optionsIntro}`}>
        <p className={s.mid}>Then he broke his own rule.</p>
        <p className="muted">The alternates he drew for EF, as the EF Store prints them today.</p>
      </section>
      <section className={s.options} aria-label="Logo options">
        {OPTIONS.map((o, i) => (
          <div key={o.n} className={s.option}>
            <p className={s.optNum} aria-hidden>{o.label ?? `Option ${o.n}`}</p>
            <Reveal from={i % 2 ? "right" : "left"} className={s.sheet}>
              <Link href={`/product/${o.product}`} className={s.sheetLink}>
                <Image src={o.img} alt={o.note} width={512} height={o.label ? 640 : 512} sizes="(min-width: 900px) 40vw, 80vw" className={s.sheetImg} />
              </Link>
            </Reveal>
            <p className={`muted ${s.optNote}`}>{o.note}. <Link href={`/product/${o.product}`} className="textlink">See the tee</Link></p>
          </div>
        ))}
      </section>

      {/* 7. The booklet (primary source) */}
      <section className={`${s.screen} ${s.booklet}`}>
        <p className="label">The booklet</p>
        <p className={s.mid}>Rand explained his thinking in a presentation booklet for EF, signed “{RAND.bookletSigned}”.</p>
        <p className={s.body}>
          In it he points out that the pattern plays against the straight lines of the E and the F, and that the italics add emphasis.
        </p>
        <a href={SOURCES.randBooklet} className="textlink" rel="noopener" target="_blank">Read the booklet at paulrand.design</a>
      </section>

      {/* Source note, small type, as the brief requires */}
      <p className={`wrap ${s.source}`}>
        This account comes from EF’s own pages (
        <a href={SOURCES.efLogo} rel="noopener" target="_blank">careers.ef.com</a>) and the EF Store’s{" "}
        <a href={SOURCES.storeRand} rel="noopener" target="_blank">Paul Rand collection page</a>, plus Rand’s January 1994 booklet. Rand’s
        work is still under copyright. The images on this page are cropped from the EF Store’s own product photos. Nothing has been redrawn.
      </p>

      {/* 10. The products */}
      <section className={`wrap ${s.shop}`} aria-labelledby="rand-shop">
        <h2 id="rand-shop" className={s.shopTitle}>The Paul Rand collection</h2>
        <Track event="rand_end" />
          <ProductList products={products.map(toCard)} />
      </section>
    </article>
  );
}
