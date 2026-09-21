import { defaultLocale } from "@/consts/locales";
import type { Locale } from "@/types/locale";
import { heMessages, type Messages } from "./messages/he";

const messagesByLocale: Partial<Record<Locale, Messages>> = {
  he: heMessages,
};

export function getMessages(locale: Locale = defaultLocale): Messages {
  return messagesByLocale[locale] ?? messagesByLocale[defaultLocale]!;
}
