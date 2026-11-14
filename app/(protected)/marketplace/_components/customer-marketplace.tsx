"use client";

import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode, type FC } from "react";
import { CustomerCategory } from "@/lib/generated/prisma/enums";
import { getMessages } from "@/lib/i18n/messages";
import {
  filterCustomers,
  getCustomerTags,
} from "@/lib/marketplace/customer-filters";
import type { CustomerSummary } from "@/types/customer";
import { CustomerCard } from "./customer-card";
import { marketplaceGridClassName } from "./marketplace-grid";
import { MarketplaceHero } from "./marketplace-hero";

const categories = Object.values(CustomerCategory);

const FilterChip: FC<{
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
}> = ({ isSelected, onSelect, children }) => {
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
};

const TagFilterChip: FC<{
  isSelected: boolean;
  onToggle: () => void;
  children: ReactNode;
}> = ({ isSelected, onToggle, children }) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={`rounded-pill border px-3 py-1 text-caption font-medium transition-colors duration-standard ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${
        isSelected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted hover:border-primary hover:text-secondary-foreground"
      }`}
    >
      {children}
    </button>
  );
};

export const CustomerMarketplace: FC<{
  customers: CustomerSummary[];
}> = ({ customers }) => {
  const { marketplace } = getMessages();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CustomerCategory | null>(null);
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const tags = useMemo(() => getCustomerTags(customers), [customers]);
  const visibleCustomers = useMemo(
    () =>
      filterCustomers(customers, {
        query,
        category: selectedCategory,
        tagSlugs: selectedTagSlugs,
      }),
    [customers, query, selectedCategory, selectedTagSlugs],
  );

  const toggleTag = (slug: string) =>
    setSelectedTagSlugs((current) => {
      const next = new Set(current);

      if (!next.delete(slug)) {
        next.add(slug);
      }

      return next;
    });

  return (
    <div className="flex flex-col gap-section">
      <MarketplaceHero
        opportunityCount={customers.length}
        filters={
          <div className="flex flex-col gap-control pt-2">
            <div
              role="group"
              aria-label={marketplace.filtersLabel}
              className="flex flex-wrap gap-2"
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
            {tags.length > 0 && (
              <div
                role="group"
                aria-labelledby="customer-tag-filters-label"
                className="flex flex-wrap items-center gap-2"
              >
                <span
                  id="customer-tag-filters-label"
                  className="text-caption font-semibold text-muted"
                >
                  {marketplace.tagFiltersLabel}
                </span>
                {tags.map((tag) => (
                  <TagFilterChip
                    key={tag.slug}
                    isSelected={selectedTagSlugs.has(tag.slug)}
                    onToggle={() => toggleTag(tag.slug)}
                  >
                    {tag.label}
                  </TagFilterChip>
                ))}
              </div>
            )}
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
              className="w-full rounded-tile border border-border bg-background py-control ps-11 pe-content text-label shadow-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>
        }
      />
      {visibleCustomers.length === 0 ? (
        <div
          role="status"
          className="flex flex-col items-center gap-control rounded-panel border border-dashed border-border bg-background px-content py-section text-center"
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
};
