export const localeConfig = {
  he: {
    direction: "rtl",
  },
  en: {
    direction: "ltr",
  },
} as const;

export type Locale = keyof typeof localeConfig;
export type TextDirection = (typeof localeConfig)[Locale]["direction"];

export const defaultLocale: Locale = "he";

export function getLocaleConfig(locale: Locale = defaultLocale) {
  return localeConfig[locale];
}
