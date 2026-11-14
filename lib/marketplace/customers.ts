import "server-only";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { getPageUser } from "@/lib/auth/current-user";
import { getLoginUrl } from "@/lib/auth/return-to";
import { logger } from "@/lib/logging/logger";
import type { CustomerSummary } from "@/types/customer";

const customerSummarySelection = {
  id: true,
  name: true,
  role: true,
  businessName: true,
  city: true,
  avatar: true,
  domain: true,
  difficulty: true,
  rewardCoins: true,
  topic: true,
  summary: true,
  tags: {
    select: { tag: { select: { slug: true, label: true } } },
    orderBy: { tag: { label: "asc" } },
  },
} as const satisfies Record<keyof CustomerSummary, unknown>;

type CustomerRecord = Omit<CustomerSummary, "tags"> & {
  tags: { tag: CustomerSummary["tags"][number] }[];
};

const toCustomerSummary = ({
  tags,
  ...customer
}: CustomerRecord): CustomerSummary => ({
  ...customer,
  tags: tags.map(({ tag }) => tag),
});

const requireCustomerPageUser = async (returnTo: string) => {
  if (!(await getPageUser(returnTo))) {
    redirect(getLoginUrl(returnTo));
  }
};

export const getActiveCustomers = async (): Promise<CustomerSummary[]> => {
  await requireCustomerPageUser("/marketplace");

  try {
    const customers = await prisma.customer.findMany({
      where: { isActive: true },
      select: customerSummarySelection,
      orderBy: { createdAt: "asc" },
    });

    return customers.map(toCustomerSummary);
  } catch (error) {
    logger.error("Marketplace customer query failed");
    throw error;
  }
};

export const getActiveCustomer = async (
  customerId: string,
): Promise<CustomerSummary | null> => {
  await requireCustomerPageUser(`/marketplace/${customerId}`);

  try {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, isActive: true },
      select: customerSummarySelection,
    });

    return customer && toCustomerSummary(customer);
  } catch (error) {
    logger.error("Marketplace customer detail query failed");
    throw error;
  }
};
