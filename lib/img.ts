// Plain URL for an image outside next/image (Open Graph, JSON-LD).
import loader from "./imageLoader";
import { SITE_URL } from "./seo";
export const imgUrl = (src: string, width = 960) => loader({ src, width });
export const absImg = (src: string, width = 960) => new URL(SITE_URL).origin + imgUrl(src, width);
