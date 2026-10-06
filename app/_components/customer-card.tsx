import { ArrowRight, Braces, Clock, Coins, RefreshCw } from "lucide-react";
import Link from "next/link";
import { CustomerAvatar } from "@/components/customer-avatar";
import { CustomerTags } from "@/components/customer-tags";
import { getMessages } from "@/lib/i18n/messages";
import type { CustomerSummary } from "@/types/customer";

const actionBaseClassName =
  "inline-flex items-center gap-2 rounded-control px-content py-2 text-label font-semibold transition-colors duration-standard ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";

export function CustomerCard({ customer }: { customer: CustomerSummary }) {
  const { marketplace } = getMessages();
  const actionClassName = customer.isFeatured
    ? "bg-primary text-primary-foreground hover:bg-primary/90"
    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground";

  return (
    <article className="relative flex w-full flex-col gap-content overflow-hidden rounded-panel border border-border bg-surface p-content shadow-panel">
      {customer.isFeatured && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-l from-primary via-success to-accent"
        />
      )}
      <div className="flex items-start justify-between gap-control">
        <div className="flex min-w-0 items-start gap-control">
          <CustomerAvatar avatar={customer.avatar} />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-title font-bold">{customer.name}</h2>
              {customer.isFeatured && (
                <span className="rounded-pill bg-secondary px-2 py-0.5 text-caption font-semibold text-secondary-foreground">
                  {marketplace.featured}
                </span>
              )}
            </div>
            <p className="text-caption text-muted">
              {marketplace.customerByline(
                customer.role,
                customer.businessName,
                customer.city,
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className="inline-flex items-center gap-1 rounded-pill bg-accent-soft px-3 py-1 text-label font-bold text-accent-foreground">
            <Coins aria-hidden="true" className="size-4 text-accent" />
            {marketplace.coins(customer.rewardCoins)}
          </p>
          {customer.isFeatured && (
            <p className="text-caption font-semibold text-success-foreground">
              {marketplace.guaranteedReward}
            </p>
          )}
        </div>
      </div>
      <CustomerTags customer={customer} />
      <blockquote className="grow rounded-tile bg-background px-content py-control text-label text-muted italic">
        <p>{marketplace.quoted(customer.summary)}</p>
      </blockquote>
      <div className="flex flex-wrap items-center justify-between gap-control">
        <ul className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted">
          <li className="inline-flex items-center gap-1 font-semibold text-foreground">
            <Braces aria-hidden="true" className="size-3.5 text-primary" />
            {customer.topic}
          </li>
          <li className="inline-flex items-center gap-1">
            <RefreshCw aria-hidden="true" className="size-3.5 text-success" />
            {marketplace.iterations(customer.iterationCount)}
          </li>
          <li className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            {marketplace.estimatedMinutes(customer.estimatedMinutes)}
          </li>
        </ul>
        <Link
          href={`/customers/${customer.id}`}
          className={`shrink-0 ${actionBaseClassName} ${actionClassName}`}
        >
          {marketplace.talkAction(customer.name)}
          <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </article>
  );
}
