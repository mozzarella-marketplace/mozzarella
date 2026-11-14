import type { CustomerSummary, TagSummary } from "@/types/customer";

export type CustomerFilters = {
  query: string;
  tagSlugs: ReadonlySet<string>;
};

const matchesQuery = (customer: CustomerSummary, normalizedQuery: string) =>
  [
    customer.name,
    customer.role,
    customer.businessName,
    customer.city,
    customer.domain,
    customer.topic,
    ...customer.tags.map((tag) => tag.label),
  ].some((field) => field.toLowerCase().includes(normalizedQuery));

// A customer matches when it has any selected tag, so students can widen the list by interest.
const matchesTags = (
  customer: CustomerSummary,
  tagSlugs: ReadonlySet<string>,
) => tagSlugs.size === 0 || customer.tags.some((tag) => tagSlugs.has(tag.slug));

export const filterCustomers = (
  customers: CustomerSummary[],
  { query, tagSlugs }: CustomerFilters,
) => {
  const normalizedQuery = query.trim().toLowerCase();

  return customers.filter(
    (customer) =>
      matchesTags(customer, tagSlugs) &&
      (!normalizedQuery || matchesQuery(customer, normalizedQuery)),
  );
};

export const getCustomerTags = (customers: CustomerSummary[]): TagSummary[] =>
  [
    ...new Map(
      customers.flatMap((customer) =>
        customer.tags.map((tag) => [tag.slug, tag] as const),
      ),
    ).values(),
  ].sort((first, second) => first.label.localeCompare(second.label));
