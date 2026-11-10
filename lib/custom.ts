// "Where you went": the made-to-order shirt that turns the tagline into the product.
// Concept only; prices sit just above the store's regular tees for the personal print.

export const PROGRAMS = [
  "EF Educational Tours",
  "EF Language Year Abroad",
  "EF Language School",
  "EF High School Exchange Year",
  "EF Academy",
  "EF Go Ahead Tours",
  "Hult International Business School",
  "Olympic volunteer with EF",
  "Au pair with EF",
] as const;

// Cities EF ran trips, schools or campuses in; any city can be typed in.
export const CITIES = [
  "Brighton", "London", "Oxford", "Cambridge", "Bristol", "Bournemouth", "Manchester", "Dublin", "Malta",
  "Paris", "Nice", "Berlin", "Munich", "Barcelona", "Madrid", "Málaga", "Rome", "Florence", "Lucerne",
  "Lund", "Stockholm", "Tokyo", "Seoul", "Shanghai", "Singapore", "Sydney", "Brisbane", "Auckland",
  "Cape Town", "Vancouver", "Toronto", "New York", "Boston", "Cambridge, MA", "Miami", "San Diego",
  "Los Angeles", "Santa Barbara", "Seattle", "Honolulu", "Dubai",
];

export const GARMENTS = [
  { id: "tee", label: "Tee", price: 28 },
  { id: "boxy", label: "Boxy Tee", price: 30 },
  { id: "hoodie", label: "Hoodie", price: 48 },
] as const;

export const COLORS = [
  { name: "White", hex: "#ffffff", ink: "#181818" },
  { name: "Ivory", hex: "#f3ecd9", ink: "#181818" },
  { name: "EF Pink", hex: "#fb5ca4", ink: "#181818" },
  { name: "True Navy", hex: "#22305f", ink: "#f6f4ef" },
  { name: "Black", hex: "#1b1b1b", ink: "#f6f4ef" },
] as const;

export const STYLES = [
  { id: "bold", label: "Bold" },
  { id: "stamp", label: "Passport stamp" },
  { id: "ticket", label: "Ticket" },
] as const;

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export type Design = {
  city: string;
  year: string;
  program: string;
  garment: (typeof GARMENTS)[number]["id"];
  color: (typeof COLORS)[number]["name"];
  style: (typeof STYLES)[number]["id"];
};

export const shortYear = (y: string) => (/^\d{4}$/.test(y) ? `’${y.slice(2)}` : y);
export const cleanCity = (c: string) => c.replace(/\s+/g, " ").trim().slice(0, 18);
