import { prisma } from "../lib/db/prisma";
import type { CustomerSummary } from "../types/customer";

// Fixed UUIDs keep the seed idempotent: re-running it updates these rows instead of adding new ones.
const mockCustomers: CustomerSummary[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "דני",
    role: "בעלים",
    businessName: "מאפיית דני",
    city: "פלורנטין, תל אביב",
    avatar: "🥐",
    category: "smallBusiness",
    domain: "קמעונאות ומזון",
    difficulty: "beginner",
    rewardCoins: 80,
    topic: "חישוב הכנסות",
    estimatedMinutes: 30,
    summary:
      "אני צריך עזרה דחופה עם המכירות של המאפייה. בסוף כל יום יש לי ערימות קבלות ואני לא יודע כמה באמת הרווחתי אחרי הוצאות הקמח והחשמל.",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "מיכל",
    role: "מנהלת",
    businessName: "קולנוע השכונה",
    city: "חיפה",
    avatar: "🎬",
    category: "ticketingSystems",
    domain: "כרטיסים ושירות",
    difficulty: "intermediate",
    rewardCoins: 120,
    topic: "תנאים ולוגיקה",
    estimatedMinutes: 45,
    summary:
      "אני מנסה לעשות קצת סדר במערכת הכרטיסים שלנו, במיוחד בחישוב ההנחות המורכבות לחיילים, אזרחים ותיקים וילדים בסופי שבוע.",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "רועי",
    role: "מייסד",
    businessName: "Happy Paws",
    city: "הרצליה",
    avatar: "🐶",
    category: "managementAndData",
    domain: "שירותי חיות מחמד",
    difficulty: "advanced",
    rewardCoins: 180,
    topic: "מבני נתונים",
    estimatedMinutes: 90,
    summary:
      "המספרה והפנסיון גדלו מהר מדי. יש לי יותר מדי לקוחות ואני צריך דרך ממוחשבת לנהל את התיקים, הגזעים ותאריכי החיסונים הקריטיים.",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "תמר",
    role: "מנהלת",
    businessName: "שליחויות ירוקות",
    city: "תל אביב",
    avatar: "🚴",
    category: "managementAndData",
    domain: "לוגיסטיקה עירונית",
    difficulty: "intermediate",
    rewardCoins: 150,
    topic: "לולאות וחישובים",
    estimatedMinutes: 60,
    summary:
      "אנחנו רוצים לחשב את המסלול הזול והמהיר ביותר למשלוח חבילות ברחבי העיר, בהתאם לעומסי התנועה ולמרחק שכל שליח עובר.",
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    name: "נועה",
    role: "מנהלת",
    businessName: "מרפאת השכונה",
    city: "באר שבע",
    avatar: "🩺",
    category: "ticketingSystems",
    domain: "בריאות ושירות",
    difficulty: "intermediate",
    rewardCoins: 110,
    topic: "מערכים וחיפוש",
    estimatedMinutes: 40,
    summary:
      "תורים במרפאה נקבעים לפעמים באותה שעה. אני צריכה כלי שבודק אם שעה פנויה לפני שקובעים תור חדש.",
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    name: "אבי",
    role: "בעלים",
    businessName: "המכולת של אבי",
    city: "ירושלים",
    avatar: "🛒",
    category: "smallBusiness",
    domain: "קמעונאות ומזון",
    difficulty: "beginner",
    rewardCoins: 70,
    topic: "משתנים וקלט/פלט",
    estimatedMinutes: 25,
    summary:
      "מוצרים נגמרים מהמדפים בלי שאני שם לב. אני רוצה לדעת מראש אילו מוצרים צריך להזמין מחדש.",
  },
];

const seedCustomers = async () => {
  for (const customer of mockCustomers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      create: customer,
      update: customer,
    });
  }
};

seedCustomers().finally(() => prisma.$disconnect());
