import "server-only";
import { prisma } from "@/lib/db/prisma";
import { AuthError, getCurrentUser } from "@/lib/auth/current-user";
import { logger } from "@/lib/logging/logger";
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
  summary: true,
} as const satisfies Record<keyof CustomerSummary, true>;

export const getActiveCustomers = async (): Promise<CustomerSummary[]> => {
  if (!(await getCurrentUser())) {
    throw new AuthError(401, "Authentication required");
  }

  try {
    return await prisma.customer.findMany({
      where: { isActive: true },
      select: customerSummarySelection,
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    logger.error("Marketplace customer query failed");
    throw error;
  }
};

export const getActiveCustomer = async (
  customerId: string,
): Promise<CustomerSummary | null> => {
  if (!(await getCurrentUser())) {
    throw new AuthError(401, "Authentication required");
  }

  try {
    return await prisma.customer.findFirst({
      where: { id: customerId, isActive: true },
      select: customerSummarySelection,
    });
  } catch (error) {
    logger.error("Marketplace customer detail query failed");
    throw error;
  }
};
