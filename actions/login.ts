"use server";

import { defaultLocale } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";
import { logger } from "@/lib/logging/logger";
import { ServerErrors } from "@/types/errors";
import { createLoginSchema } from "@/types/schemas";
import { redirect } from "next/navigation";

const loginMessages = getMessages(defaultLocale).login;
const loginSchema = createLoginSchema(loginMessages.validation);

export const loginAction = async (
  prevState: ServerErrors | undefined,
  formValues: FormData,
): Promise<ServerErrors | undefined> => {
  const result = loginSchema.safeParse(Object.fromEntries(formValues));

  if (!result.success) {
    return {
      message: loginMessages.validation.formError,
    };
  }
  //TODO: actual login in and all
  logger.info(
    `Logged in as user - [${result.data["student-code"]}], class code: [${result.data["class-code"]}}]`,
  );

  redirect("/");
};
