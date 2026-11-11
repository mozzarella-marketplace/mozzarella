export const heMessages = {
  app: {
    title: "מוצרלה",
    description: "לומדים לתכנת דרך שיחה עם לקוחות ופתרון בעיות מהעולם האמיתי",
    error: {
      title: "לא ניתן לטעון את העמוד כרגע",
      description: "ייתכן שיש תקלה זמנית. נסה שוב בעוד רגע.",
      retry: "נסה שוב",
    },
  },
  login: {
    brandName: "מוצרלה",
    tagline: "ערך קודם קוד",
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
    logout: {
      submit: "התנתקות",
      submitting: "מתנתקים...",
      unavailable: "לא ניתן להשלים את ההתנתקות כרגע. נסו שוב.",
    },
    login: {
      invalidInput: "מזהה משתמש וכיתה חייבים להכיל בדיוק ארבע תווים",
      invalidCredentials: "מזהה משתמש או כיתה שגויים",
      unavailable: "התחברות אינה זמינה כרגע",
    },
  },
  brand: {
    tagline: "ערך קודם קוד",
    copyright: "© מוצרלה (Mozzarella) • ערך קודם קוד",
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
  conversation: {
    api: {
      invalidRequest: "ההודעה אינה תקינה",
      notFound: "הלקוח אינו זמין",
      unavailable: "השיחה אינה זמינה כרגע. נסו שוב בעוד רגע.",
      dailyLimit: (count: number) =>
        `הגעתם למכסת ${count} ההודעות היומית. אפשר להמשיך מחר.`,
    },
    title: "שיחה עם הלקוח",
    empty: "ספרו ללקוח מה תרצו להבין על הבעיה שלו.",
    placeholder: "כתבו הודעה ללקוח...",
    inputLabel: "הודעה ללקוח",
    aiDisclaimer: (customerName: string) =>
      `${customerName} הוא יציר AI ולכן יכול לטעות - בדיוק כמו בני אדם.`,
    send: "שליחה",
    sending: "שולחים...",
    waiting: "הלקוח חושב...",
    error: "לא ניתן לשלוח את ההודעה. נסו שוב.",
    dailyLimit: (count: number) =>
      `הגעתם למכסת ${count} ההודעות היומית. אפשר להמשיך מחר.`,
  },
  programmingLanguages: {
    java: "Java",
    csharp: "C#",
  },
  userStory: {
    api: {
      invalidRequest: "בקשת השמירה אינה תקינה",
      notFound: "הלקוח אינו זמין",
      unavailable: "נדרשת התחברות או ששירות ההתחברות אינו זמין",
      saveFailed: "לא ניתן לשמור את סיפור המשתמש כרגע",
    },
    title: "מה הבנתי מהלקוח עד כה",
    language: "שפת פיתוח",
    languagePlaceholder: "בחרו שפה",
    label: "סיפור המשתמש",
    placeholder: (customerName: string) =>
      `כתבו כאן את סיפור המשתמש שגיבשתם עם ${customerName}...`,
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
            primary: "כחול כהה",
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
