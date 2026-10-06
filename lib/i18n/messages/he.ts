export const heMessages = {
  app: {
    title: "Mozzarella",
    description: "Mozzarella learning platform for basic programming",
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
    featured: "פופולרי עכשיו",
    coins: (count: number) => `${count} מטבעות`,
    guaranteedReward: "תשלום מובטח",
    customerByline: (role: string, businessName: string, city: string) =>
      `${role}, ${businessName} • ${city}`,
    quoted: (text: string) => `״${text}״`,
    difficulty: {
      beginner: "רמת כניסה",
      intermediate: "רמה בינונית",
      advanced: "מתקדם",
    },
    languages: {
      java: "Java",
      csharp: "C#",
    },
    iterations: (count: number) =>
      count === 1 ? "איטרציה אחת" : `${count} איטרציות`,
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
