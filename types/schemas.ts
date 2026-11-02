import z from "zod";
import type { Messages } from "@/lib/i18n/messages";

export const createLoginSchema = (
  validationMessages: Messages["login"]["validation"],
) => {
  const code = z
    .string(validationMessages.required)
    .length(4, validationMessages.length)
    .regex(/^[0-9A-F]*$/, validationMessages.format);

  return z.object({
    "class-code": code,
    "student-code": code,
  });
};

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
