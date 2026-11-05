import Image from "next/image";
import credits from "@/data/photo_credits.json";
import s from "./Photo.module.css";

export type PhotoId = keyof typeof credits;

// A real photo from Wikimedia Commons with its required credit (author, license, link).
export default function Photo({
  id, alt, sizes = "100vw", priority = false, className = "", fill = false, ratio,
}: { id: PhotoId; alt: string; sizes?: string; priority?: boolean; className?: string; fill?: boolean; ratio?: string }) {
  const c = credits[id];
  return (
    <figure className={`${s.fig} ${fill ? s.fill : ""} ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Image src={`/images/story/${id}.jpg`} alt={alt} fill sizes={sizes} priority={priority} className={s.img} />
      <figcaption className={s.credit}>
        <a href={c.source} target="_blank" rel="noopener">Photo: {c.author}, {c.license}</a>
      </figcaption>
    </figure>
  );
}
