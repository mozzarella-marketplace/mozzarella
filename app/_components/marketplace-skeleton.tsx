import type { FC } from "react";
import { getMessages } from "@/lib/i18n/messages";
import { marketplaceGridClassName } from "./customer-marketplace";
import { MarketplaceHero } from "./marketplace-hero";

const placeholderCardCount = 4;
const pulseClassName = "animate-pulse motion-reduce:animate-none";

export const MarketplaceSkeleton: FC = () => {
  const { marketplace } = getMessages();

  return (
    <div role="status" className="flex flex-col gap-section">
      <span className="sr-only">{marketplace.loading}</span>
      <MarketplaceHero
        filters={
          <div
            aria-hidden="true"
            className={`flex gap-2 pt-2 ${pulseClassName}`}
          >
            <div className="h-8 w-20 rounded-control bg-secondary" />
            <div className="h-8 w-24 rounded-control bg-secondary" />
            <div className="h-8 w-24 rounded-control bg-secondary" />
          </div>
        }
        search={
          <div
            aria-hidden="true"
            className={`h-12 rounded-tile bg-surface shadow-panel ${pulseClassName}`}
          />
        }
      />
      <ul aria-hidden="true" className={marketplaceGridClassName}>
        {Array.from({ length: placeholderCardCount }, (_, index) => (
          <li
            key={index}
            className={`flex flex-col gap-content rounded-panel border border-border bg-surface p-content shadow-panel ${pulseClassName}`}
          >
            <div className="flex items-start justify-between gap-control">
              <div className="flex grow items-center gap-control">
                <div className="size-14 shrink-0 rounded-tile bg-secondary" />
                <div className="flex grow flex-col gap-2">
                  <div className="h-5 w-1/3 rounded-control bg-secondary" />
                  <div className="h-4 w-1/2 rounded-control bg-secondary" />
                </div>
              </div>
              <div className="h-7 w-24 rounded-pill bg-accent-soft" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-control bg-neutral-soft" />
              <div className="h-6 w-16 rounded-control bg-neutral-soft" />
            </div>
            <div className="h-20 rounded-tile bg-background" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded-control bg-neutral-soft" />
              <div className="h-9 w-28 rounded-control bg-secondary" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
