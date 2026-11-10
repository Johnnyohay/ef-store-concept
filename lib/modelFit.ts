import fit from "@/data/model_fit.json";

/** "Jonathan is 5′10″ and wears size L", or just the name until the size is filled in. */
export function modelLine(garment: string): string {
  const what = garment === "Hat" ? "cap: one size" : fit.size ? `size ${fit.size}` : "";
  const tall = fit.height ? ` is ${fit.height} and` : "";
  return what ? `${fit.name}${tall} wears ${what}` : `${fit.name} is wearing it`;
}
