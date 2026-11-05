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
  appShell: {
    brandName: "מוצרלה",
    tagline: "פותרים בעיות",
    student: "תלמיד",
    class: "כיתה",
  },
  marketplace: {
    title: "לקוחות עם אתגרים אמיתיים",
    description: "בחרו לקוח, הכירו את העסק שלו וגלו איזו בעיה תוכלו לפתור.",
    emptyTitle: "אין כרגע לקוחות זמינים",
    emptyDescription: "כדאי לנסות שוב אחרי טעינת נתוני ההדגמה.",
    customer: "הלקוח",
    category: "תחום",
    difficulty: "רמת קושי",
    location: "מיקום",
    domain: "עולם תוכן",
    topic: "נושא לתרגול",
    reward: "תגמול",
    coins: "מטבעות",
    customerNeed: "מה הלקוח צריך?",
    backToMarketplace: "חזרה למרקטפלייס",
    categories: {
      smallBusiness: "עסקים קטנים",
      ticketingSystems: "כרטיסים ושירות",
      managementAndData: "ניהול ונתונים",
    },
    difficulties: {
      beginner: "מתחילים",
      intermediate: "ביניים",
      advanced: "מתקדמים",
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
