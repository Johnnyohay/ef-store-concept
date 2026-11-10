import type { Metadata } from "next";
import Builder from "@/components/custom/Builder";

export const metadata: Metadata = {
  title: "Where You Went: make your own EF shirt",
  description: "Your EF city, your year, your program, printed on a tee or hoodie. A made-to-order concept for the EF Store.",
  alternates: { canonical: "/custom/" },
};

export default function CustomPage() {
  return (
    <div className="wrap">
      <Builder />
    </div>
  );
}
