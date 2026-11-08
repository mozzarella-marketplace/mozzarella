import { headers } from "next/headers";
import type { FC, ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultLocale, getLocaleConfig } from "@/consts/locales";
import { getPageUser } from "@/lib/auth/current-user";
import {
  getLoginUrl,
  getReturnTo,
  RETURN_TO_HEADER,
} from "@/lib/auth/return-to";
import { redirect } from "next/navigation";

const ProtectedLayout: FC<Readonly<{ children: ReactNode }>> = async ({
  children,
}) => {
  const returnTo = getReturnTo((await headers()).get(RETURN_TO_HEADER));
  const user = await getPageUser(returnTo);

  if (!user) {
    redirect(getLoginUrl(returnTo));
  }

  const locale = getLocaleConfig(defaultLocale);

  return (
    <div className="flex h-dvh w-full flex-col">
      <SiteHeader />
      <div className="flex min-h-0 w-full grow">
        <ScrollArea className="size-full" dir={locale.direction}>
          <main>{children}</main>
          <SiteFooter />
        </ScrollArea>
      </div>
    </div>
  );
};

export default ProtectedLayout;
