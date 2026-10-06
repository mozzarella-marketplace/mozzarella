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
  language: true,
  difficulty: true,
  rewardCoins: true,
  topic: true,
  iterationCount: true,
  estimatedMinutes: true,
  summary: true,
  isFeatured: true,
} as const satisfies Record<keyof CustomerSummary, true>;

export function getActiveCustomers(): Promise<CustomerSummary[]> {
  return prisma.customer.findMany({
    where: { isActive: true },
    select: customerSummarySelection,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
  });
}

export function getActiveCustomer(
  customerId: string,
): Promise<CustomerSummary | null> {
  return prisma.customer.findFirst({
    where: { id: customerId, isActive: true },
    select: customerSummarySelection,
  });
}
