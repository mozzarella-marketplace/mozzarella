import type { Customer } from "@/lib/generated/prisma/client";

export type {
  CustomerCategory,
  DifficultyLevel,
  ProgrammingLanguage,
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
  | "language"
  | "difficulty"
  | "rewardCoins"
  | "topic"
  | "iterationCount"
  | "estimatedMinutes"
  | "summary"
  | "isFeatured"
>;
