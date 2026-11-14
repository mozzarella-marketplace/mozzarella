"use client";

import { Search } from "lucide-react";
import { useMemo, useState, type ReactNode, type FC } from "react";
import { getMessages } from "@/lib/i18n/messages";
import {
  filterCustomers,
  getCustomerTags,
} from "@/lib/marketplace/customer-filters";
import type { CustomerSummary } from "@/types/customer";
import { CustomerCard } from "./customer-card";
import { marketplaceGridClassName } from "./marketplace-grid";
import { MarketplaceHero } from "./marketplace-hero";

const FilterChip: FC<{
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ isSelected, onClick, children }) => {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
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
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const tags = useMemo(() => getCustomerTags(customers), [customers]);
  const visibleCustomers = useMemo(
    () => filterCustomers(customers, { query, tagSlugs: selectedTagSlugs }),
    [customers, query, selectedTagSlugs],
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
          <div
            role="group"
            aria-label={marketplace.filtersLabel}
            className="flex flex-wrap gap-2 pt-2"
          >
            <FilterChip
              isSelected={selectedTagSlugs.size === 0}
              onClick={() => setSelectedTagSlugs(new Set())}
            >
              {marketplace.allFilter(customers.length)}
            </FilterChip>
            {tags.map((tag) => (
              <FilterChip
                key={tag.slug}
                isSelected={selectedTagSlugs.has(tag.slug)}
                onClick={() => toggleTag(tag.slug)}
              >
                {tag.label}
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
