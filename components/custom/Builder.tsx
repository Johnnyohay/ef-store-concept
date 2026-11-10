"use client";
import { useEffect, useState } from "react";
import { CITIES, COLORS, GARMENTS, PROGRAMS, SIZES, STYLES, cleanCity, shortYear, type Design } from "@/lib/custom";
import { usd } from "@/lib/format";
import { track } from "@/lib/analytics";
import { useBag } from "../Bag";
import TeePreview from "./TeePreview";
import s from "./Builder.module.css";

const START: Design = { city: "Brighton", year: "1965", program: "EF Language School", garment: "tee", color: "White", style: "bold" };
const THIS_YEAR = new Date().getFullYear();

export default function Builder() {
  const { add } = useBag();
  const [d, setD] = useState<Design>(START);
  const [size, setSize] = useState("");
  const [tried, setTried] = useState(false);
  const set = <K extends keyof Design>(k: K, v: Design[K]) => setD((x) => ({ ...x, [k]: v }));

  // A design can be shared as a link: /custom/?city=Seoul&year=1988&...
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const pick = <T extends string>(v: string | null, ok: readonly T[]) => (v && (ok as readonly string[]).includes(v) ? (v as T) : undefined);
    setD((x) => ({
      city: sp.get("city") ?? x.city,
      year: sp.get("year") ?? x.year,
      program: sp.get("program") ?? x.program,
      garment: pick(sp.get("garment"), GARMENTS.map((g) => g.id)) ?? x.garment,
      color: pick(sp.get("color"), COLORS.map((c) => c.name)) ?? x.color,
      style: pick(sp.get("style"), STYLES.map((t) => t.id)) ?? x.style,
    }));
    track("custom_view");
  }, []);
  useEffect(() => {
    const u = new URL(window.location.href);
    for (const [k, v] of Object.entries(d)) u.searchParams.set(k, v);
    window.history.replaceState(null, "", u);
  }, [d]);

  const garment = GARMENTS.find((g) => g.id === d.garment)!;
  const yearOk = /^\d{4}$/.test(d.year) && +d.year >= 1965 && +d.year <= THIS_YEAR;
  const cityOk = cleanCity(d.city).length > 1;
  const problems = [!cityOk && "a city", !yearOk && `a year from 1965 to ${THIS_YEAR}`, !size && "a size"].filter(Boolean).join(", ");
  const name = `Where You Went ${garment.label}: ${cleanCity(d.city)} ${shortYear(d.year)}`;
  const sizes = d.garment === "hoodie" ? SIZES.slice(0, 5) : SIZES;

  const addToBag = () => {
    setTried(true);
    if (problems) return;
    add({
      slug: `custom-${d.garment}-${d.style}-${cleanCity(d.city).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${d.year}`,
      name: `${name} (${STYLES.find((t) => t.id === d.style)!.label}, ${d.program})`,
      color: d.color,
      size,
      price: garment.price,
      image: "/brand/custom-tee.png",
    });
  };

  return (
    <div className={s.wrap}>
      <div className={s.stage}>
        <div className={s.preview}><TeePreview d={d} /></div>
        <p className={s.caption}>Live preview. Printed to order, so no two are the same.</p>
      </div>

      <div className={s.form}>
        <p className="label">Made to order · Concept</p>
        <h1 className={s.title}>Wear where <em>you</em> went.</h1>
        <p className={s.lede}>Your city, your year, your program. One shirt that only you can wear honestly.</p>

        <label className={s.field}>
          <span className="label">Where did you go?</span>
          <input list="ef-cities" value={d.city} maxLength={18} onChange={(e) => set("city", e.target.value)} placeholder="Type any city" aria-invalid={tried && !cityOk} />
          <datalist id="ef-cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
        </label>

        <div className={s.row}>
          <label className={s.field}>
            <span className="label">When?</span>
            <input inputMode="numeric" value={d.year} maxLength={4} onChange={(e) => set("year", e.target.value.replace(/\D/g, ""))} placeholder="1998" aria-invalid={tried && !yearOk} />
          </label>
          <label className={`${s.field} ${s.grow}`}>
            <span className="label">With</span>
            <select value={d.program} onChange={(e) => set("program", e.target.value)}>
              {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
        </div>

        <fieldset className={s.group}>
          <legend className="label">Print style</legend>
          <div className={s.opts}>
            {STYLES.map((t) => (
              <button key={t.id} type="button" className={`${s.opt} ${d.style === t.id ? s.on : ""}`} aria-pressed={d.style === t.id} onClick={() => set("style", t.id)}>{t.label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className={s.group}>
          <legend className="label">Garment</legend>
          <div className={s.opts}>
            {GARMENTS.map((g) => (
              <button key={g.id} type="button" className={`${s.opt} ${d.garment === g.id ? s.on : ""}`} aria-pressed={d.garment === g.id} onClick={() => { set("garment", g.id); if (g.id === "hoodie" && size === "3XL") setSize(""); }}>
                {g.label} <span className={s.price}>{usd(g.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={s.group}>
          <legend className="label">Color: {d.color}</legend>
          <div className={s.swatches}>
            {COLORS.map((c) => (
              <button key={c.name} type="button" className={`${s.swatch} ${d.color === c.name ? s.swOn : ""}`} style={{ background: c.hex }} aria-label={c.name} aria-pressed={d.color === c.name} onClick={() => set("color", c.name)} />
            ))}
          </div>
        </fieldset>

        <fieldset className={s.group}>
          <legend className="label">Size</legend>
          <div className={s.opts}>
            {sizes.map((z) => (
              <button key={z} type="button" className={`${s.opt} ${s.size} ${size === z ? s.on : ""}`} aria-pressed={size === z} onClick={() => setSize(z)}>{z}</button>
            ))}
          </div>
        </fieldset>

        <button className={`btn ${s.cta}`} onClick={addToBag}>Add to bag · {usd(garment.price)}</button>
        {tried && problems && <p className={s.err} role="alert">Pick {problems} first.</p>}
        <p className={s.fine}>Concept for a Hult class. Nothing is printed or charged. Made to order means no general returns, like the rest of the store.</p>
      </div>
    </div>
  );
}
