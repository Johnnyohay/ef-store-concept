/** @type {import('next').NextConfig} */
// Static export for GitHub Pages (johnnyohay.github.io/ef-store-concept).
// NEXT_PUBLIC_BASE_PATH is "/ef-store-concept" in the Pages build and empty locally.
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  output: "export",
  basePath: base,
  trailingSlash: true,
  images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
  poweredByHeader: false,
};
export default nextConfig;
