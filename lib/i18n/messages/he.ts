export const heMessages = {
  app: {
    title: "Mozzarella",
    description: "Mozzarella learning platform for basic programming",
  },
  programmingLanguages: {
    java: "Java",
    csharp: "C#",
  },
  userStory: {
    title: "מה הבנתי מהלקוח עד כה",
    language: "שפת פיתוח",
    languagePlaceholder: "בחרו שפה",
    label: "סיפור המשתמש",
    placeholder: "כתבו כאן את סיפור המשתמש שגיבשתם מהשיחה עם הלקוח...",
    save: "שמירה",
    status: {
      saving: "שומר...",
      saved: "נשמר",
      error: "השמירה נכשלה, נסו שוב",
    },
    editor: {
      toolbar: "עיצוב טקסט",
      bold: "מודגש",
      italic: "נטוי",
      underline: "קו תחתון",
      strike: "קו חוצה",
      alignments: {
        start: "יישור לתחילת השורה",
        center: "מרכוז",
        end: "יישור לסוף השורה",
        justify: "יישור לשני הצדדים",
      },
      textStyles: {
        fontFamily: {
          label: "גופן",
          options: { default: "גופן רגיל", serif: "סריף", mono: "קוד" },
        },
        fontSize: {
          label: "גודל טקסט",
          options: {
            small: "קטן",
            default: "גודל רגיל",
            large: "גדול",
            huge: "ענק",
          },
        },
        color: {
          label: "צבע טקסט",
          options: {
            default: "צבע רגיל",
            primary: "סגול",
            red: "אדום",
            green: "ירוק",
            brown: "חום",
          },
        },
      },
    },
    tip: {
      title: "טיפ לכתיבה:",
      body: "תארו מה הלקוח צריך, מה הקלט שהמערכת מקבלת ומה הפלט שהיא צריכה להחזיר.",
    },
  },
} as const;

export type Messages = typeof heMessages;
