import { headers } from "next/headers";
import type { FC, ReactNode } from "react";
import { Navbar } from "@/components/custom-ui/navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultLocale, getLocaleConfig } from "@/consts/locales";
import { getPageUser } from "@/lib/auth/current-user";
import { getMessages } from "@/lib/i18n/messages";
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
  const messages = getMessages(defaultLocale);

  return (
    <div className="flex min-h-dvh w-full flex-col gap-4 px-6">
      <Navbar
        studentData={{ classCode: user.classId, studentCode: user.userId }}
        messages={messages.appShell}
      />
      <main className="flex min-h-0 w-full grow">
        <ScrollArea className="size-full" dir={locale.direction}>
          {children}
        </ScrollArea>
      </main>
    </div>
  );
};

export default ProtectedLayout;
