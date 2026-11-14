import type { TagSummary } from "../types/customer";

// Interests and real-world contexts students can relate to; never programming concepts.
export const seedTags = [
  { slug: "food", label: "אוכל" },
  { slug: "small-business", label: "עסק קטן" },
  { slug: "shopping", label: "קניות" },
  { slug: "flowers-and-gifts", label: "פרחים ומתנות" },
  { slug: "movies", label: "קולנוע" },
  { slug: "leisure", label: "פנאי ובילוי" },
  { slug: "animals", label: "בעלי חיים" },
  { slug: "environment", label: "איכות הסביבה" },
  { slug: "bicycles", label: "אופניים" },
  { slug: "health", label: "בריאות" },
  { slug: "sports", label: "ספורט" },
  { slug: "books", label: "ספרים" },
  { slug: "community", label: "קהילה" },
  { slug: "arts-and-crafts", label: "יצירה" },
  { slug: "families", label: "משפחות וילדים" },
  { slug: "nature", label: "טבע" },
  { slug: "volunteering", label: "התנדבות" },
  { slug: "science", label: "מדע" },
  { slug: "hiking", label: "טיולים" },
] as const satisfies readonly TagSummary[];

type SeedTagSlug = (typeof seedTags)[number]["slug"];

export const seedCustomerTagSlugs: Record<string, SeedTagSlug[]> = {
  "00000000-0000-4000-8000-000000000001": ["food", "small-business"],
  "00000000-0000-4000-8000-000000000002": ["movies", "leisure"],
  "00000000-0000-4000-8000-000000000003": ["animals", "small-business"],
  "00000000-0000-4000-8000-000000000004": ["environment", "bicycles"],
  "00000000-0000-4000-8000-000000000005": ["health", "community"],
  "00000000-0000-4000-8000-000000000006": [
    "food",
    "shopping",
    "small-business",
  ],
  "00000000-0000-4000-8000-000000000007": [
    "flowers-and-gifts",
    "small-business",
  ],
  "00000000-0000-4000-8000-000000000008": ["sports", "leisure", "families"],
  "00000000-0000-4000-8000-000000000009": ["books", "community"],
  "00000000-0000-4000-8000-000000000010": ["food", "small-business"],
  "00000000-0000-4000-8000-000000000011": [
    "arts-and-crafts",
    "community",
    "families",
  ],
  "00000000-0000-4000-8000-000000000012": [
    "nature",
    "environment",
    "volunteering",
    "community",
  ],
  "00000000-0000-4000-8000-000000000013": ["bicycles", "small-business"],
  "00000000-0000-4000-8000-000000000014": ["science", "families", "leisure"],
  "00000000-0000-4000-8000-000000000015": ["volunteering", "community"],
  "00000000-0000-4000-8000-000000000016": ["hiking", "nature", "families"],
};
