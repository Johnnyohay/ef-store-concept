// Custom next/image loader for the static build: maps any requested width to the
// nearest pre-built WebP variant (scripts/variants.mjs) and adds the Pages basePath.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const WIDTHS: Record<string, number[]> = { products: [480, 960], rand: [480, 960], story: [800, 1600], stickers: [480], models: [480, 960, 1136] };

export default function loader({ src, width }: { src: string; width: number }) {
  const m = src.match(/^\/images\/(products|rand|story|stickers|models)\/(.+)\.jpe?g$/i);
  if (!m) return BASE + src;
  const ws = WIDTHS[m[1]];
  const w = ws.find((x) => x >= width) ?? ws[ws.length - 1];
  return `${BASE}/v/${w}/${m[1]}/${m[2]}.webp`;
}
