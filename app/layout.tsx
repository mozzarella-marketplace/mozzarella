import type { Metadata } from "next";
import "./globals.css";
import { defaultLocale, getLocaleConfig } from "@/consts/locales";
import { env } from "@/lib/config/env";
import { getMessages } from "@/lib/i18n/messages";

const locale = getLocaleConfig(defaultLocale);
const messages = getMessages(defaultLocale);

export const metadata: Metadata = {
  title: messages.app.title,
  description: messages.app.description,
  metadataBase: env.NEXT_PUBLIC_APP_URL
    ? new URL(env.NEXT_PUBLIC_APP_URL)
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} dir={locale.direction}>
      <body>{children}</body>
    </html>
  );
}
