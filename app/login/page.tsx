import { LoginForm } from "@/components/forms/login-form";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getPageUser } from "@/lib/auth/current-user";
import { getReturnTo } from "@/lib/auth/return-to";
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
        <LoginForm returnTo={returnTo} />
      </section>
    </main>
  );
};

export default LoginPage;
