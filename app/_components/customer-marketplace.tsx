"use client";

import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { CustomerCategory } from "@/lib/generated/prisma/enums";
import { getMessages } from "@/lib/i18n/messages";
import type { CustomerSummary } from "@/types/customer";
import { CustomerCard } from "./customer-card";
import { MarketplaceHero } from "./marketplace-hero";

export const marketplaceGridClassName = "grid gap-content content:grid-cols-2";

const categories = Object.values(CustomerCategory);

const matchesQuery = (customer: CustomerSummary, normalizedQuery: string) =>
  [
    customer.name,
    customer.role,
    customer.businessName,
    customer.city,
    customer.domain,
    customer.topic,
  ].some((field) => field.toLowerCase().includes(normalizedQuery));

function FilterChip({
  isSelected,
  onSelect,
  children,
}: {
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={`rounded-control px-content py-1.5 text-label font-semibold transition-colors duration-standard ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-primary/15"
      }`}
    >
      {children}
    </button>
  );
}

export function CustomerMarketplace({
  customers,
}: {
  customers: CustomerSummary[];
}) {
  const { marketplace } = getMessages();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CustomerCategory | null>(null);

  const visibleCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customers.filter(
      (customer) =>
        (selectedCategory === null || customer.category === selectedCategory) &&
        (!normalizedQuery || matchesQuery(customer, normalizedQuery)),
    );
  }, [customers, query, selectedCategory]);

  return (
    <div className="flex flex-col gap-section">
      <MarketplaceHero
        opportunityCount={customers.length}
        filters={
          <div
            role="group"
            aria-label={marketplace.filtersLabel}
            className="flex flex-wrap gap-2 pt-2"
          >
            <FilterChip
              isSelected={selectedCategory === null}
              onSelect={() => setSelectedCategory(null)}
            >
              {marketplace.allFilter(customers.length)}
            </FilterChip>
            {categories.map((category) => (
              <FilterChip
                key={category}
                isSelected={selectedCategory === category}
                onSelect={() => setSelectedCategory(category)}
              >
                {marketplace.categories[category]}
              </FilterChip>
            ))}
          </div>
        }
        search={
          <div className="relative">
            <label htmlFor="customer-search" className="sr-only">
              {marketplace.searchLabel}
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-4 my-auto size-4 text-muted"
            />
            <input
              id="customer-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={marketplace.searchPlaceholder}
              className="w-full rounded-tile border border-border bg-surface py-control ps-11 pe-content text-label shadow-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
        }
      />
      {visibleCustomers.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center gap-control rounded-panel border border-dashed border-border bg-surface px-content py-section text-center"
        >
          <h2 className="font-semibold">
            {marketplace.searchEmptyState.title}
          </h2>
          <p className="text-muted">
            {marketplace.searchEmptyState.description}
          </p>
        </div>
      ) : (
        <ul className={marketplaceGridClassName}>
          {visibleCustomers.map((customer) => (
            <li key={customer.id} className="flex">
              <CustomerCard customer={customer} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
