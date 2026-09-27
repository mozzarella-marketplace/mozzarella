export const heMessages = {
  app: {
    title: "Mozzarella",
    description: "Mozzarella learning platform for basic programming",
  },
  userStory: {
    label: "סיפור המשתמש",
    placeholder: "כתבו כאן את סיפור המשתמש שגיבשתם מהשיחה עם הלקוח...",
    save: "שמירה",
    status: {
      saving: "שומר...",
      saved: "נשמר",
      error: "השמירה נכשלה, נסו שוב",
    },
  },
} as const;

export type Messages = typeof heMessages;
