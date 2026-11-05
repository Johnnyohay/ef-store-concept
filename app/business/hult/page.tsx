import type { Metadata } from "next";
import Link from "next/link";
import { HULT, SOURCES } from "@/lib/facts";
import Photo from "@/components/story/Photo";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import s from "./hult.module.css";

export const metadata: Metadata = {
  title: "Hult x EF capsule (concept)",
  description: `A concept capsule for ${HULT.name}, associated with EF Education First. Not in stock. For Those Made to Do.`,
  alternates: { canonical: "/business/hult/" },
};

// No Hult merch exists in the scraped EF Store data, so these are clearly labeled
// placeholder cards. They are never shown as real stock and cannot be added to the bag.
// Every line on a print is a fact from section 3.3 of the brief.
const CONCEPTS = [
  { name: "Hult Made to Do Tee", print: HULT.motto, garment: "Tee", price: 25 },
  { name: "Hult Cambridge Hoodie", print: "Cambridge, Massachusetts", garment: "Hoodie", price: 35 },
  { name: "Hult Since 2002 Boxy Tee", print: `Hult International Business School, ${HULT.bought}`, garment: "Boxy Tee", price: 25 },
  { name: "Hult Prize 2010 Tee", print: `Hult Prize, ${HULT.prizeYear}`, garment: "Tee", price: 25 },
];

export default function HultPage() {
  return (
    <article>
      <JsonLd data={breadcrumbLd([{ name: "EF Business", path: "/business" }, { name: "Hult (concept)", path: "/business/hult" }])} />
      <header className={s.head}>
        <div className="wrap">
          <nav aria-label="Breadcrumb" className={s.crumbs}>
            <Link href="/">Home</Link> / <Link href="/business">EF Business</Link> / <span>Hult</span>
          </nav>
          <p className={s.tag}>Concept · not in stock</p>
          <h1 className={s.title}>Hult x EF capsule</h1>
          <p className={s.lede}>
            {HULT.name} is {HULT.relationship}. It’s headquartered in {HULT.hq}. Its motto is “{HULT.motto}”.
            The EF Store sells nothing for Hult yet. This is what a first drop could look like.
          </p>
        </div>
      </header>

      <section className="wrap" aria-labelledby="facts-h">
        <h2 id="facts-h" className="visually-hidden">How Hult and EF connect</h2>
        <ol className={s.facts}>
          <li><span className={s.year}>{HULT.bought}</span> The Hult family buys the {HULT.formerName} and renames it {HULT.name}.</li>
          <li><span className={s.year}>{HULT.prizeYear}</span> EF and Hult start the Hult Prize.</li>
        </ol>
      </section>

      <section className={`wrap ${s.capsule}`} aria-labelledby="capsule-h">
        <h2 id="capsule-h" className={s.h2}>Concept: Hult x EF capsule</h2>
        <p className="muted">Placeholder cards. Prints are set in type only, with no school logo used. Nothing here can be bought.</p>
        <ul className={s.grid}>
          {CONCEPTS.map((c) => (
            <li key={c.name} className={s.card}>
              <div className={s.mock} aria-hidden>
                <span className={s.mockLabel}>Concept</span>
                <span className={s.print}>{c.print}</span>
              </div>
              <h3 className={s.cardName}>{c.name}</h3>
              <p className={s.cardMeta}><span>${c.price}</span><span className="muted">Concept, not in stock</span></p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${s.photo}`}>
        <Photo id="charles-river" alt="The Charles River in Cambridge, Massachusetts, where Hult is headquartered" ratio="16 / 9" sizes="100vw" />
      </section>

      <p className={`wrap ${s.source}`}>
        Wording from <a href={SOURCES.efBoston} rel="noopener" target="_blank">EF’s own description of Hult</a>. History from{" "}
        <a href={SOURCES.wikiEF} rel="noopener" target="_blank">Wikipedia</a>.
      </p>
    </article>
  );
}
