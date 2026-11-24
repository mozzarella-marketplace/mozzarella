export const localeConfig = {
  he: {
    code: "he",
    direction: "rtl",
    name: "Hebrew",
  },
  ar: {
    code: "ar",
    direction: "rtl",
    name: "Arabic",
  },
  en: {
    code: "en",
    direction: "ltr",
    name: "English",
  },
  ru: {
    code: "ru",
    direction: "ltr",
    name: "Russian",
  },
  am: {
    code: "am",
    direction: "ltr",
    name: "Amharic",
  },
} as const;

export type Locale = (typeof localeConfig)[keyof typeof localeConfig];
export type LocaleCode = Locale["code"];
export type TextDirection = Locale["direction"];

export const defaultLocale: Locale = localeConfig.he;
