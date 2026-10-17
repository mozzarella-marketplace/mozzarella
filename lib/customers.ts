import { prisma } from "@/lib/db/prisma";
import type { CustomerSummary } from "@/types/customer";

const customerSummarySelection = {
  id: true,
  name: true,
  role: true,
  businessName: true,
  city: true,
  avatar: true,
  category: true,
  domain: true,
  difficulty: true,
  rewardCoins: true,
  topic: true,
  estimatedMinutes: true,
  summary: true,
} as const satisfies Record<keyof CustomerSummary, true>;

export const getActiveCustomers = (): Promise<CustomerSummary[]> =>
  prisma.customer.findMany({
    where: { isActive: true },
    select: customerSummarySelection,
    orderBy: { createdAt: "asc" },
  });

export const getActiveCustomer = (
  customerId: string,
): Promise<CustomerSummary | null> =>
  prisma.customer.findFirst({
    where: { id: customerId, isActive: true },
    select: customerSummarySelection,
  });
