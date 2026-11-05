"use client";
import { useEffect, useState } from "react";
import s from "./HeroFilm.module.css";

import { FILM } from "@/lib/film";

// Background film (see lib/film.ts): muted, looping, privacy-enhanced YouTube embed.
// The thumbnail shows first; the player loads after the page is idle so it doesn't
// slow the first paint. With reduced motion, or offline, the still stays.

export default function HeroFilm() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => setPlay(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 1200);
  }, []);

  const params = new URLSearchParams({
    autoplay: "1", mute: "1", start: String(FILM.start), loop: "1", playlist: FILM.id, controls: "0",
    playsinline: "1", rel: "0", modestbranding: "1", disablekb: "1", iv_load_policy: "3",
  });

  return (
    <div className={s.film} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.still} src={`https://i.ytimg.com/vi/${FILM.id}/maxresdefault.jpg`} alt="" fetchPriority="high" />
      {play && (
        <iframe
          className={s.frame}
          src={`https://www.youtube-nocookie.com/embed/${FILM.id}?${params}`}
          title={FILM.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
      )}
      <div className={s.shade} />
    </div>
  );
}
