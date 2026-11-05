import type { Metadata } from "next";
import credits from "@/data/photo_credits.json";
import { SOURCES } from "@/lib/facts";
import { FILM } from "@/lib/film";
import s from "./credits.module.css";

export const metadata: Metadata = { title: "Credits and sources", alternates: { canonical: "/credits/" } };

// Attribution for every photo (CC licenses require it) and every fact source.
export default function Credits() {
  return (
    <section className={`wrap ${s.page}`}>
      <h1 className={s.h1}>Credits and sources</h1>
      <p className={s.lede}>
        Student concept for Hult MKT-6054. Not affiliated with or endorsed by EF. Product photos and print crops are the EF Store’s own
        (store.ef.com), shown for a class project. Story photos are from Wikimedia Commons under the licenses below.
      </p>
      <h2 className="label">Film</h2>
      <ul className={s.list}>
        <li>
          <a href={FILM.url} target="_blank" rel="noopener">{FILM.title}</a>
          <span>{FILM.channel} (official YouTube channel)</span>
          <span>Embedded from YouTube, not re-hosted</span>
        </li>
      </ul>
      <h2 className="label">Photos</h2>
      <ul className={s.list}>
        {Object.entries(credits).map(([id, c]) => (
          <li key={id}>
            <a href={c.source} target="_blank" rel="noopener">{c.title.replace("File:", "")}</a>
            <span>{c.author}</span>
            <span>{c.license_url ? <a href={c.license_url} target="_blank" rel="noopener">{c.license}</a> : c.license}</span>
          </li>
        ))}
      </ul>
      <h2 className="label">Facts</h2>
      <ul className={s.list}>
        {Object.values(SOURCES).map((u) => (
          <li key={u}><a href={u} target="_blank" rel="noopener">{u.replace(/^https?:\/\//, "")}</a></li>
        ))}
      </ul>
    </section>
  );
}
