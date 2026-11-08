import type { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
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
  icons: {
    icon: [{ url: "/mozzarella-icon.png", type: "image/png" }],
  },
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
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
