import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BagProvider } from "@/components/Bag";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BagDrawer from "@/components/BagDrawer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, organizationLd } from "@/lib/seo";

// Fonts are bundled from node_modules so the demo works with Wi-Fi off.
const jost = localFont({
  src: "../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2",
  variable: "--font-jost",
  weight: "300 800",
  display: "swap",
});
const schibsted = localFont({
  src: "../node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2",
  variable: "--font-schibsted",
  weight: "400 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EF Store: wear where you went (student concept)",
    template: "%s | EF Store",
  },
  description:
    "Tees, hoodies and caps for the millions who’ve traveled, studied, worked and raced with EF since 1965. The story, the Paul Rand logos, the pink jersey. Student concept.",
  openGraph: { type: "website", siteName: "EF Store (student concept)", locale: "en_US" },
  // Public student concept: never indexed, so nobody mistakes it for the real store.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6f4ef" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${schibsted.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <JsonLd data={organizationLd()} />
        <BagProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
        </BagProvider>
      </body>
    </html>
  );
}
