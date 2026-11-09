import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getPageUser } from "@/lib/auth/current-user";
import { getReturnTo } from "@/lib/auth/return-to";
import {
  BriefcaseBusiness,
  Circle,
  MessageCircle,
  TriangleAlert,
} from "lucide-react";
import { defaultLocale } from "@/consts/locales";
import { getMessages } from "@/lib/i18n/messages";
import type { FC } from "react";

const messages = getMessages(defaultLocale).login;

const LoginPage: FC<{
  searchParams: Promise<{ returnTo?: string | string[] }>;
}> = async ({ searchParams }) => {
  const requestedReturnTo = (await searchParams).returnTo;
  const returnTo = getReturnTo(
    typeof requestedReturnTo === "string" ? requestedReturnTo : undefined,
  );
  const user = await getPageUser(returnTo);

  if (user) {
    redirect(returnTo);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-section bg-background-subtle px-page-inline py-section text-center">
      <header className="flex flex-col items-center">
        <div className="w-64">
          <Image
            src="/logo-horizontal.svg"
            alt={messages.brandName}
            width={984}
            height={244}
            sizes="256px"
            priority
            className="h-auto w-full"
          />
        </div>
      </header>

      <section className="flex w-full max-w-lg flex-col items-center gap-content">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading font-bold">{messages.welcomeTitle}</h2>
          <p className="text-muted">{messages.welcomeDescription}</p>
        </div>

        <LoginForm returnTo={returnTo} />

        <div className="flex flex-col gap-control text-label">
          <div className="flex items-start gap-2 text-start font-semibold">
            <Circle className="mt-1 size-2.5 shrink-0 fill-success text-success" />
            {messages.customerPromise}
          </div>
          <div className="flex flex-wrap justify-center gap-x-content gap-y-control font-semibold">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="size-4 fill-accent-strong" />
              {messages.businessCustomers}
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" />
              {messages.conversation}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 font-semibold">
            <TriangleAlert className="size-4 fill-accent" />
            {messages.coins}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
