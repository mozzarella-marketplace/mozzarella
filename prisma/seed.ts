import { prisma } from "../lib/db/prisma";
import type { CustomerSummary } from "../types/customer";

const mockCustomers: CustomerSummary[] = [
  {
    id: "seed-bakery",
    name: "דני",
    role: "בעלים",
    businessName: "מאפיית דני",
    city: "פלורנטין, תל אביב",
    avatar: "🥐",
    category: "smallBusiness",
    domain: "קמעונאות ומזון",
    language: "java",
    difficulty: "beginner",
    rewardCoins: 80,
    topic: "חישוב הכנסות",
    iterationCount: 2,
    estimatedMinutes: 30,
    summary:
      "אני צריך עזרה דחופה עם המכירות של המאפייה. בסוף כל יום יש לי ערימות קבלות ואני לא יודע כמה באמת הרווחתי אחרי הוצאות הקמח והחשמל.",
    isFeatured: true,
  },
  {
    id: "seed-cinema",
    name: "מיכל",
    role: "מנהלת",
    businessName: "קולנוע השכונה",
    city: "חיפה",
    avatar: "🎬",
    category: "ticketingSystems",
    domain: "כרטיסים ושירות",
    language: "java",
    difficulty: "intermediate",
    rewardCoins: 120,
    topic: "תנאים ולוגיקה",
    iterationCount: 2,
    estimatedMinutes: 45,
    summary:
      "אני מנסה לעשות קצת סדר במערכת הכרטיסים שלנו, במיוחד בחישוב ההנחות המורכבות לחיילים, אזרחים ותיקים וילדים בסופי שבוע.",
    isFeatured: false,
  },
  {
    id: "seed-pet-care",
    name: "רועי",
    role: "מייסד",
    businessName: "Happy Paws",
    city: "הרצליה",
    avatar: "🐶",
    category: "managementAndData",
    domain: "שירותי חיות מחמד",
    language: "java",
    difficulty: "advanced",
    rewardCoins: 180,
    topic: "מבני נתונים",
    iterationCount: 3,
    estimatedMinutes: 90,
    summary:
      "המספרה והפנסיון גדלו מהר מדי. יש לי יותר מדי לקוחות ואני צריך דרך ממוחשבת לנהל את התיקים, הגזעים ותאריכי החיסונים הקריטיים.",
    isFeatured: false,
  },
  {
    id: "seed-green-delivery",
    name: "תמר",
    role: "מנהלת",
    businessName: "שליחויות ירוקות",
    city: "תל אביב",
    avatar: "🚴",
    category: "managementAndData",
    domain: "לוגיסטיקה עירונית",
    language: "java",
    difficulty: "intermediate",
    rewardCoins: 150,
    topic: "לולאות וחישובים",
    iterationCount: 2,
    estimatedMinutes: 60,
    summary:
      "אנחנו רוצים לחשב את המסלול הזול והמהיר ביותר למשלוח חבילות ברחבי העיר, בהתאם לעומסי התנועה ולמרחק שכל שליח עובר.",
    isFeatured: false,
  },
  {
    id: "seed-clinic",
    name: "נועה",
    role: "מנהלת",
    businessName: "מרפאת השכונה",
    city: "באר שבע",
    avatar: "🩺",
    category: "ticketingSystems",
    domain: "בריאות ושירות",
    language: "java",
    difficulty: "intermediate",
    rewardCoins: 110,
    topic: "מערכים וחיפוש",
    iterationCount: 2,
    estimatedMinutes: 40,
    summary:
      "תורים במרפאה נקבעים לפעמים באותה שעה. אני צריכה כלי שבודק אם שעה פנויה לפני שקובעים תור חדש.",
    isFeatured: false,
  },
  {
    id: "seed-grocery",
    name: "אבי",
    role: "בעלים",
    businessName: "המכולת של אבי",
    city: "ירושלים",
    avatar: "🛒",
    category: "smallBusiness",
    domain: "קמעונאות ומזון",
    language: "java",
    difficulty: "beginner",
    rewardCoins: 70,
    topic: "משתנים וקלט/פלט",
    iterationCount: 1,
    estimatedMinutes: 25,
    summary:
      "מוצרים נגמרים מהמדפים בלי שאני שם לב. אני רוצה לדעת מראש אילו מוצרים צריך להזמין מחדש.",
    isFeatured: false,
  },
];

async function seedCustomers() {
  for (const customer of mockCustomers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      create: customer,
      update: customer,
    });
  }
}

seedCustomers().finally(() => prisma.$disconnect());
