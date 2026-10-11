import type { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { defaultLocale, getLocaleConfig } from "@/consts/locales";
import { env } from "@/lib/config/env";
import { getMessages } from "@/lib/i18n/messages";

const locale = getLocaleConfig(defaultLocale);
const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
});
const messages = getMessages(defaultLocale);

export const metadata: Metadata = {
  title: messages.app.title,
  description: messages.app.description,
  metadataBase: env.NEXT_PUBLIC_APP_URL
    ? new URL(env.NEXT_PUBLIC_APP_URL)
    : undefined,
};

const RootLayout: FC<
  Readonly<{
    children: ReactNode;
  }>
> = ({ children }) => {
  return (
    <html
      lang={defaultLocale}
      dir={locale.direction}
      className={rubik.variable}
    >
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="grow">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
};

export default RootLayout;
