import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { FC, ReactNode } from "react";
import { getPageUser } from "@/lib/auth/current-user";
import {
  getLoginUrl,
  getReturnTo,
  RETURN_TO_HEADER,
} from "@/lib/auth/return-to";

const ProtectedLayout: FC<Readonly<{ children: ReactNode }>> = async ({
  children,
}) => {
  const returnTo = getReturnTo((await headers()).get(RETURN_TO_HEADER));
  const user = await getPageUser(returnTo);

  if (!user) {
    redirect(getLoginUrl(returnTo));
  }

  return children;
};

export default ProtectedLayout;
