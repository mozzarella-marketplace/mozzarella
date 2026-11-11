import type { FC } from "react";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { CustomerAvatar } from "@/components/customer-avatar";
import { CustomerConversation } from "@/components/customer-conversation";
import { CustomerTags } from "@/components/customer-tags";
import { UserStoryWorkspace } from "@/components/user-story-workspace";
import { getPageUser } from "@/lib/auth/current-user";
import { getLoginUrl } from "@/lib/auth/return-to";
import { getActiveCustomer } from "@/lib/marketplace/customers";
import { prisma } from "@/prisma/prisma";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";

const CustomerPage: FC<{
  params: Promise<{ id: string }>;
}> = async ({ params }) => {
  const { id } = await params;
  const parsedCustomerId = z.uuid().safeParse(id);

  if (!parsedCustomerId.success) {
    notFound();
  }

  const returnTo = `/marketplace/${parsedCustomerId.data}`;
  const user = await getPageUser(returnTo);

  if (!user) {
    redirect(getLoginUrl(returnTo));
  }

  const customer = await getActiveCustomer(parsedCustomerId.data);

  if (!customer) {
    notFound();
  }

  const { marketplace } = getMessages();
  const sessionId = `${user.id}:${customer.id}`;
  let userStory;
  let conversation;

  try {
    [userStory, conversation] = await Promise.all([
      prisma.userStory.findUnique({
        where: { sessionId },
        select: { content: true, language: true },
      }),
      prisma.conversationMessage.findMany({
        where: { sessionId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true, role: true, content: true },
      }),
    ]);
  } catch (error) {
    logger.error("Customer workspace query failed");
    throw error;
  }

  return (
    <section className="mx-auto flex max-w-content flex-col gap-section px-page-inline py-section">
      <article className="flex flex-col gap-content rounded-panel border border-border bg-background p-content shadow-panel content:p-section">
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
        <blockquote className="rounded-tile bg-background-subtle px-content py-control text-muted italic">
          <p>{marketplace.quoted(customer.summary)}</p>
        </blockquote>
      </article>
      <div className="grid items-start gap-section lg:grid-cols-2">
        <CustomerConversation
          key={`conversation:${customer.id}`}
          customerId={customer.id}
          customerName={customer.name}
          initialMessages={conversation}
        />
        <UserStoryWorkspace
          key={`user-story:${customer.id}`}
          customerId={customer.id}
          customerName={customer.name}
          savedContent={userStory?.content ?? null}
          savedLanguage={userStory?.language ?? null}
        />
      </div>
    </section>
  );
};

export default CustomerPage;
