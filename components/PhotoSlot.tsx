import Image from "next/image";
import lookbook from "@/data/lookbook.json";
import s from "./PhotoSlot.module.css";

type Slot = { src: string; alt: string; caption: string; credit: string; want: string };
type Key = Exclude<keyof typeof lookbook, "_readme">;

// Shows one of our own Boston lookbook photos. Until the photo exists, it shows a
// clearly labeled empty frame. Never a stock or AI-generated image.
export default function PhotoSlot({
  id, ratio = "4 / 5", sizes = "100vw", priority = false, className = "", showCaption = true,
}: { id: Key; ratio?: string; sizes?: string; priority?: boolean; className?: string; showCaption?: boolean }) {
  const slot = lookbook[id] as Slot;
  return (
    <figure className={`${s.fig} ${className}`}>
      <div className={s.frame} style={{ aspectRatio: ratio }}>
        {slot.src ? (
          <Image src={slot.src} alt={slot.alt} fill sizes={sizes} priority={priority} className={s.img} />
        ) : (
          <div className={s.empty} role="img" aria-label="Lookbook photo coming soon">
            <span className="label">Lookbook photo</span>
            <span className={s.want}>{slot.want}</span>
          </div>
        )}
      </div>
      {showCaption && slot.caption && (
        <figcaption className={s.cap}>
          “{slot.caption}”{slot.credit && <span className={s.credit}> {slot.credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
