"use server";

import { logger } from "@/lib/logging/logger";
import { ServerErrors } from "@/types/errors";
import { loginSchema } from "@/types/schemas";
import { redirect } from "next/navigation";

export const loginAction = async (
  prevState: ServerErrors | undefined,
  formValues: FormData,
): Promise<ServerErrors | undefined> => {
  const result = loginSchema.safeParse(Object.fromEntries(formValues));

  if (!result.success) {
    return {
      message: "יש שגיאות בטופס, נסה שוב לאחר תיקונם",
    };
  }
  //TODO: actual login in and all
  logger.info(
    `Logged in as user - [${result.data["user-code"]}], class code: [${result.data["class-code"]}}]`,
  );

  redirect("/");
};
