import type { FC } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { CustomerAvatar } from "@/components/customer-avatar";
import { CustomerTags } from "@/components/customer-tags";
import { getActiveCustomer } from "@/lib/customers";
import { getMessages } from "@/lib/i18n/messages";

const CustomerPage: FC<{
  params: Promise<{ customerId: string }>;
}> = async ({ params }) => {
  const { customerId } = await params;
  const parsedCustomerId = z.string().uuid().safeParse(customerId);

  if (!parsedCustomerId.success) {
    notFound();
  }

  const customer = await getActiveCustomer(parsedCustomerId.data);

  if (!customer) {
    notFound();
  }

  const { customers, marketplace } = getMessages();

  return (
    <main className="mx-auto flex max-w-content flex-col gap-section px-page-inline py-section">
      <Link
        href="/"
        className="self-start rounded-control font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {customers.backToMarketplace}
      </Link>
      <article className="flex flex-col gap-content rounded-panel border border-border bg-surface p-content shadow-panel content:p-section">
        <div className="flex items-start gap-control">
          <CustomerAvatar avatar={customer.avatar} />
          <div className="flex flex-col gap-1">
            <h1 className="text-heading font-extrabold">{customer.name}</h1>
            <p className="text-label text-muted">
              {marketplace.customerByline(
                customer.role,
                customer.businessName,
                customer.city,
              )}
            </p>
          </div>
        </div>
        <CustomerTags customer={customer} />
        <blockquote className="rounded-tile bg-background px-content py-control text-muted italic">
          <p>{marketplace.quoted(customer.summary)}</p>
        </blockquote>
      </article>
    </main>
  );
};

export default CustomerPage;
