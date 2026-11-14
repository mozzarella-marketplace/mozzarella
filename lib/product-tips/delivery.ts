import "server-only";
import type { LocaleCode } from "@/consts/locales";
import { prisma } from "@/prisma/prisma";
import type { DeliveredProductTip } from "./delivery-response";
import { selectNextTip } from "./select-next-tip";

// Advances the student's rotation in one transaction. Locking the progress row serializes concurrent deliveries
// for the same student and locale, so two simultaneous visits never receive the same next tip.
export const deliverNextProductTip = (
  userId: string,
  locale: LocaleCode,
): Promise<DeliveredProductTip | null> =>
  prisma.$transaction(async (transaction) => {
    await transaction.productTipProgress.createMany({
      data: [{ userId, locale }],
      skipDuplicates: true,
    });

    const [progress] = await transaction.$queryRaw<
      { last_display_order: number | null }[]
    >`SELECT last_display_order FROM product_tip_progress WHERE user_id = ${userId} AND locale = ${locale} FOR UPDATE`;

    const activeTips = await transaction.productTip.findMany({
      where: { locale, isActive: true },
      orderBy: { displayOrder: "asc" },
      select: {
        key: true,
        title: true,
        body: true,
        action: true,
        displayOrder: true,
      },
    });
    const tip = selectNextTip(activeTips, progress?.last_display_order ?? null);

    if (!tip) {
      return null;
    }

    await transaction.productTipProgress.update({
      where: { userId_locale: { userId, locale } },
      data: { lastDisplayOrder: tip.displayOrder },
    });

    return {
      key: tip.key,
      title: tip.title,
      body: tip.body,
      action: tip.action,
    };
  });
