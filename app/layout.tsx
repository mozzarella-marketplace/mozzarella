import type { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { defaultLocale } from "@/consts/locales";
import { env } from "@/lib/config/env";
import { getMessages } from "@/lib/i18n/messages";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});
const messages = getMessages(defaultLocale);

export const metadata: Metadata = {
  title: messages.app.title,
  description: messages.app.description,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
      lang={defaultLocale.code}
      dir={defaultLocale.direction}
      className={heebo.variable}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
