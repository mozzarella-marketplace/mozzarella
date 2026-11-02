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
  brand: {
    name: "מוצרלה",
    tagline: "פותרים בעיות",
    copyright: "© מוצרלה (Mozzarella) • לא כותבים קוד. פותרים בעיות.",
  },
  navigation: {
    label: "ניווט ראשי",
    marketplace: "מרקטפלייס",
    upcoming: ["פרויקט פעיל", "עבודות שלי", "מבט מורה"],
  },
  marketplace: {
    status: "שוק פרויקטים פתוח",
    opportunities: (count: number) => `• ${count} הזדמנויות פעילות`,
    title: "לקוחות מחכים לפתרון שלך",
    subtitle: "מוצאים בעיה. מדברים עם הלקוח. בונים פתרון.",
    searchLabel: "חיפוש לקוחות",
    searchPlaceholder: "חיפוש לקוח או תחום עניין…",
    filtersLabel: "סינון לפי תחום",
    allFilter: (count: number) => `הכל (${count})`,
    categories: {
      smallBusiness: "עסקים קטנים",
      ticketingSystems: "מערכות כרטיסים",
      managementAndData: "ניהול ונתונים",
    },
    coins: (count: number) => `${count} מטבעות`,
    customerByline: (role: string, businessName: string, city: string) =>
      `${role}, ${businessName} • ${city}`,
    quoted: (text: string) => `״${text}״`,
    difficulty: {
      beginner: "רמת כניסה",
      intermediate: "רמה בינונית",
      advanced: "מתקדם",
    },
    estimatedMinutes: (minutes: number) => `~${minutes} דק׳ עבודה`,
    talkAction: (name: string) => `לדבר עם ${name}`,
    loading: "הלקוחות נטענים…",
    emptyState: {
      title: "אין כרגע לקוחות זמינים",
      description: "לקוחות חדשים יצטרפו בקרוב. כדאי לחזור לכאן מאוחר יותר.",
    },
    searchEmptyState: {
      title: "לא נמצאו לקוחות",
      description: "אפשר לנסות מילת חיפוש או תחום אחרים.",
    },
    pedagogy: {
      label: "עקרון פדגוגי מנחה",
      quote:
        "״לא כותבים קוד סתם. מדברים עם הלקוח, מגלים מה הוא באמת צריך, ופותרים לו את הבעיה.״",
      waitingCount: (count: number) => `${count} לקוחות ממתינים לשיחה`,
    },
  },
  customers: {
    backToMarketplace: "חזרה לכל הלקוחות",
  },
} as const;

export type Messages = typeof heMessages;
