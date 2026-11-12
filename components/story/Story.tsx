import Image from "next/image";
import Link from "next/link";
import { BERTIL, BOSTON, CYCLING, EF_TODAY, HULT, ORIGIN, RAND, SOURCES, STORE_QUOTES, WHO } from "@/lib/facts";
import Photo from "./Photo";
import modelPhotos from "@/data/models.json";

const HAS_MODEL = (id: string) => id !== "_note" && id in (modelPhotos as Record<string, string>);
// Who is wearing it: the first word of the photo caption ("Carlotta in the ...").
const wearer = (id: string) => (modelPhotos as Record<string, string>)[id].split(" ")[0];
import s from "./Story.module.css";

// The EF story, told as a story: a kid who couldn't learn English in school, a trip,
// a ripple, a logo, a pink jersey, a store that broke its own rules. Every fact comes
// from lib/facts.ts with a source. Products appear as "stickers" cut from the
// store's own product photos, so the story always leads back to a shirt.

function Sticker({ id, tilt = 0, size = "m", label }: { id: string; tilt?: number; size?: "s" | "m" | "l"; label: string }) {
  // Every design with a photo of a team member wearing it shows that photo instead of the flat product.
  if (HAS_MODEL(id)) return <ModelShot id={id} tilt={tilt} label={label} />;
  return (
    <Link href={`/product/${id}`} className={`${s.sticker} ${s[size]}`} style={{ rotate: `${tilt}deg` }}>
      <Image src={`/images/stickers/${id}.jpg`} alt="" width={480} height={480} sizes="(min-width: 900px) 240px, 40vw" />
      <span className={s.stickerLabel}>{label}</span>
    </Link>
  );
}

// A photo of a team member wearing the design (AI-generated, labeled), shown like a pinned print.
function ModelShot({ id, tilt = 0, label }: { id: string; tilt?: number; label: string }) {
  return (
    <Link href={`/product/${id}`} className={`${s.sticker} ${s.model}`} style={{ rotate: `${tilt}deg` }}>
      <Image src={`/images/models/${id}.jpg`} alt={`${wearer(id)} wearing the ${label} (AI-generated image)`} width={1136} height={1408} quality={90} sizes="(min-width: 900px) 520px, 100vw" />
      <span className={s.stickerLabel}>{label} · {wearer(id)}</span>
    </Link>
  );
}

function Chapter({ n, title }: { n: string; title: string }) {
  return (
    <p className={s.chapter}>
      <span className={s.chapterN}>{n}</span>
      <span>{title}</span>
    </p>
  );
}

export default function Story() {
  return (
    <div className={s.story} id="story">
      {/* 01. The kid */}
      <section className={s.kid} id="ch-01">
        <div className={s.wrap}>
          <Chapter n="01" title="The kid" />
          <p className={s.giant}>
            Stockholm. A boy can’t learn <span className={s.strike}>English</span>.
          </p>
          <div className={s.cols}>
            <p className={s.lede}>{BERTIL.dyslexia} {BERTIL.dropout}</p>
            <p className={s.note}>His name is {ORIGIN.founder}. Born {BERTIL.born}.</p>
          </div>
        </div>
      </section>

      {/* 02. London */}
      <section className={s.london} id="ch-02">
        <div className={s.wrap}>
          <Chapter n="02" title="London" />
          <p className={s.big}>{BERTIL.london}</p>
          <p className={s.punch}>Nobody teaches him English there.<br />He just learns it.</p>
          <p className={s.lede}>{BERTIL.learned}</p>
        </div>
      </section>

      {/* 03 then 04, in order: the basement in Lund, then the first trip. */}
      <section className={s.trips}>
        <div className={s.tripsGrid}>
          <article className={s.trip}>
            <Photo id="lund" alt="Lund University's main building and fountain, Lund, Sweden" sizes="(min-width: 900px) 50vw, 100vw" ratio="4 / 3" />
            <div className={s.card}>
              <Chapter n="03" title="The basement" />
              <p className={s.cardBig}>{ORIGIN.founded}. Lund, Sweden.</p>
              <p>He’s {ORIGIN.founderAge}, a student in Lund, and he starts a company in {ORIGIN.room}.</p>
              <p>
                He calls it EF: <strong>{ORIGIN.efStandsFor}</strong>, Swedish for “{ORIGIN.efMeans}”. Not “Education First”. That came later.
              </p>
            </div>
          </article>
          <article className={s.trip}>
            <Photo id="brighton" alt="Brighton Palace Pier seen from the sea, Brighton, England" sizes="(min-width: 900px) 50vw, 100vw" ratio="4 / 3" />
            <div className={`${s.card} ${s.cardPink}`}>
              <Chapter n="04" title="The first trip" />
              <p className={s.cardBig}>Swedish teenagers. Brighton, England.</p>
              <p>His first product: take students to England so they learn English the way he did. By living it.</p>
            </div>
          </article>
        </div>
      </section>

      {/* 05. The ripple: who EF is for. This answers "who is this store for". */}
      <section className={s.ripple} id="ch-05">
        <div className={s.wrap}>
          <Chapter n="05" title="The ripple" />
          <p className={s.giant}>One trip. Then millions.</p>
          <p className={s.lede}>
            EF says the rings in its logo stand for “{EF_TODAY.ripple}”. Here’s who the ripple reached, roughly in order.
          </p>
          <ol className={s.who}>
            {WHO.map((w) => (
              <li key={w.who}>
                <span className={s.whoYear}>{w.year ?? ""}</span>
                <span className={s.whoName}>{w.who}</span>
                <span className={s.whoWhat}>{w.what}</span>
              </li>
            ))}
          </ol>
          <dl className={s.stats}>
            <div><dt>people since 1965</dt><dd>Millions</dd></div>
            <div><dt>countries and regions</dt><dd>{EF_TODAY.countries}</dd></div>
            <div><dt>offices and schools</dt><dd>{EF_TODAY.offices}</dd></div>
          </dl>
          <p className={s.source}>Numbers: <a href={SOURCES.efAbout} target="_blank" rel="noopener">ef.com/about-us</a>.</p>
        </div>
      </section>

      {/* 06. Rand */}
      <section className={s.rand} id="ch-06">
        <div className={s.wrap}>
          <Chapter n="06" title="The logo" />
          <div className={s.randGrid}>
            <div className={s.randPhoto}>
              <Photo id="rand" alt="Paul Rand, portrait from 1942" sizes="(min-width: 900px) 30vw, 70vw" ratio="3 / 4" />
            </div>
            <div className={s.randText}>
              <p className={s.big}>Paul Rand ({RAND.life}) drew logos for {RAND.clients.join(", ")}. One logo each. That was the rule.</p>
              <p className={s.lede}>“{STORE_QUOTES.rand}” <span className={s.attrib}>EF Store</span></p>
              <Link href="/rand" className={s.go}>See the logos he drew for EF</Link>
            </div>
          </div>
          <div className={s.pile} aria-label="Paul Rand collection">
            <ModelShot id="paul-rand-option-3-red-blue-casual-tee" tilt={2} label="Rand Option 3" />
            <ModelShot id="paul-rand-option-1-casual-tee" tilt={-5} label="Rand Option 1" />
            <ModelShot id="paul-rand-option-2-multicolor-casual-tee" tilt={4} label="Rand Option 2" />
            <ModelShot id="paul-rand-option-3-black-casual-tee" tilt={-2} label="Rand Option 3, Black" />
          </div>
        </div>
      </section>

      {/* 07. Pink */}
      <section className={s.pink} id="ch-07">
        <div className={s.wrap}>
          <Chapter n="07" title="The jersey" />
          <p className={s.giant}>Then EF went pink.</p>
          <p className={s.lede}>
            In {CYCLING.bought}, EF took over a pro cycling team whose fans had been running a{" "}
            <strong>{CYCLING.saveArgyle}</strong> campaign. In {CYCLING.women}, a women’s team followed.
          </p>
        </div>
        <div className={s.peloton}>
          <Photo id="cycling-team-2022" alt="EF Education-EasyPost riders in pink at the Tour de France 2022" sizes="(min-width: 900px) 50vw, 100vw" ratio="3 / 2" className={s.pel1} />
          <Photo id="cycling-uran" alt="Rigoberto Urán of EF Education First racing in 2019" sizes="(min-width: 900px) 30vw, 60vw" ratio="4 / 5" className={s.pel2} />
          <Photo id="cycling-tdf-2023" alt="EF Education-EasyPost riders on stage, Tour de France 2023" sizes="(min-width: 900px) 30vw, 60vw" ratio="1 / 1" className={s.pel3} />
        </div>
        <div className={`${s.wrap} ${s.argyleRow}`}>
          <p className={s.big}>The store has its own Argyle: a crocodile.</p>
          <div className={s.pile}>
            <ModelShot id="argyle-bros-casual-tee" tilt={-3} label="Argyle Pixel Walk" />
            <Sticker id="versargyle-casual-tee" tilt={5} label="Argyle Sunglasses" />
            <Sticker id="polka-casual-tee" tilt={-2} size="l" label="Concept Bike" />
          </div>
          <Link href="/shop/argyle-the-crocodile" className={s.go}>Shop Argyle the Crocodile</Link>
        </div>
      </section>

      {/* 08. Breaking the rules */}
      <section className={s.rules} id="ch-08">
        <div className={s.wrap}>
          <Chapter n="08" title="The rules" />
          <blockquote className={s.quote}>
            “A company like EF has many important rules and guidelines related to the use of its logo… with this collection we’ve{" "}
            <span className={s.hl}>completely ignored them all!</span>”
          </blockquote>
          <p className={s.attrib}>The EF Store, on its own Concept collection</p>
          <div className={s.scatter}>
            <ModelShot id="teegar-casual-tee" tilt={-4} label="Tiger" />
            <Sticker id="abracadabra-black-cats-casual-tee" tilt={5} label="Cat Letters" />
            <Sticker id="no-signal-casual-tee" tilt={-3} size="l" label="No Signal" />
            <Sticker id="wtef-casual-tee" tilt={2} label="Paper Cutout" />
            <Sticker id="3def-casual-tee" tilt={-7} label="3D Letters" />
            <Sticker id="london-bus-casual-tee" tilt={4} size="s" label="London Bus" />
          </div>
          <p className={s.lede}>
            And the old logos came back too. EF’s logo has changed {EF_TODAY.logoVersions} times since 1965. The Retro collection wears them.
          </p>
          <div className={s.links}>
            <Link href="/shop/concept" className={s.go}>Shop Concept</Link>
            <Link href="/shop/retro" className={s.go}>Shop Retro</Link>
          </div>
        </div>
      </section>

      {/* 09. Today */}
      <section className={s.today} id="ch-09">
        <div className={s.todayPhotos}>
          <Photo id="charles-sail" alt="A sailboat on the Charles River with the Boston skyline behind" sizes="(min-width: 900px) 60vw, 100vw" ratio="4 / 5" className={s.today1} />
          <Photo id="bertil" alt="Bertil Hult in 2017, smiling" sizes="(min-width: 900px) 25vw, 50vw" ratio="3 / 4" className={s.today2} />
        </div>
        <div className={s.wrap}>
          <Chapter n="09" title="Today" />
          <p className={s.giant}>{ORIGIN.sixtiethYear}: year 60.</p>
          <p className={s.lede}>
            The kid who couldn’t learn English in school built a company that works in {EF_TODAY.countries} countries and regions. Since {BOSTON.hqOpened},
            EF’s North American headquarters has sat on the Charles River, across from Boston. {HULT.name} is down the road in {HULT.hq.split(",")[0]}.
          </p>
          <p className={s.big}>This store is for everyone the ripple reached.</p>
        </div>
      </section>
    </div>
  );
}
