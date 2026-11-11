import { z } from "zod";
import customerData from "./customers.json";
import { customerProblemBriefSchema } from "../lib/customer-problem";
import { prisma } from "../lib/db/prisma";
import {
  CustomerCategory,
  DifficultyLevel,
} from "../lib/generated/prisma/enums";
import { logger } from "../lib/logging/logger";

const rewardByDifficulty = {
  beginner: 80,
  intermediate: 130,
  advanced: 180,
} as const;

const requiredText = z.string().trim().min(1);
const customerSchema = z

  .strictObject({
    id: z.uuid(),
    name: requiredText,
    role: requiredText,
    businessName: requiredText,
    city: requiredText,
    avatar: requiredText,
    category: z.enum(CustomerCategory),
    domain: requiredText,
    difficulty: z.enum(DifficultyLevel),
    rewardCoins: z.number().int().positive(),
    topic: requiredText,
    summary: requiredText,
    isActive: z.literal(true),
    problemBrief: customerProblemBriefSchema.refine(
      (brief) => brief.background !== undefined,
      { message: "Catalog customers must include a background" },
    ),
  })

  .refine(
    (customer) =>
      customer.rewardCoins === rewardByDifficulty[customer.difficulty],
    { message: "Customer reward must match its difficulty" },
  );

const customerCatalogSchema = z

  .array(customerSchema)

  .length(20)

  .refine((customers) => new Set(customers.map(({ id }) => id)).size === 20, {
    message: "Customer IDs must be distinct",
  })

  .refine(
    (customers) =>
      new Set(customers.map(({ businessName }) => businessName)).size === 20,
    { message: "Customer businesses must be distinct" },
  );

// Retire only the old seed-owned examples; preserve their rows and conversations.
const legacyCustomerIds = Array.from(
  { length: 16 },
  (_, index) =>
    `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
);

const seedCustomers = async () => {
  const customers = customerCatalogSchema.parse(customerData);

  await prisma.$transaction(async (transaction) => {
    await transaction.customer.updateMany({
      where: { id: { in: legacyCustomerIds }, isActive: true },
      data: { isActive: false },
    });

    for (const customer of customers) {
      await transaction.customer.upsert({
        where: { id: customer.id },
        create: customer,
        update: customer,
      });
    }
  });

  logger.info(
    "Seeded 20 active customer scenarios; legacy examples preserved as inactive",
  );
};

seedCustomers()

  .catch(() => {
    logger.error(
      "Customer seed failed; check catalog validation and database availability",
    );
    process.exitCode = 1;
  })

  .finally(() => prisma.$disconnect());
