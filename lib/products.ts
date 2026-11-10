// Product data access. Everything comes from data/products.json (built by
// scripts/build-data.mjs from the scrape). No runtime network calls.
import data from "@/data/products.json";
import collectionsData from "@/data/collections.json";
import models from "@/data/models.json";

export type SizeRow = { size: string; [measure: string]: string | number };

export type Product = {
  id: string; // slug used in /product/[slug]
  legacy_name: string;
  new_name: string;
  design: string;
  print: string; // e.g. "Red/Blue", "Dark Print", or ""
  collection: string; // primary collection slug
  collections: string[];
  garment: Garment;
  legacy_price_usd: number;
  new_price_usd: number;
  colors: { name: string; hex: string | null }[];
  sizes: string[];
  images: string[];
  story_line: string;
  story_line_status: "draft" | "approved";
  details: string[];
  returns: string[];
  size_chart: { unit: "in"; rows: SizeRow[] } | null;
  source_url: string;
  /** Set when an AI-generated photo of Jonathan wearing this design leads the gallery. */
  model?: string;
};

export type Garment = "Tee" | "Boxy Tee" | "Hoodie" | "Zip Hoodie" | "Hat";

export type Collection = {
  slug: string;
  name: string;
  kind: "garment" | "story" | "business";
  story: string; // short story line in the collection header
  accent: "red" | "blue" | "pink" | null;
  match: (p: Product) => boolean;
};

const MODELS = models as Record<string, string>;
// Products with a photo of Jonathan wearing them lead with that photo (labeled as AI-generated).
const RAW = (data as { products: Product[] }).products;
/** The photo of Jonathan for a product: its own, or (boxy tees) the one of the same print on the regular tee. */
const modelFor = (p: Product): string | undefined => {
  if (MODELS[p.id]) return p.id;
  if (p.garment !== "Boxy Tee") return undefined;
  const tee = RAW.find((q) => q.garment === "Tee" && q.design === p.design && q.print === p.print && q.collection === p.collection);
  return tee && MODELS[tee.id] ? tee.id : undefined;
};
export const PRODUCTS = RAW.map((p) => {
  const m = modelFor(p);
  return m ? { ...p, model: MODELS[m], images: [`/images/models/${m}.jpg`, ...p.images] } : p;
}).sort((a, b) => Number(!!b.model) - Number(!!a.model)); // photos of Jonathan lead every list (stable sort)
export const isModelImage = (src: string) => src.startsWith("/images/models/");

const GARMENT_GROUPS: Record<string, Garment[]> = {
  tees: ["Tee", "Boxy Tee"],
  "classic-tees": ["Tee"],
  "boxy-tees": ["Boxy Tee"],
  hoodies: ["Hoodie", "Zip Hoodie"],
  "pullover-hoodies": ["Hoodie"],
  "zip-hoodies": ["Zip Hoodie"],
  hats: ["Hat"],
};

type CollectionMeta = Omit<Collection, "match">;
const META = collectionsData as CollectionMeta[];

export const COLLECTIONS: Collection[] = META.map((m) => ({
  ...m,
  match: GARMENT_GROUPS[m.slug]
    ? (p: Product) => GARMENT_GROUPS[m.slug].includes(p.garment)
    : (p: Product) => p.collections.includes(m.slug),
}));

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsIn = (slug: string) => {
  const c = getCollection(slug);
  return c ? PRODUCTS.filter(c.match) : [];
};

/** Other prints and garments of the same design, for "Also in" links. */
export const siblings = (p: Product) =>
  PRODUCTS.filter((q) => q.id !== p.id && q.design === p.design && q.collection === p.collection);

/** The slim shape product lists send to the browser (keeps page payloads small). */
export type CardProduct = Pick<Product, "id" | "new_name" | "legacy_name" | "collection" | "garment" | "new_price_usd" | "colors" | "sizes" | "model"> & {
  images: string[];
  /** Tee only: the same design and print also comes as a boxy tee. */
  boxyTwin?: string;
  /** Boxy tee only: the regular tee of the same design and print (the list can fold this one into it). */
  teeTwin?: string;
};
const twin = (p: Product, g: Garment) =>
  PRODUCTS.find((q) => q.garment === g && q.design === p.design && q.print === p.print && q.collection === p.collection)?.id;
export const toCard = (p: Product): CardProduct => ({
  id: p.id, new_name: p.new_name, legacy_name: p.legacy_name, collection: p.collection,
  garment: p.garment, new_price_usd: p.new_price_usd, colors: p.colors, sizes: p.sizes, images: p.images.slice(0, 2), model: p.model,
  ...(p.garment === "Tee" && { boxyTwin: twin(p, "Boxy Tee") }),
  ...(p.garment === "Boxy Tee" && { teeTwin: twin(p, "Tee") }),
});
