import Link from "next/link";
import { notFound } from "next/navigation";
import type { FC } from "react";
import { z } from "zod";
import { getMessages } from "@/lib/i18n/messages";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logging/logger";
import type { CustomerSummary } from "@/types/customer";

const customerIdSchema = z.string().uuid();

const CustomerPage: FC<{
  params: Promise<{ id: string }>;
}> = async ({ params }) => {
  const { id } = await params;

  if (!customerIdSchema.safeParse(id).success) {
    notFound();
  }

  let customer: CustomerSummary | null;

  try {
    customer = await prisma.customer.findFirst({
      where: { id, isActive: true },
    });
  } catch (error) {
    logger.error("Marketplace customer detail query failed");
    throw error;
  }

  if (!customer) {
    notFound();
  }

  const messages = getMessages().marketplace;

  return (
    <article className="mx-auto flex w-full max-w-content flex-col gap-6 p-page-inline">
      <Link
        href="/marketplace"
        className="w-fit rounded-control text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        {messages.backToMarketplace}
      </Link>
      <header className="flex items-center gap-4">
        <span aria-hidden="true" className="text-5xl">
          {customer.avatar}
        </span>
        <div>
          <p className="text-muted">{messages.customer}</p>
          <h1 className="text-heading font-semibold">
            {customer.businessName}
          </h1>
          <p>
            {customer.name} · {customer.role}
          </p>
        </div>
      </header>
      <dl className="grid gap-4 rounded-panel border border-border bg-background p-content sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">{messages.location}</dt>
          <dd>{customer.city}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">{messages.domain}</dt>
          <dd>{customer.domain}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">{messages.category}</dt>
          <dd>{messages.categories[customer.category]}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">{messages.difficulty}</dt>
          <dd>{messages.difficulties[customer.difficulty]}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">{messages.topic}</dt>
          <dd>{customer.topic}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">{messages.reward}</dt>
          <dd>
            <bdi dir="ltr">{customer.rewardCoins}</bdi> {messages.coins}
          </dd>
        </div>
      </dl>
      <section className="space-y-2 rounded-panel border border-border bg-background p-content">
        <h2 className="font-semibold">{messages.customerNeed}</h2>
        <p>{customer.summary}</p>
      </section>
    </article>
  );
};

export default CustomerPage;
