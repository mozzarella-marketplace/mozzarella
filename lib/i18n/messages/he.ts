export const heMessages = {
  app: {
    title: "מוצרלה",
    description: "פלטפורמת יזמות למתכנתים צעירים",
    error: {
      title: "לא ניתן לטעון את העמוד כרגע",
      description: "ייתכן שיש תקלה זמנית. נסה שוב בעוד רגע.",
      retry: "נסה שוב",
    },
  },
  login: {
    brandName: "מוצרלה",
    tagline: "לא כותבים קוד פותרים בעיות.",
    welcomeTitle: "ברוכים הבאים",
    welcomeDescription: "יש בעיות לפתור. היכנס כדי לפגוש את הלקוחות שמחכים לך.",
    customerPromise: "אתה לא מקבל שיעורי בית. אתה מקבל לקוח אמיתי.",
    businessCustomers: "לקוחות עסקיים אמיתיים",
    conversation: "שיחה וגילוי דרישות",
    coins: "תשלום במטבעות",
    form: {
      anonymousAccess: "כניסה בעזרת קוד כיתה וקוד משתמש",
      classCode: "קוד כיתה",
      codeLengthHint: "4 תווים",
      studentCode: "קוד תלמיד אישי",
      identificationHint: "זיהוי מזהה",
      submit: "כניסה למרקטפלייס",
      submitting: "מתחברים...",
      securityNote: "פרטי הכניסה אינם נשמרים בדפדפן",
    },
    validation: {
      required: "שדה חובה",
      length: "קוד בעל 4 תווים",
      format: "מספרים ואותיות A-F בלבד",
    },
  },
  auth: {
    login: {
      invalidInput: "מזהה משתמש וכיתה חייבים להכיל בדיוק ארבע תווים",
      invalidCredentials: "מזהה משתמש או כיתה שגויים",
      unavailable: "התחברות אינה זמינה כרגע",
    },
  },
} as const;

export type Messages = typeof heMessages;
