import { z } from "zod";

const identifierSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{4}$/)
  .transform((identifier) => identifier.toUpperCase());

export const loginSchema = z.object({
  classId: identifierSchema,
  userId: identifierSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
