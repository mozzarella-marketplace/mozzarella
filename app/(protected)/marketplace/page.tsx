import Link from "next/link";
import type { FC } from "react";
import { getMessages } from "@/lib/i18n/messages";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logging/logger";
import type { CustomerSummary } from "@/types/customer";

const MarketplacePage: FC = async () => {
  const messages = getMessages().marketplace;
  let customers: CustomerSummary[];

  try {
    customers = await prisma.customer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    logger.error("Marketplace customer query failed");
    throw error;
  }

  return (
    <section className="mx-auto w-full max-w-content space-y-6 p-page-inline">
      <header className="space-y-2">
        <h1 className="text-heading font-semibold">{messages.title}</h1>
        <p className="text-muted">{messages.description}</p>
      </header>
      {customers.length === 0 ? (
        <div className="rounded-panel border border-border bg-background p-content">
          <h2 className="font-semibold">{messages.emptyTitle}</h2>
          <p className="mt-2 text-muted">{messages.emptyDescription}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/marketplace/${customer.id}`}
              className="group flex h-full flex-col gap-4 rounded-panel border border-border bg-background p-content shadow-panel transition-shadow hover:shadow-floating focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <article className="flex h-full flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-3xl">
                    {customer.avatar}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold group-hover:text-primary">
                      {customer.businessName}
                    </h2>
                    <p className="text-sm text-muted">
                      {customer.name} · {customer.role} · {customer.city}
                    </p>
                  </div>
                </div>
                <p className="grow">{customer.summary}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-pill bg-secondary px-3 py-1 text-label">
                    {messages.categories[customer.category]}
                  </span>
                  <span className="rounded-pill bg-secondary px-3 py-1 text-label">
                    {messages.difficulties[customer.difficulty]}
                  </span>
                </div>
                <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3 text-sm">
                  <span>
                    {messages.topic}: {customer.topic}
                  </span>
                  <span>
                    <bdi dir="ltr">{customer.rewardCoins}</bdi> {messages.coins}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MarketplacePage;
