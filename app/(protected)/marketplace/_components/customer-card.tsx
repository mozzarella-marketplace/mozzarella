import type { FC } from "react";
import { ArrowRight, Braces, Coins } from "lucide-react";
import Link from "next/link";
import { CustomerAvatar } from "@/components/customer-avatar";
import { CustomerTags } from "@/components/customer-tags";
import { getMessages } from "@/lib/i18n/messages";
import type { CustomerSummary } from "@/types/customer";

const actionClassName =
  "inline-flex shrink-0 items-center gap-2 rounded-control bg-secondary px-content py-2 text-label font-semibold text-secondary-foreground transition-colors duration-standard ease-standard hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none";

export const CustomerCard: FC<{ customer: CustomerSummary }> = ({
  customer,
}) => {
  const { marketplace } = getMessages();

  return (
    <article className="flex w-full flex-col gap-content rounded-panel border border-border bg-background p-content shadow-panel">
      <div className="flex items-start justify-between gap-control">
        <div className="flex min-w-0 items-start gap-control">
          <CustomerAvatar avatar={customer.avatar} />
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-title font-bold">{customer.name}</h2>
            <p className="text-caption text-muted">
              {marketplace.customerByline(
                customer.role,
                customer.businessName,
                customer.city,
              )}
            </p>
          </div>
        </div>
        <p className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-accent-soft px-3 py-1 text-label font-bold text-accent-foreground">
          <Coins aria-hidden="true" className="size-4 text-accent" />
          {marketplace.coins(customer.rewardCoins)}
        </p>
      </div>
      <CustomerTags customer={customer} />
      <blockquote className="grow rounded-tile bg-background-subtle px-content py-control text-label text-muted italic">
        <p>{marketplace.quoted(customer.summary)}</p>
      </blockquote>
      <div className="flex flex-wrap items-center justify-between gap-control">
        <p className="inline-flex min-w-0 items-center gap-1 text-caption font-semibold">
          <Braces
            aria-hidden="true"
            className="size-3.5 shrink-0 text-primary"
          />
          {customer.topic}
        </p>
        <Link href={`/marketplace/${customer.id}`} className={actionClassName}>
          {marketplace.talkAction(customer.name)}
          <ArrowRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
        </Link>
      </div>
    </article>
  );
};
