import type { Customer } from "@/lib/generated/prisma/client";

export type {
  CustomerCategory,
  DifficultyLevel,
} from "@/lib/generated/prisma/enums";

export type CustomerSummary = Pick<
  Customer,
  | "id"
  | "name"
  | "role"
  | "businessName"
  | "city"
  | "avatar"
  | "category"
  | "domain"
  | "difficulty"
  | "rewardCoins"
  | "topic"
  | "estimatedMinutes"
  | "summary"
>;
