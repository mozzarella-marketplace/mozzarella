export const heMessages = {
  app: {
    title: "Mozzarella",
    description: "Mozzarella learning platform for basic programming",
  },
  auth: {
    login: {
      invalidInput:
        "מזהה משתמש וכיתה חייבים להכיל בדיוק ארבע תווים",
      invalidCredentials: "מזהה משתמש או כיתה שגויים",
      unavailable: "התחברות אינה זמינה כרגע",
    },
  },
} as const;

export type Messages = typeof heMessages;
