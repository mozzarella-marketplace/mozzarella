import z from "zod";
import type { Messages } from "@/lib/i18n/messages";

const LOGIN_CODE_PATTERN = /^[0-9A-Fa-f]*$/;

export const isLoginCodeValid = (value: string) =>
  value.length === 4 && LOGIN_CODE_PATTERN.test(value);

export const createLoginSchema = (
  validationMessages: Messages["login"]["validation"],
) => {
  const code = z
    .string(validationMessages.required)
    .length(4, validationMessages.length)
    .regex(LOGIN_CODE_PATTERN, validationMessages.format)
    .transform((identifier) => identifier.toUpperCase());

  return z.object({
    "class-code": code,
    "student-code": code,
  });
};

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
