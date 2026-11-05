import type { Metadata } from "next";
import Link from "next/link";
import Story from "@/components/story/Story";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { absImg } from "@/lib/img";
import s from "./story.module.css";

export const metadata: Metadata = {
  title: "The EF story: from a kid who couldn’t learn English",
  description:
    "Bertil Hult couldn’t learn English in school. He learned it in London, and in 1965 started EF in a dorm basement in Lund. The trip, the ripple, the Paul Rand logo and the pink jersey.",
  alternates: { canonical: "/story/" },
  openGraph: { title: "The EF story", description: "A kid who couldn’t learn English, a basement in Lund, and millions of people since.", images: [absImg("/images/story/lund.jpg", 1600)] },
};

export default function StoryPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Story", path: "/story/" }])} />
      <header className={`wrap ${s.head}`}>
        <p className="label muted">The EF story</p>
        <h1 className={s.h1}>A kid who couldn’t learn English.</h1>
      </header>
      <Story />
      <div className={`wrap ${s.end}`}>
        <Link href="/shop" className="btn">Shop the story</Link>
      </div>
    </>
  );
}
