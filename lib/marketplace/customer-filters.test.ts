import assert from "node:assert/strict";
import test from "node:test";
import type { CustomerSummary } from "@/types/customer";
import { filterCustomers, getCustomerTags } from "./customer-filters";

const createCustomer = (
  overrides: Partial<CustomerSummary> & Pick<CustomerSummary, "id">,
): CustomerSummary => ({
  name: "לקוח",
  role: "בעלים",
  businessName: "עסק",
  city: "חיפה",
  avatar: "🙂",
  category: "smallBusiness",
  domain: "שירות",
  difficulty: "beginner",
  rewardCoins: 80,
  topic: "נושא",
  summary: "תיאור",
  tags: [],
  ...overrides,
});

const food = { slug: "food", label: "אוכל" };
const sports = { slug: "sports", label: "ספורט" };
const bakery = createCustomer({ id: "bakery", tags: [food] });
const pool = createCustomer({
  id: "pool",
  category: "ticketingSystems",
  tags: [sports],
});
const library = createCustomer({ id: "library", tags: [] });
const customers = [bakery, pool, library];
const noFilters = { query: "", category: null, tagSlugs: new Set<string>() };

const ids = (result: CustomerSummary[]) => result.map(({ id }) => id);

test("returns every customer when no filters are set", () => {
  assert.deepEqual(ids(filterCustomers(customers, noFilters)), [
    "bakery",
    "pool",
    "library",
  ]);
});

test("keeps customers that have any selected tag", () => {
  assert.deepEqual(
    ids(
      filterCustomers(customers, {
        ...noFilters,
        tagSlugs: new Set(["food", "sports"]),
      }),
    ),
    ["bakery", "pool"],
  );
});

test("matches search text against tag labels", () => {
  assert.deepEqual(
    ids(filterCustomers(customers, { ...noFilters, query: " ספורט " })),
    ["pool"],
  );
});

test("combines tag and category filters", () => {
  assert.deepEqual(
    ids(
      filterCustomers(customers, {
        ...noFilters,
        category: "smallBusiness",
        tagSlugs: new Set(["food", "sports"]),
      }),
    ),
    ["bakery"],
  );
});

test("lists each tag once, sorted by label", () => {
  assert.deepEqual(
    getCustomerTags([
      pool,
      bakery,
      createCustomer({ id: "cafe", tags: [food] }),
    ]),
    [food, sports],
  );
});
