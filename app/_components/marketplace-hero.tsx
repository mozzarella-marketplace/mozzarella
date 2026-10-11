import type { ReactNode, FC } from "react";
import { getMessages } from "@/lib/i18n/messages";

export const MarketplaceHero: FC<{
  opportunityCount?: number;
  filters?: ReactNode;
  search?: ReactNode;
}> = ({ opportunityCount, filters, search }) => {
  const { marketplace } = getMessages();

  return (
    <section
      aria-labelledby="marketplace-title"
      className="flex flex-col gap-section rounded-panel border border-border bg-linear-to-bl from-secondary via-surface to-secondary p-content content:flex-row content:items-end content:justify-between content:p-section"
    >
      <div className="flex flex-col gap-control">
        <p className="inline-flex items-center gap-2 self-start rounded-pill bg-surface px-3 py-1 text-caption font-semibold shadow-panel">
          <span aria-hidden="true" className="size-2 rounded-pill bg-success" />
          <span className="text-secondary-foreground">
            {marketplace.status}
          </span>
          {opportunityCount !== undefined && (
            <span>{marketplace.opportunities(opportunityCount)}</span>
          )}
        </p>
        <h1
          id="marketplace-title"
          className="text-heading font-extrabold content:text-display"
        >
          {marketplace.title}
        </h1>
        <p className="text-muted">{marketplace.subtitle}</p>
        {filters}
      </div>
      {search && <div className="w-full content:max-w-sm">{search}</div>}
    </section>
  );
};
