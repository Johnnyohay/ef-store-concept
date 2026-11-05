import Link from "next/link";
import { ORIGIN } from "@/lib/facts";
import Photo from "@/components/story/Photo";
import Story from "@/components/story/Story";
import s from "./home.module.css";

// The places in the story, in order. Every one is sourced in lib/facts.ts.
const ROUTE = ["Stockholm", "London", "Lund", "Brighton", "Lucerne", "Seoul", "Cambridge, MA"];

// "Find your shirt": the ripple turned into a way to shop.
const PATHS = [
  { me: "I went on an EF trip", go: "/shop/concept", what: "Concept: one idea per shirt" },
  { me: "I studied with EF", go: "/shop/ef-logo", what: "EF Logo: the letters, plain" },
  { me: "I’m at EF Academy", go: "/shop/ef-academy", what: "EF Academy crest and wordmark" },
  { me: "I’m at Hult", go: "/business/hult", what: "Hult x EF capsule (concept)" },
  { me: "I follow the pink jerseys", go: "/shop/argyle-the-crocodile", what: "Argyle the Crocodile" },
  { me: "I like good design", go: "/shop/paul-rand", what: "The Paul Rand logos" },
  { me: "I like the old stuff", go: "/shop/retro", what: "Retro: the logos EF retired" },
];

export default function Home() {
  return (
    <>
      {/* First screen. 5-second test: what it is (the EF Store, merch) and who it's for. */}
      <section className={s.hero}>
        <Photo
          id="cycling-team-2022"
          alt="EF's pro cycling team in pink jerseys, presented at the Tour de France 2022"
          sizes="100vw"
          priority
          className={s.heroPhoto}
        />
        <div className={s.heroPanel}>
          <p className={s.kicker}>The EF Store</p>
          <h1 className={s.h1}>Wear where you went.</h1>
          <p className={s.sub}>
            Tees, hoodies and caps for the millions who’ve traveled, studied, worked and raced with EF since {ORIGIN.founded}.
          </p>
          <div className={s.actions}>
            <Link href="/shop" className="btn">Shop all</Link>
            <a href="#story" className="textlink">Start the story</a>
          </div>
        </div>
      </section>

      {/* The route. One line of motion that literally carries the story's places. */}
      <div className={s.route}>
        <p className="visually-hidden">The route: {ROUTE.join(", ")}</p>
        <div className={s.track} aria-hidden>
          {[0, 1].map((k) => (
            <span key={k}>
              {ROUTE.map((p) => (
                <span key={p + k} className={s.stop}>{p}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Story />

      <section className={s.paths} aria-labelledby="paths-h" data-flush-end>
        <div className="wrap">
          <h2 id="paths-h" className={s.pathsH}>Find your shirt.</h2>
          <ul>
            {PATHS.map((p) => (
              <li key={p.me}>
                <Link href={p.go} className={s.path}>
                  <span className={s.me}>{p.me}</span>
                  <span className={s.what}>{p.what}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/shop" className={s.all}>Or see all 172 pieces</Link>
        </div>
      </section>
    </>
  );
}
