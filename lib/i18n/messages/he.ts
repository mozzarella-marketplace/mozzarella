export const heMessages = {
  app: {
    title: "מוצרלה",
    description: "פלטפורמת יזמות למתכנתים צעירים",
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
      anonymousAccess: "כניסה אנונימית מהירה ללא סיסמה",
      classCode: "קוד כיתה",
      codeLengthHint: "4 תווים",
      studentCode: "קוד תלמיד אישי",
      identificationHint: "זיהוי מזהה",
      submit: "כניסה למרקטפלייס",
      securityNote: "הקוד מנופק על ידי המורה וזהותך לא נשמרת",
    },
    validation: {
      required: "שדה חובה",
      length: "קוד בעל 4 תווים",
      format: "מספרים ואותיות A-F בלבד",
      formError: "יש שגיאות בטופס, נסה שוב לאחר תיקונם",
    },
  },
} as const;

export type Messages = typeof heMessages;
