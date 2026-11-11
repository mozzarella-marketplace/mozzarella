import { defaultLocale } from "@/consts/locales";
import type { Locale, LocaleCode } from "@/consts/locales";
import { heMessages, type Messages } from "./messages/he";

export type { Messages };

const messagesByLocale: Partial<Record<LocaleCode, Messages>> = {
  he: heMessages,
};

export const getMessages = (locale: Locale = defaultLocale): Messages =>
  messagesByLocale[locale.code] ?? messagesByLocale[defaultLocale.code]!;
