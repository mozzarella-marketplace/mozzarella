import { defaultLocale } from "@/consts/locales";
import type { Locale } from "@/types/locale";
import { heMessages, type Messages } from "./messages/he";

export type { Messages };

const messagesByLocale: Partial<Record<Locale, Messages>> = {
  he: heMessages,
};

export const getMessages = (locale: Locale = defaultLocale): Messages =>
  messagesByLocale[locale] ?? messagesByLocale[defaultLocale]!;
