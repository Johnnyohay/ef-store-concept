// Every factual sentence on the site comes from this file, and each fact names its source.
// Sources were read on 2026-11-05. Anything we wanted but could not source is in DATA_GAPS.md.

export const SOURCES = {
  efLogo: "https://careers.ef.com/we-are-ef/5-facts-about-the-ef-logo-you-might-not-know/",
  efAbout: "https://www.ef.com/wwen/about-us/",
  randBooklet: "https://www.paulrand.design/work/Education-First.html",
  wikiEF: "https://en.wikipedia.org/wiki/EF_Education_First",
  wikiBertil: "https://en.wikipedia.org/wiki/Bertil_Hult",
  wikiTeam: "https://en.wikipedia.org/wiki/EF_Education%E2%80%93EasyPost",
  efBoston: "https://ef.com/ca/pg/usa/boston",
  storeRand: "https://store.ef.com/collections/paul-rand",
  storeConcept: "https://store.ef.com/collections/concept",
  storeRetro: "https://store.ef.com/collections/retro",
} as const;

export type Src = keyof typeof SOURCES;

export const ORIGIN = {
  founded: 1965,
  founder: "Bertil Hult",
  founderAge: 23,
  place: "Lund, Sweden",
  room: "the basement of his university dormitory",
  efStandsFor: "Europeiska Ferieskolan",
  efMeans: "European holiday school",
  firstTrip: "Brighton, England", // efAbout: "In 1965 he brought Swedish students to Brighton, England."
  sixtiethYear: 2025,
  sixtiethLine: "60 stories for 60 years",
};

export const BERTIL = {
  born: "Stockholm, 1941", // wikiBertil
  dyslexia: "He has spoken often about struggling with dyslexia as a child.", // wikiBertil
  dropout: "He left school after junior high.", // wikiBertil
  london: "He made coffee and ran errands for a ship broker in London.", // wikiBertil
  learned: "That’s where he learned English, and decided immersion is the best way to learn a language.", // wikiBertil
};

export const EF_TODAY = {
  mission: "At EF, we believe that the world is better when people try to understand one another.", // efAbout
  served: "millions of people", // efAbout: "Since 1965, EF has helped millions of people..."
  countries: "100+", // efAbout
  offices: "600+", // efAbout: offices and schools
  logoVersions: 5, // efLogo: "five variations of the logo since 1965"
  ripple: "a ripple of impact", // efLogo: what the logo's rings stand for
  motion: "The angled letters stand for travel and motion.", // efLogo
};

// Who EF serves, each with the year it started where a source gives one.
export const WHO = [
  { who: "Swedish teenagers", what: "on the first English trips", year: 1965, src: "efAbout" as Src },
  { who: "High-school exchange students", what: "spending a year with a host family", year: 1979, src: "wikiEF" as Src },
  { who: "Language students", what: "at EF schools in 50 cities", year: null, src: "efAbout" as Src },
  { who: "Classes on tour", what: "with their teachers, on EF Educational Tours", year: null, src: "wikiEF" as Src },
  { who: "Olympic volunteers", what: "learning languages for Seoul 1988, and every Games EF has supported since", year: 1988, src: "wikiEF" as Src },
  { who: "Au pairs", what: "living with American families", year: 1988, src: "wikiEF" as Src },
  { who: "Online learners", what: "on EF’s online English school", year: 1996, src: "wikiEF" as Src },
  { who: "MBA students", what: "at Hult International Business School", year: 2002, src: "wikiEF" as Src },
  { who: "Boarding-school students", what: "at EF Academy", year: null, src: "wikiEF" as Src },
  { who: "Grown-ups", what: "on EF Go Ahead Tours", year: null, src: "wikiEF" as Src },
  { who: "Cycling fans", what: "cheering the pink EF jerseys", year: 2017, src: "wikiTeam" as Src },
];

export const RAND = {
  life: "1914–1996",
  clients: ["IBM", "UPS", "ABC"], // efLogo; the store page also names AmEx
  philipJoined: 1993,
  bookletSigned: "Weston, Connecticut, January 1994",
};

export const CYCLING = {
  bought: 2017, // wikiEF: "In 2017, EF purchased the EF Education–EasyPost professional men's cycling team."
  saveArgyle: "#SaveArgyle", // wikiTeam: fan crowdfunding campaign
  women: 2023, // wikiEF: women's team launched
};

export const HULT = {
  bought: 2002,
  formerName: "Arthur D. Little School of Management",
  name: "Hult International Business School",
  relationship: "an independent, not-for-profit institution associated with EF Education First",
  prizeYear: 2010,
  motto: "For Those Made to Do",
  hq: "Cambridge, Massachusetts",
};

export const BOSTON = {
  hqOpened: 2014, // wikiEF: North American HQ on the Charles River, Cambridge
};

// The EF Store's own words (store.ef.com collection pages).
export const STORE_QUOTES = {
  concept:
    "As you may know a company like EF has many important rules and guidelines related to the use of its logo and brand. But with this collection we’ve completely ignored them all!",
  rand:
    "Well-known for designing only one “perfect” logo for every client, Rand broke that rule for EF and uncharacteristically designed several.",
  retro: "The EF brand has changed many times over the years.",
};
